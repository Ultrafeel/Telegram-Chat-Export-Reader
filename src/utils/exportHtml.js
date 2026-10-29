const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const NOT_INCLUDED = '(File not included';
const isUsable = path => typeof path === 'string' && path && !path.includes(NOT_INCLUDED);
// Paths in result.json are relative to the export folder, so they stay relative in the output.
const href = path => esc(path.split('/').map(encodeURIComponent).join('/'));

const renderMedia = source => {
  const main = source.file || source.photo;
  const parts = [];
  if (source.location_information) {
    const { latitude, longitude } = source.location_information;
    parts.push(`<a href="https://maps.google.com/?q=${esc(latitude)},${esc(longitude)}" target="_blank" rel="noreferrer">Location ${esc(latitude)}, ${esc(longitude)}</a>`);
  }
  if (source.contact_information) {
    const c = source.contact_information;
    parts.push(`<div>Contact: ${esc([c.first_name, c.last_name].filter(Boolean).join(' '))} ${esc(c.phone_number || '')}</div>`);
  }
  if (!main) return parts.join('');
  if (!isUsable(main)) return parts.concat('<div class="missing">File not included in export</div>').join('');

  const url = href(main);
  const thumb = isUsable(source.thumbnail) ? href(source.thumbnail) : '';
  const link = (label) => `<a href="${url}" target="_blank">${esc(label)}</a>`;
  switch (source.media_type) {
    case 'sticker':
      if (/\.webm$/i.test(main)) parts.push(`<video src="${url}" autoplay loop muted playsinline class="sticker"></video>`);
      else if (/\.tgs$/i.test(main)) parts.push(thumb ? `<img src="${thumb}" class="sticker" alt="sticker">` : link(`Sticker ${source.sticker_emoji || ''}`));
      else parts.push(`<img src="${url}" class="sticker" alt="${esc(source.sticker_emoji || 'sticker')}">`);
      break;
    case 'animation':
      parts.push(`<video src="${url}" autoplay loop muted playsinline controls></video>`);
      break;
    case 'video_message':
      parts.push(`<video src="${url}" controls class="round"></video>`);
      break;
    case 'video_file':
      parts.push(`<video src="${url}" ${thumb ? `poster="${thumb}"` : ''} controls preload="none"></video>`);
      break;
    case 'voice_message':
    case 'audio_file':
      parts.push(`<audio src="${url}" controls preload="none"></audio>`);
      break;
    default:
      if (source.photo) parts.push(`<a href="${url}" target="_blank"><img src="${url}" loading="lazy" alt="photo"></a>`);
      else parts.push(link(source.file_name || main.split('/').pop()));
  }
  return parts.join('');
};

const renderMessage = message => {
  if (message.type === 'service') return `<div class="service">${esc(message.text)}</div>`;
  const src = message.sourceJson || {};
  const reply = message.replyTo;
  const quoted = reply?.quotedMessage;
  return `<div class="msg" id="${esc(message.id)}">
<div class="from">${esc(message.from)} <span class="time">${esc(message.time)}</span></div>
${message.forwardedFrom ? `<div class="fwd">Forwarded from ${esc(message.forwardedFrom)}</div>` : ''}
${reply ? `<div class="reply">${quoted ? `<a href="#${esc(quoted.id)}">${esc(quoted.from)}: ${esc((quoted.text || '').slice(0, 120))}</a>` : esc(reply.text)}</div>` : ''}
${renderMedia(src)}
<div class="text">${message.formattedHTML || esc(message.text)}</div>
</div>`;
};

export const buildStaticHtml = (title, messages) => `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<style>
body{font-family:system-ui,sans-serif;background:#f3f4f6;margin:0;color:#111}
main{max-width:720px;margin:0 auto;padding:16px}
h1{font-size:1.25rem}
.note{font-size:.8rem;color:#6b7280;margin-bottom:12px}
.msg{background:#fff;border-radius:10px;padding:8px 12px;margin:8px 0;box-shadow:0 1px 2px #0002}
.from{font-weight:600;color:#2563eb}.time{font-weight:400;font-size:.75rem;color:#6b7280;margin-left:6px}
.fwd,.reply{font-size:.8rem;color:#6b7280;border-left:3px solid #93c5fd;padding-left:6px;margin:4px 0}
.service{text-align:center;font-size:.8rem;color:#6b7280;margin:10px 0}
.text{white-space:pre-wrap;word-break:break-word}
.missing{color:#b91c1c;font-size:.85rem}
img,video{max-width:100%;max-height:420px;border-radius:6px;display:block;margin:4px 0}
.sticker{max-width:180px}.round{border-radius:50%;width:240px;height:240px;object-fit:cover}
.formatted-spoiler{background:#9ca3af;color:transparent;border-radius:3px;cursor:pointer}
.formatted-spoiler.on{background:#e5e7eb;color:inherit}
pre{background:#f3f4f6;padding:6px;border-radius:6px;overflow:auto}
blockquote{border-left:3px solid #93c5fd;margin:4px 0;padding-left:8px}
@media(prefers-color-scheme:dark){body{background:#111827;color:#e5e7eb}.msg{background:#1f2937}pre{background:#111827}.formatted-spoiler.on{background:#374151}}
</style></head><body><main>
<h1>${esc(title)}</h1>
<div class="note">Media is linked by relative path. Keep this file in the Telegram export folder (next to result.json) so images and files load.</div>
${messages.map(renderMessage).join('\n')}
</main>
<script>document.querySelectorAll('.formatted-spoiler').forEach(function(e){var h=e.dataset.hidden,t=e.textContent;e.onclick=function(){var on=e.classList.toggle('on');e.textContent=on?h:t}})</script>
</body></html>`;

export const downloadStaticHtml = (title, messages) => {
  const blob = new Blob([buildStaticHtml(title, messages)], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(title || 'chat').replace(/[\\/:*?"<>|]+/g, '_')}.html`;
  a.click();
  URL.revokeObjectURL(url);
};
