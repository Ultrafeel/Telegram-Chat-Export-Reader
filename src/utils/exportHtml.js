import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import MessageItem from '../components/MessageItem';
import { blobRelativePaths } from './fileHandler';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const collectCss = () => Array.from(document.styleSheets).map(sheet => {
  try {
    return Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n');
  } catch {
    return '';
  }
}).join('\n');

// Swap blob: URLs for paths relative to the export folder.
const relinkMedia = html => html.replace(/blob:[^"'\s)<]+/g, url => {
  const path = blobRelativePaths.get(url.replace(/&amp;/g, '&'));
  return path ? path.split('/').map(encodeURIComponent).join('/') : url;
});

export const buildStaticHtml = (title, messages) => {
  const body = messages.map(message => renderToStaticMarkup(
    React.createElement(MessageItem, { message, index: 0, onHeightChange: () => {} })
  ) + (message.sourceJson
    ? `<details class="src"><summary>JSON</summary><pre>${esc(JSON.stringify(message.sourceJson, null, 2))}</pre></details>`
    : '')).join('\n');
  const dark = document.documentElement.classList.contains('dark');

  return relinkMedia(`<!DOCTYPE html>
<html lang="en"${dark ? ' class="dark"' : ''}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<style>${collectCss()}
button[title="View message JSON"]{display:none}
details.src{margin:-8px 0 16px 40px;font-size:12px;color:#6b7280}
details.src summary{cursor:pointer;width:max-content}
details.src pre{max-height:60vh;overflow:auto;padding:8px;background:#f3f4f6;border-radius:6px;color:#111}</style></head>
<body class="bg-gray-50"><main style="max-width:48rem;margin:0 auto;padding:16px">
<h1 class="text-lg font-semibold">${esc(title)}</h1>
<p class="text-xs text-gray-500" style="margin-bottom:16px">Media is linked by relative path. Keep this file in the Telegram export folder (next to result.json) so pictures and files load.</p>
${body}
</main></body></html>`);
};

export const downloadStaticHtml = (title, messages) => {
  const blob = new Blob([buildStaticHtml(title, messages)], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  // Full-width look-alikes keep the whole chat name readable in the file name.
  const fullWidth = { '\\': '＼', '/': '／', ':': '：', '*': '＊', '?': '？', '"': '＂', '<': '＜', '>': '＞', '|': '｜' };
  const fileName = (title || 'chat').replace(/[\\/:*?"<>|]/g, c => fullWidth[c]).replace(/[\u0000-\u001f]+/g, ' ').trim().replace(/[. ]+$/, '');
  a.download = `${fileName || 'chat'}.html`;
  a.click();
  URL.revokeObjectURL(url);
};
