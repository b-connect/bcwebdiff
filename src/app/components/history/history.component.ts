import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../../services/history.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  private items:any = [];

  constructor(private historyService: HistoryService) { }

  ngOnInit() {
    this.historyService.getEntries()
      .then((history) => {
        this.items = history;
      })
  }

}
