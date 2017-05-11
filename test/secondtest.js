module.exports = {
  'Demo test Google' : function (client) {
    client
      .url('http://www.google.com')
      .waitForElementVisible('body', 1000)
      .assert.title('Google')
      .waitForElementVisible('input[name=q]', 1000)
      .assert.visible('input[name=q]')
      .pause(1000)
      .setValue('input[name=q]', ['nightwatch', client.Keys.ENTER])
      .assert.containsText('div#ires h3', 'Nightwatch – Nachtwache – Wikipedia')
      .pause(10000)
      .end();
  }
};