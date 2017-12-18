import { Component, OnInit, Inject } from '@angular/core';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


const path = window.require('path');
const app = window.require('electron').remote.app;

const isUrl = require('is-url');
const os = require('os');
import { WAITING_IMAGE } from './waiting.img';

const storage = require('electron-json-storage');

import { DataUrlService } from '../../services/data-url.service';
import { DiffService } from '../../services/diff.service';

import { SettingsService } from '../../services/settings.service';

import { HistoryService } from '../../services/history.service';

interface IState {
  STATUS_OK: number;
  STATUS_READY: number;
  STATUS_ERROR: number;
  STATUS_WORKING: number;
}

const State: IState = {
  STATUS_OK: 1,
  STATUS_READY: 2,
  STATUS_ERROR: -1,
  STATUS_WORKING: 4,
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  status: number = State.STATUS_OK;
  fullPage: false;
  slowMo: number = 250;
  defaultOptionsScreen: any = {
    target: {
      user: '',
      pass: '',
      url: ''
    },
    source: {
      user: '',
      pass: '',
      url: ''
    },
  };
  result:any = {

  };
  imgs:any = {
    target: WAITING_IMAGE,
    source: WAITING_IMAGE,
    preview: WAITING_IMAGE,
    diff: WAITING_IMAGE
  };
  browserOptions:any = {
    viewport: {
      width: 1200,
      height: 1000
    }
  };
  diffOptions: any = {
    threshold: 0.01
  };
  options:any = this.defaultOptionsScreen;
  states: any = State;

  constructor(
    public dialog: MatDialog,
    private dataUri: DataUrlService,
    private diffService: DiffService,
    private settings: SettingsService,
    private history: HistoryService
  ) { }

  ngOnInit() {
    this.settings.get('default')
      .then((settings:any) => {
        if (settings.target) {
          this.options.target = settings.target;
        }
        if (settings.source) {
          this.options.source = settings.source;
        }
      })

  }


  log($message, status = 0) {

  }

  openDialog(e): void {
    let dialogRef = this.dialog.open(ErrorDialog, {
      data: e
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  makeScreens() {
    return Promise.all([
      this.makeScreenshot('source'),
      this.makeScreenshot('target'),
    ])
  }

  makeScreenshot(scope) {
    let fileName;
    return new Promise((resolve, reject) => {
      this.diffService.screenshot(scope, this.options[scope].url, this.slowMo, this.fullPage,this.options[scope], this.browserOptions)
        .then((file) => {
          fileName = file;
          return this.dataUri.encode(file);
        }).then((r) => {
          this.imgs[scope] = r;
          resolve(fileName);
        }).catch((e) => {
          reject(e);
        })
    })

  }

  submit() {
    let e = [];
    if (!isUrl(this.options['target'].url)) {
      e.push('Target url invalid.');
    }
    if (!isUrl(this.options['source'].url)) {
      e.push('Source url invalid.');
    }
    if (e.length > 0) {
      this.openDialog(e);
      return;
    }

    if (this.status === State.STATUS_WORKING) {
      return;
    }

    this.settings.set('default', {target: this.options.target, source: this.options.source})
      .then(() => {

      })

    this.imgs.target = WAITING_IMAGE;
    this.imgs.source = WAITING_IMAGE;
    this.imgs.preview = WAITING_IMAGE;
    this.imgs.diff = WAITING_IMAGE;

    this.status = State.STATUS_WORKING;

    this.makeScreens()
      .catch((e) => {
        // console.log('Error');
      })
      .then((values) => {
        return this.diffService.diffResembleJs(this.options['source'].url, values[0], values[1], this.diffOptions);
      }).then((result:any) => {
        this.result = result.result;
        return result.file;
      }).then((content:string) => {
        this.imgs.diff = this.imgs.preview = content;
        this.status = State.STATUS_READY;
        this.history.addEntry(this.options.source, this.options.source, this.browserOptions, {})
          .then(() => {

          })
      }).catch((e) => {
        if (e) {

        }

        this.status = State.STATUS_ERROR;
      })

  }

  setSource(target) {
    this.imgs['preview'] = this.imgs[target];
  }

  error() {
    this.status = State.STATUS_ERROR;
  }

}


@Component({
  selector: 'error-dialog',
  templateUrl: 'error-dialog.html',
  styleUrls: ['./error-dialog.scss']
})
export class ErrorDialog {

  constructor (
    public dialogRef: MatDialogRef<HomeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
