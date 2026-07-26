describe('Trusted Types', () => {
  it('sanitizes HTML and restricts executable URLs', () => {
    let policyName;
    let policyOptions;
    const factory = {
      defaultPolicy: null,
      createPolicy: (name, options) => {
        policyName = name;
        policyOptions = options;
        return {};
      }
    };

    Rapid.utilInitTrustedTypes(factory);

    assert.strictEqual(policyName, 'default');

    const clean = policyOptions.createHTML('<img src="x" onerror="alert(1)"><script>alert(2)</script>');
    const container = document.createElement('div');
    container.innerHTML = clean;
    assert.strictEqual(container.querySelectorAll('script').length, 0);
    assert.strictEqual(container.querySelectorAll('[onerror]').length, 0);

    assert.strictEqual(
      policyOptions.createScriptURL('/dist/js/rapid-worker.js'),
      '/dist/js/rapid-worker.js'
    );
    assert.strictEqual(
      policyOptions.createScriptURL('https://browser-update.org/update.show.min.js'),
      'https://browser-update.org/update.show.min.js'
    );
    assert.throws(() => policyOptions.createScriptURL('https://example.com/code.js'), TypeError);
    assert.throws(() => policyOptions.createScriptURL('blob:https://rapideditor.test/code'), TypeError);
    // This literal verifies that the policy rejects the protocol.
    assert.throws(() => policyOptions.createScriptURL('javascript:alert(1)'), TypeError);  // eslint-disable-line no-script-url
  });

  it('preserves an embedding page policy', () => {
    let called = false;
    const factory = {
      defaultPolicy: {},
      createPolicy: () => {
        called = true;
      }
    };

    Rapid.utilInitTrustedTypes(factory);
    assert.isFalse(called);
  });
});
