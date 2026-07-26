describe('utilSanitizeHTML', () => {

  it('fails closed for executable markup', () => {
    const dirty = '<script>alert(1)</script><a href="javascript:alert(2)">link</a><p onclick="alert(3)">text</p>';
    const selection = d3.select(document.createElement('div'));

    selection.html(Rapid.utilSanitizeHTML(dirty));

    assert.strictEqual(selection.selectAll('script').size(), 0);
    assert.strictEqual(selection.selectAll('[href^="javascript:"]').size(), 0);
    assert.strictEqual(selection.selectAll('[onclick]').size(), 0);
  });
});


describe('utilEscapeHTML', () => {

  it('escapes HTML-significant characters', () => {
    assert.strictEqual(
      Rapid.utilEscapeHTML(`<a title="'">A&B</a>`),
      '&lt;a title=&quot;&#39;&quot;&gt;A&amp;B&lt;/a&gt;'
    );
  });
});
