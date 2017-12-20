import { Injectable } from '@angular/core';
const md5 = require('md5');

import { SettingsService } from './settings.service';

const jimp = window.require('jimp');

@Injectable()
export class HistoryService {
  private entries: any = {};

  constructor(private settings:SettingsService) { }

  addEntry(img, source, target, browserOptions, options) {
    let thumb = "";
    return this.settings.has('history')
      .then((hasKey:boolean) => {
        if (!hasKey) {
          return new Promise((resolve, reject) => {
            resolve([]);
          })
        }
        return this.settings.get('history');
      })
      .then((history:any) => {
        return new Promise((resolve, reject) => {
          jimp.read(img).then((image) => {
            image.resize(100,100)
              .quality(90)
              .getBase64( jimp.AUTO, (err, content) => {
                thumb = content;
                resolve(history);
              })

          }).catch((e) => {
            resolve(history);
          })
        })
      })
      .then((history:any) => {
        if (history.length >= 50) {
          history= history.slice(0,50);
        }
        return new Promise((resolve, reject) => {
          console.log(thumb);
          const item = {
            thumb: thumb,
            source: source,
            target: target,
            browserOptions: browserOptions,
            options: options
          };
          history.unshift(item);
          resolve(history);
        })
      }).then((history:any) => {

        return this.settings.set('history', history);
      }).catch((e) => {
        console.log(e);
      })
  }

  getEntries() {
    return this.settings.get('history');
  }

  getEntry(source) {
    return this.entries[md5(source.url)];
  }

  hasEntry(source) {
    return (this.entries[md5(source.url)]);
  }
}
