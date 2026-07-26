import { describe, it } from 'bun:test';
import { assert } from 'chai';

import { contentSecurityPolicy, scriptHash, updateContentSecurityPolicy } from '../../../scripts/content_security_policy.ts';


describe('Content Security Policy', () => {
  it('hashes inline scripts but allows external scripts by origin', () => {
    const html = `
      <script>alert('Hello, world.');</script>
      <script src='https://browser-update.org/update.js'></script>
    `;
    const policy = contentSecurityPolicy(html);

    assert.include(policy, scriptHash(`alert('Hello, world.');`));
    assert.include(policy, 'https://browser-update.org');
    assert.notMatch(policy, /script-src [^;]*'unsafe-inline'/);
  });

  it('inserts the policy immediately after the charset declaration', () => {
    const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8'>
    <title>Test</title>
  </head>
</html>
`;
    const updated = updateContentSecurityPolicy(html);

    assert.match(updated, /<meta charset='utf-8'>\n {4}<meta http-equiv="Content-Security-Policy"/);
    assert.strictEqual(updateContentSecurityPolicy(updated), updated);
  });

  it('rejects documents without an early charset declaration', () => {
    assert.throws(
      () => updateContentSecurityPolicy('<html></html>'),
      'missing UTF-8 charset meta element'
    );
  });
});
