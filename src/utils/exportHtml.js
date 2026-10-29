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
  )).join('\n');
  const dark = document.documentElement.classList.contains('dark');

  return relinkMedia(`<!DOCTYPE html>
<html lang="en"${dark ? ' class="dark"' : ''}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<style>${collectCss()}
button[title="View message JSON"]{display:none}</style></head>
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
  a.download = `${(title || 'chat').replace(/[\\/:*?"<>|]+/g, '_')}.html`;
  a.click();
  URL.revokeObjectURL(url);
};
