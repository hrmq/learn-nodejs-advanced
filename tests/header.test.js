const puppeteer = require('puppeteer');

let browser, page;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false,
  });
  page = await browser.newPage();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  // await browser.close();
});

test('We can launch a browser', async () => {
  const text = await page.$eval('a.brand-logo', (el) => el.innerHTML);
  expect(text).toEqual('Blogster');
});

test('Clicking login oauth flow', async () => {
  await page.click('.right a');
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

test.only('When signed in shows logged out button', async () => {
  const id = '5ea85b4a987308506fd73a3d';

  await page.setCookie({ name: 'session', value: sessionString });
  await page.setCookie({ name: 'session.sig', value: sig });
  await page.goto('http://localhost:3000');
  await page.waitFor('a[href="/auth/logout"');

  const text = await page.$eval('a[href="/auth/logout"', (el) => el.innerHTML);
  expect(text).toEqual('Logout');
});
