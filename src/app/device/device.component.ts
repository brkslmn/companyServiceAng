import { Component, OnInit, AfterViewInit, ViewChild, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import { ApiService } from '@services/api.service';
import { Device } from './device';
import { Observable, range } from 'rxjs';
import { HttpRequest, HttpHeaders, HttpClient, HttpEventType } from '@angular/common/http';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatCheckbox } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { DeviceService } from '@services/device.service';
import { QueryBuilder } from '@/models/queryBuilder';
import { RouterLinkWithHref } from '@angular/router';
import { PagingComponent } from '@components/paging/paging.component';


@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})



export class DeviceComponent implements OnInit, AfterViewInit{
  updates: FormGroup;
  pageEvent: PageEvent;
  displayedColumns: string[] = ['id', 'deviceName', 'Version', 'select'];
  dataSource = new MatTableDataSource<Device>();
  selection = new SelectionModel<Device>(true, []);
  query: QueryBuilder;
 

  @ViewChild(MatPaginator) paginator: PagingComponent;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private apiService: ApiService, private http:HttpClient, private formbuilder:FormBuilder, private deviceService:DeviceService) {
    this.updates = formbuilder.group({
      update: false
    });
    this.query = new QueryBuilder()
  }
  
  @Input() TableName = 'Device Table';
  @Input() lengthData : number;
  @Input() pageSize = [5,10,15,20];
  @Input() pageIndex: number;
  @Input() disable = false;
  @Input() input: any;
  @Output() page: EventEmitter<PageEvent>;
  @Output() pageChange: EventEmitter<string>;
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
  deviceNames:string;  
  count:number=0;  
  errorMsg:string; 
  selectedList=[];
  uploadDeviceList=[];
  MaxFileSize: number;
  checked = false;
  isAllchecked = false;
  word = undefined;
  filterFeature: string;
  filterArray=[];
  selectedLenght : number;
  map = new Map<number, Device>();
  
  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
  } 

  ngOnInit(): void {

    this.query.count();
    this.query.top(this.pageSize[0]);
    this.query.skip(0);
    this.query.orderBy('id', ' ');
    this.deviceService.query= this.query;
    
    this.getAllDevices();
  }

  getAllDevices(){
    
    
    this.deviceService.getDevices().subscribe((res)=>{
      const device = (<any>res).value;
      this.dataSource.data = device;
      this.inPageAllSelected();
      console.log(this.isAllchecked);
      this.lengthData = (<any>res)['@odata.count'];
    });
  
  } 

  sortChanged = (event) => {
    this.query.orderBy(event.active, event.direction);
    this.getAllDevices();
   
  }
  

  applyFilter(input){
    this.query.filter(f => f
      .filterContains(`contains(DeviceName,'${input.trim()}')`)
      .filterContains(`contains(Version,'${input.trim()}')`),'or')           
    this.getAllDevices();
  }


  SelectDevice(isSelected, row: Device){
    //myVar[row.id] = row;
    if(isSelected){

      this.map.set(row.id,row);
      console.log(this.map);
 
    }else{ 
      if (this.map.has(row.id)){
        this.map.delete(row.id);
      }
      console.log(this.map);
      
    }
    this.inPageAllSelected();
    return true;
  }

  isChecked(id){
    const index = this.map.has(id);
    if(index!==false){
      return true;
    }
    return false;
  }

  //Work everytime
  inPageAllSelected() {  
    this.isAllchecked = true;  
    if(this.dataSource.data.length > 0){
      for(var key of this.dataSource.data){
        if(this.map.has(key.id) == false){
         this.isAllchecked =  false;     
         break
        }
      }
    }
}

  masterToggle() {
    
    if (this.isAllchecked) {
      for(var x of this.dataSource.data){
        this.map.delete(x.id)
      }
      
     
    }else{
      for(var row of this.dataSource.data) {
         this.map.set(row.id, row);
      }
    }
    this.inPageAllSelected();
    
  }

  checkboxLabel(row?: Device): string {
    if (!row) {
      return `${this.isAllchecked ? 'deselect' : 'select'} all`;
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
    const MaxFileSize = this.MaxFileSize.toString();
    formData.append("MaxFileSize", MaxFileSize);
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
