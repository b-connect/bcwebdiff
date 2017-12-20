import { Injectable } from '@angular/core';

const storage = require('electron-json-storage');

@Injectable()
export class SettingsService {

  constructor() { }

  get(key) {
    return new Promise((resolve, reject) => {
      storage.has(key, (error, hasKey) => {
        if (hasKey) {
          storage.get(key, (error, content) => {
            if (error) {
              return reject(error);
            }
            return resolve(content);
          })
        } else {
          reject();
        }
      });
    });
  }

  has(key) {
    return new Promise((resolve, reject) => {
      storage.has(key, (error, hasKey) => {
        if (error) {
          return reject(error);
        }
        resolve(hasKey);
      });
    });
  }

  set(key, value) {
    return new Promise((resolve, reject) => {
      storage.set(key, value, (error) => {
        if (error) {
          return reject(error);
        }
        resolve(value);
      });
    });
  }

}
