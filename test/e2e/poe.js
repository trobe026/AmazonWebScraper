// module.exports = {
// 	tags: ['poe'],
// 	'Get POE Reward Images' : function (client) {
//
// 		var cheerio = require("cheerio") // easy to parse HTML
// 		var acc = "travis.roberts2"
// 		var pwd = "Amajor79"
//
// 		client
// 			.url('http://web.poe.garena.tw/login')
// 			.waitForElementVisible('body', 1000)
// 			.assert.title('Garena')
// 			.assert.visible('#sso_login_form_account')
// 			.setValue('#sso_login_form_account', acc)
// 			.setValue('#sso_login_form_password', pwd)
// 			.waitForElementVisible('#confirm-btn', 1000)
// 			.click('#confirm-btn')
// 			.pause(2000)
// 			.assert.visible('div.tab-links')
// 			.url("http://web.poe.garena.tw/account/view-profile/"+acc+"/events")
// 			.source(function(result) { // .source() will dump the target page into text format
// 				$ = cheerio.load(result.value) // so it needs to be parse
// 				var images = $("div.reward img")
// 				for(var i=0;i<images.length;i++) {
// 					console.log($(images[i]).attr("src"));
// 				}
// 			})
// 			.end();
// 	}
// };
