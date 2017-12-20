import { Injectable } from '@angular/core';

const puppeteer = window.require('puppeteer');
const fs = require('fs-extra-promise');

const app = window.require('electron').remote.app;

@Injectable()
export class PuppeterService {

  constructor() { }

  public screenshot(file:string, url:string, slowMo:number, auth:any = null, options:any = null) {
    let promise = new Promise((resolve, reject) => {
      (async () => {
        try {

          const browser = await puppeteer.launch({
            slowMo: slowMo,
            ignoreHTTPSErrors: true
          });

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

          const title = await page.title();

          // await page.evaluate(() => {
          //     return Promise.resolve(window.scrollTo(0,document.body.scrollHeight));
          // });

          let screenOptions = {
            path: file,
            fullPage: false
          };


          if (options.fullPage === true) {
            screenOptions.fullPage = true;
          }

          await page.screenshot(screenOptions);

          await browser.close();

          return resolve({file: file, title: title});

        } catch (e) {
          return reject(e);
        }
      })();
    });
    return promise;
  }

}
