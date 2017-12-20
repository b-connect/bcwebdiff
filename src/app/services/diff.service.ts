import { Injectable } from '@angular/core';

const isUrl = require('is-url');
const fs = require('fs-extra');
const app = window.require('electron').remote.app;
const electron = window.require('electron');
const md5 = require('md5');
const path = require('path');
const resemble = require('resemblejs');

import { PuppeterService } from './puppeter.service';

@Injectable()
export class DiffService {

  private path: string;

  constructor(private puppeter: PuppeterService) {
    this.path = path.resolve(app.getPath('userData'), "cache") + "/";
  }


  ensureDataDir(url) {
    const dir = this.path + md5(url);
    return new Promise( (resolve, reject) => {
      fs.stat(dir, (err, stats) => {
        if (err) {
          fs.ensureDir(dir, err => {
            if (err) {
              return reject(err);
            }
            return resolve(dir);
          })
        }
        if (stats.isDirectory()) {
          return resolve(dir);
        }
        reject("Not a directory");
      });
    });
  }
  screenshot(scope:string, url:string, slowMo:number, fullPage:boolean, auth:any = null, options:any = null) {
    const file = this.getPathForFile(url, scope)
    return new Promise((resolve,reject) => {
      this.ensureDataDir(url)
        .then(() => {
          console.log('Try Screenshot', file);
          this.puppeter.screenshot(file, url, slowMo, fullPage, auth, options)
            .then(img => {
              resolve(img);
            }).catch(e => {
              console.error('Error on puppeteer:screenshot', e);
              reject(e);
            })
        }).catch((e) => {
          console.error('Error on diff:screenshot', e);
          reject(e);
        })
    })
  }

  diffResembleJs(url, sourceFileSrc, targetFileSrc, options:any = {}) {
    const diffFileSrc = this.getPathForFile(url, 'diff', false);
    const diffFileSrcExt = this.getPathForFile(url, 'diff');
    return new Promise((resolve, reject) => {
      let diff = resemble(targetFileSrc).compareTo(sourceFileSrc).onComplete(function(data){
        resolve({file: data.getImageDataUrl(), result: data});
      });
    })
  }


  getPathForFile(url, scope, withExt = true) {
    if (withExt === false) {
      return this.path + md5(url) +  '/' + scope;
    }
    return this.path + md5(url) +  '/' + scope + '.png';
  }

  clean(source:string , target:string, diff:string) {
    return Promise.all([
      this.cleanFile(source),
      this.cleanFile(target),
      this.cleanFile(diff)
    ]);
  }

  cleanFile(file) {
    return new Promise((resolve, reject) => {
      fs.existsAsync(file).then((exist) => {
        if (!exist) {
          return resolve();
        }
        return fs.unlinkAsync(file);
      }).then(() => {
        resolve();
      }).catch(() => {
        resolve();
      })
    })

  }

}
