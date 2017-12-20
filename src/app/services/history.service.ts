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
    const id = md5(source.url);
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
            image.resize(160,jimp.AUTO)
              .crop(0,0,160,160)
              .quality(100)
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
          const item = {
            thumb: thumb,
            id: id,
            date: Date.now(),
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
      })
  }

  getEntries() {
    return this.settings.get('history');
  }

  getEntry(id) {
    return new Promise((resolve, reject) => {
      this.getEntries()
        .then((entries:any) => {
          entries.forEach(element => {
            if (element.id === id) {
              return resolve(element);
            }
          });
          resolve(null);
        })
    })
  }

  hasEntry(source) {
    return (this.entries[md5(source.url)]);
  }
}
