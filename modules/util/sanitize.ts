import DOMPurify from 'dompurify';

import type { Config } from 'dompurify';


const CONFIG: Config = {
  ALLOWED_TAGS: [
    'a', 'b', 'blockquote', 'br', 'code', 'del', 'em', 'h1', 'h2', 'h3', 'h4',
    'h5', 'h6', 'hr', 'i', 'img', 'kbd', 'li', 'mark', 'ol', 'option', 'p',
    'pre', 'select', 'small', 'span', 'strong', 'sub', 'sup', 'table', 'tbody',
    'td', 'th', 'thead', 'tr', 'u', 'ul'
  ],
  ALLOWED_ATTR: [
    'alt', 'class', 'data-osm-id', 'data-osm-type', 'href', 'id', 'lang', 'name',
    'rel', 'src', 'target', 'title', 'value'
  ],
  ALLOW_DATA_ATTR: false,
  ADD_ATTR: ['target'],
  FORBID_TAGS: ['button', 'form', 'iframe', 'input', 'script', 'style'],
  FORBID_ATTR: ['onclick', 'onerror', 'onload', 'onmouseover', 'style']
};


/**
 * Sanitizes untrusted HTML while preserving the markup used by Rapid's UI.
 * @param dirty - Untrusted HTML
 * @return HTML with executable content removed
 */
export function utilSanitizeHTML(dirty: Nullable<string>): string {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, CONFIG);
}
