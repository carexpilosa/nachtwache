module.exports = {
  'Demo test firsttest' : function (browser) {
    browser
      .url('http://localhost:8383/nachtwache/first.html')
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('input[name=testInput]', 1000)
      .clearValue('input[name=testInput]')
      .setValue('input[name=testInput]', 'nightwatch')
      .waitForElementVisible('button[name=btnG]', 1000)
      .click('button[name=btnG]')
      .pause(1000)
      .assert.value('input[name=testInput]', 'nightwatch')
      .assert.containsText('h3#a', 'Sorbische Ostereier')
      .end();
  }
};