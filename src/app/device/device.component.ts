import { Component, OnInit, AfterViewInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '@services/api.service';
import { Device } from './device';
import { empty, Observable, range } from 'rxjs';
import { HttpRequest, HttpHeaders, HttpClient, HttpEventType } from '@angular/common/http';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatCheckbox } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})

export class DeviceComponent implements OnInit, AfterViewInit{
  updates: FormGroup;
  pageEvent: PageEvent;
  displayedColumns: string[] = ['id', 'deviceName', 'deviceVersion', 'select'];
  dataSource = new MatTableDataSource<Device>();
  selection = new SelectionModel<Device>(true, []);
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private apiService: ApiService, private http:HttpClient, private formbuilder:FormBuilder) {
    this.updates = formbuilder.group({
      update: false
    });
  }
  
  @Input() TableName = 'Device Table';
  @Input() lengthData : number;
  @Input() pageSize = [5,6,10,15];
  @Input() pageIndex: number;
  @Input() disable = false;
  @Input() input: any;
  @Output() pageChange: EventEmitter<"pageIndex">;
  @Output() sortChange = new EventEmitter<string>();

 

  public progress: number;
  public messageupl: string;   
  public dirlist= [];
  dir: string;
  files: [];
  DeviceForm: any; 
  dataSaved = false;
  deviceIdUpdate = null;
  message = null;
  resultText = [];  
  deviceNames:string;  
  count:number=0;  
  errorMsg:string; 
  selectedList=[];
  uploadDeviceList=[];
  skip = 0;
  top = this.pageSize[0];
  direct: undefined;
  active: string;

  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
  } 

  ngOnInit(): void {
    this.DeviceForm = this.formbuilder.group({
      deviceName: ['', [Validators.required]],  
      version: ['', [Validators.required]], 
    })
    
    this.getDeviceWithPaging(this.skip,this.top);
  }

  getDeviceWithPaging(skip,top){
    this.apiService.getDeviceListByNumber(skip,top).subscribe((res)=>{
      this.dataSource.data = (<any>res).value;
      this.lengthData = (<any>res)['@odata.count'];
    })
  }
  
  getSortingDevices(skip,top,order,direction){
    this.apiService.getSortedDevice(skip,top,order,direction).subscribe((res)=>{
      this.dataSource.data = (<any>res).value;
      this.lengthData = (<any>res)['@odata.count'];
    });
  }
  
  sortChanged = (event) => {
    this.direct = event.direction;
    this.active = event.active;
    //HostBinding or globalize
    this.getSortingDevices(this.skip,this.top,this.active,this.direct);
  }
  
  pageChanged(event){
       
    if(event.pageIndex >= event.previousPageIndex){
      if(this.direct === undefined || this.direct === ""){
        this.top = event.pageSize;
        this.skip = (event.pageIndex * event.pageSize);
        this.getDeviceWithPaging(this.skip,this.top);
      }else if(this.direct === 'asc'){
        this.top = event.pageSize;
        this.skip = (event.pageIndex * event.pageSize);
        this.getSortingDevices(this.skip,this.top,this.active,this.direct);
      }else if(this.direct === 'desc'){
        this.top = event.pageSize;
        this.skip = (event.pageIndex * event.pageSize);
        this.getSortingDevices(this.skip,this.top,this.active,this.direct);
      }
    }else{
      if(this.direct === undefined || this.direct === ""){
        this.top = event.pageSize;
        this.skip = (event.pageIndex * event.pageSize);
        this.getDeviceWithPaging(this.skip,this.top);
      }else if(this.direct === 'asc'){
        this.top = event.pageSize;
        this.skip = (event.pageIndex * event.pageSize);
        this.getSortingDevices(this.skip,this.top,this.active,this.direct);
      }else if(this.direct === 'desc'){
        this.top = event.pageSize;
        this.skip = (event.pageIndex * event.pageSize);
        this.getSortingDevices(this.skip,this.top,this.active,this.direct);
      }
      // this.top = event.pageSize;
      // this.skip = (event.pageIndex * event.pageSize);
      // this.getDeviceWithPaging(this.skip,this.top); 
    }
  }

  applyFilter(event: Event){
    console.log(event)
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

  
  }

  SelectDevice(isSelected, row: Device){
   
    if(isSelected){
      this.selectedList.push(row);
      
    }else{
      const index = this.selectedList.findIndex(x => x.id === row.id);
      if(index!==-1){
       this.selectedList.splice(index,1);
      }
    }
 
    return true;
  }

  isChecked(id){
    const index = this.selectedList.findIndex(x => x.id === id);
    if(index!==-1){
      return true;

    }
    return false;
  }

  isAllSelected() {

    const numSelected = this.selectedList.length; 
    
    const numData = this.lengthData;
   
    return numSelected === numData;
  }

  inPageAllSelected() {
    
    const numSelected = this.selection.selected.length;   
    
    const numRows = this.dataSource.data.length;

    if (numSelected === numRows){
      console.log(this.selection.selected.length);
      return true;
    }

    return false;
     
  }

  masterToggle() {
    if (this.selectedList.length < this.dataSource.data.length){
       this.selectedList.splice(0, this.selectedList.length);
      
     }
    if (this.inPageAllSelected()) {
        this.selectedList.splice((this.selectedList.length - this.dataSource.data.length), this.selection.selected.length);
        this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
      for(var row of this.dataSource.data) {
         this.selectedList.push(row);
      
      }  
  }

  checkboxLabel(row?: Device): string {
    if (!row) {
      return `${this.inPageAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.getUpdate - 1}`;
  }
 
  upload(files) {
    if (files.length === 0)
      return;

    const formData = new FormData();
    for (let file of files)
      formData.append(file.name, file);
    
    for (let item of this.selectedList){
      this.uploadDeviceList.push(item.DeviceName);
    }
    
    const selectedDevice = this.uploadDeviceList.toString();
    formData.append(selectedDevice, selectedDevice);
    const directory = this.dir;
    formData.append(directory, directory);

    const uploadReq = new HttpRequest('POST', "https://localhost:5001/api/Sftp/UploadFile", formData,{
      reportProgress: true,
      responseType: 'text',
    });

    this.http.request(uploadReq).subscribe(
      event => {
      if (event.type === HttpEventType.UploadProgress)
        this.progress = Math.round(100 * event.loaded / event.total);
      else if (event.type === HttpEventType.Response)
        this.messageupl = event.body.toString();
      }
    );
  }
}
