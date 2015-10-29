module.exports = {
	'search google test':function(browser){
		browser
		.url('http://www.google.com.tw')
		.waitForElementVisible('body', 1000)
		.setValue('input[type=text]', 'google')
		.keys(browser.Keys.ENTER)
		.pause(1000)
		.assert.containsText("ol#rso a", "Google")
		.end();
	}
}