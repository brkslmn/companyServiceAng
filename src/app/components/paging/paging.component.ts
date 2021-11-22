import { QueryBuilder } from '@/models/queryBuilder';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-paging',
  templateUrl: './paging.component.html',
  styleUrls: ['./paging.component.scss']
})
export class PagingComponent implements OnInit {

  @Input() pageSizeOptions = [];
  @Input() pageSize: number;
  @Input() length: number;
  @Input() query: QueryBuilder;
  @Output() getEntity: EventEmitter<any> = new EventEmitter();

  
  constructor() { }

  ngOnInit(): void {

  }

  pageChanged(event){
    this.query.top(event.pageSize);
    this.query.skip(event.pageIndex * event.pageSize);
    this.getEntity.emit();

  }
  

}
