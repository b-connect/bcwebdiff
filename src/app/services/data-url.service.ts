import { Injectable } from '@angular/core';

const DataUri = require('datauri');

@Injectable()
export class DataUrlService {

  service: any;

  constructor() {
     this.service = new DataUri();
  }

  encode(file) {
    return new Promise((resolve, reject) => {
      this.service.encode(file, (err,content) => {
        if (err) {
          return reject(err);
        }
        return resolve(content);
      });
    });
  }

}
