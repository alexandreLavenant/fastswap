#!/usr/bin/env node
const puppeteer	= require('puppeteer'),
	program		= require('commander'),
	$			= require('cheerio'),
	baseUrl		= 'https://www.ticketswap.fr',
	bookTicket = async function(browser, swapUrl)
	{
		if (pageCommon === null) {
			pageCommon = await browser.newPage();
		}

		const response = await pageCommon.goto(swapUrl),
			status = response.status(),
			body = await response.text(),
			availableTicket = parseInt($(body).find('h2.css-1wu73kq.e149jiyc1').first().text())
			;
			
		if (availableTicket === 0) {
			await sleep(refreshTime); // wait 10s
			await bookTicket(browser, swapUrl);
		}

		const ticketNodes = $(body).find('a.css-1qka4wa.e15p5mol1');
		ticketNodes.each(async (i, ticketNode) => {
			var ticketUrl = $(ticketNode).attr('href'),
				page = await browser.newPage()
				;

			page.goto(baseUrl + ticketUrl);
		});
	},
	sleep = function(ms)
	{
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	;
	
program
	.usage('-u <url ...>')
	.version(require('./package.json').version, '-v, --version')
	.option('-u, --url <url>', 'Ticket swap url of the event')
	.option('-r, --refresh <time(s)>', 'Page refresh time in seconds', parseInt, 10)
	.parse(process.argv)
	;

var pageCommon = null,
	refreshTime = program.refresh * 1000
	;

puppeteer.launch({ headless: false })
.then(async browser =>
{
	await bookTicket(browser, program.url);
});