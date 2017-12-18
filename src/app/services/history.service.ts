import { Injectable } from '@angular/core';
const md5 = require('md5');

import { SettingsService } from './settings.service';

@Injectable()
export class HistoryService {
  private entries: any = {};

  constructor(private settings:SettingsService) { }

  addEntry(source, target, browserOptions, options) {
    console.log('Add');
    return this.settings.has('history')
      .then((hasKey:boolean) => {
        if (!hasKey) {
          return new Promise((resolve, reject) => {
            resolve([]);
          })
        }
        return this.settings.get('history');
      }).then((history:any) => {
        if (history.length >= 50) {
          history= history.slice(0,50);
        }
        return new Promise((resolve, reject) => {
          history.unshift({
            source: source,
            target: target,
            browserOptions: browserOptions,
            options: options
          });
          resolve(history);
        })
      }).then((history:any) => {
        return this.settings.set('history', history);
      });
  }

  getEntry(source) {
    return this.entries[md5(source.url)];
  }

  hasEntry(source) {
    return (this.entries[md5(source.url)]);
  }
}
