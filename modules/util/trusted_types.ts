import { utilSanitizeHTMLForTrustedTypes } from './sanitize.ts';

import type { TrustedTypePolicyFactory } from 'trusted-types/lib';


type PolicyFactory = Pick<TrustedTypePolicyFactory, 'createPolicy' | 'defaultPolicy'>;
type WindowWithTrustedTypes = Window & { trustedTypes?: PolicyFactory };


/**
 * Accepts dynamic script URLs required by Rapid while rejecting other origins.
 * @param value - Candidate script URL
 * @param baseURL - URL of the current document
 * @return The unchanged URL when it is allowed
 * @throws TypeError if the URL is invalid or not an allowed script source
 */
export function utilSafeScriptURL(
  value: string,
  baseURL: string = typeof document === 'undefined' ? 'http://localhost/' : document.baseURI
): string {
  let url: URL;
  let base: URL;

  try {
    base = new URL(baseURL);
    if (!/https?:/.test(base.protocol)) {
      base = new URL('http://localhost/');
    }
    url = new URL(value, base);
  } catch {
    throw new TypeError('Trusted Types rejected an invalid script URL');
  }

  const isSameOrigin = /https?:/.test(url.protocol) && url.origin === base.origin;
  const isBrowserUpdate =
    url.origin === 'https://browser-update.org' &&
    ['/update.show.min.js', '/update.test.js'].includes(url.pathname);

  if (isSameOrigin || isBrowserUpdate) return value;
  throw new TypeError(`Trusted Types rejected script URL: ${url.origin}`);
}


/**
 * Installs Rapid's document-wide Trusted Types policy in supporting browsers.
 * Existing host-page default policies are left in control for embedded Rapid.
 * @param factory - Browser Trusted Types policy factory
 */
export function utilInitTrustedTypes(
  factory: PolicyFactory | undefined =
    typeof window === 'undefined' ? undefined : (window as WindowWithTrustedTypes).trustedTypes
): void {
  if (!factory || factory.defaultPolicy) return;

  factory.createPolicy('default', {
    createHTML: input => utilSanitizeHTMLForTrustedTypes(input),
    createScriptURL: input => utilSafeScriptURL(input)
  });
}


utilInitTrustedTypes();
