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

const TRUSTED_TYPES_CONFIG: Config = {
  RETURN_TRUSTED_TYPE: false
};

const IS_SUPPORTED = supportsSanitization();


function supportsSanitization(): boolean {
  if (typeof DOMPurify.sanitize !== 'function') return false;

  try {
    const probe = DOMPurify.sanitize('<img src="x" onerror="x">', CONFIG);
    return probe.includes('<img') && !probe.includes('onerror');
  } catch {
    return false;
  }
}


/**
 * Escapes text so it can be safely interpolated into an HTML string.
 * @param value - Untrusted text
 * @return Text with HTML-significant characters encoded
 */
export function utilEscapeHTML(value: Nullable<string>): string {
  if (!value) return '';
  return value.replace(/[&<>"']/g, char => {
    switch (char) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case '\'': return '&#39;';
      default: return char;
    }
  });
}


/**
 * Sanitizes untrusted HTML while preserving the markup used by Rapid's UI.
 * Falls back to escaping all markup when a compatible DOM is unavailable.
 * @param dirty - Untrusted HTML
 * @return HTML with executable content removed
 */
export function utilSanitizeHTML(dirty: Nullable<string>): string {
  if (!dirty) return '';
  if (!IS_SUPPORTED) return utilEscapeHTML(dirty);
  return DOMPurify.sanitize(dirty, CONFIG);
}


/**
 * Sanitizes HTML assigned through the document-wide Trusted Types policy.
 * Uses DOMPurify's standard allowlist to preserve Rapid's existing UI markup.
 * @param dirty - HTML assigned to a Trusted Types injection sink
 * @return HTML with executable content removed
 */
export function utilSanitizeHTMLForTrustedTypes(dirty: Nullable<string>): string {
  if (!dirty) return '';
  if (!IS_SUPPORTED) return utilEscapeHTML(dirty);
  return DOMPurify.sanitize(dirty, TRUSTED_TYPES_CONFIG);
}
