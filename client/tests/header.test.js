const puppeteer = require('puppeteer');

let browser, page;

beforeEach(()=>  {
    browser = await puppeteer.launch({
        headless: false,
    });
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
})

afterEach(async() => {
    await browser.close()
}) 

test('We can launch a browser', async () => {
  const text = await page.$eval('a.brand-logo', (el) => el.innerHTML);
  expect(text).toEqual('Blogster');
});
