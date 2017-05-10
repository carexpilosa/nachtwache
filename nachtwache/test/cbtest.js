module.exports = {
  'Chess png test' : function (browser) {
    browser
      .url('http://localhost:8383/nachtwache/index.html')
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('input[id=FENPos]', 1000)
      .click('#content a:nth-of-type(1)')
      .pause(1000)
      .click('#content a:nth-of-type(2)')
      .pause(1000)
      .click('#content a:nth-of-type(3)')
      .pause(1000)
      .click('#content a:nth-of-type(4)')
      .pause(1000)
      .click('#content a:nth-of-type(5)')
      .pause(1000)
      .click('#content a:nth-of-type(6)')
      .pause(1000)
      .click('#content a:nth-of-type(7)')
      .pause(1000)
      .clearValue('input[id=FENPos]')
      .execute("return window.cB.SQUARE_SIZE;", [], function(response) {
        var value = response.value;
        console.log('cB.SQUARE_SIZE = ' + value);
      })
      .setValue('input[id=FENPos]', 'rnq2rk1/1pn12bp/p2p2p1/2pPp1PP/P1P1Pp2/2N2N2/1P1B1P2/R2QK2R')
      .waitForElementVisible('button[id=go]', 1000)
      .click('button#go')
      .waitForElementVisible('button#go', 10000)
      //.pause(1000)
      //.click('#t11')
      //.pause(1000)
      //.click('#t5')
      .pause(1000)
      .assert.value('input[id=FENPos]', 'rnq2rk1/1pn12bp/p2p2p1/2pPp1PP/P1P1Pp2/2N2N2/1P1B1P2/R2QK2R')
      //.assert.containsText('h3#a', 'Sorbische Ostereier')
      .end();
  }
};