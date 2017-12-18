import { Injectable } from '@angular/core';

var puppeteer = window.require('puppeteer');

@Injectable()
export class PuppeterService {

  constructor() { }

  public screenshot(file:string, url:string, slowMo:number, fullPage:boolean, auth:any = null, options:any = null) {
    let promise = new Promise((resolve, reject) => {
      (async () => {
        try {
          const browser = await puppeteer.launch({slowMo: slowMo});
          const page = await browser.newPage();
          page.on('error', e => {
            return reject(e);
          });
          page.on('pageerror', e => {
            return reject(e);
          });
          page.on('requestfailed', e => {
            return reject(e);
          });
          if (auth != null && auth.user !== '' && auth.pass !== '') {
            page.authenticate({
              username: auth.user,
              password: auth.pass
            })
          }

          if (options && options.viewport && options.viewport.height) {
            options.viewport.height = +options.viewport.height;
          }
          if (options && options.viewport && options.viewport.width) {
            options.viewport.width = +options.viewport.width;
          }

          if (options && options.viewport) {
            page.setViewport(options.viewport);
          }

          if (options && options.userAgent) {
            page.setUserAgent(options.userAgent);
          }

          await page.goto(url, {"waitUntil" : "networkidle2"});

          await page.evaluate(() => {
              return Promise.resolve(window.scrollTo(0,document.body.scrollHeight));
          });

          let screenOptions = {
            path: file,
            fullPage: false
          };

          if (fullPage) {
            screenOptions.fullPage = true;
          }

          await page.screenshot(screenOptions);
          await browser.close();

          return resolve(file);

        } catch (e) {
          return reject(e);
        }
      })();
    });
    return promise;
  }

}
