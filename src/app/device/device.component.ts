import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ApiService } from '@services/api.service';
import { Device } from './device';
import { Observable } from 'rxjs';
import { HttpRequest, HttpHeaders, HttpClient, HttpEventType } from '@angular/common/http';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {MatTreeModule} from '@angular/material/tree';



@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})

export class DeviceComponent implements OnInit {
  updates: FormGroup;
  constructor(private apiService: ApiService, private http:HttpClient, private formbuilder:FormBuilder) {
    this.updates = formbuilder.group({
      update: false
  });
}
  public progress: number;
  public messageupl: string;   
  public dirlist= [];

  dir: string;

  devices: Observable<Device[]>;
  DeviceForm: any; 
  dataSaved = false;
  deviceIdUpdate = null;
  message = null;
  resultText=[];  
  deviceNames:string;  
  count:number=0;  
  errorMsg:string; 

  ngOnInit(): void {
    this.DeviceForm = this.formbuilder.group({
      deviceName: ['', [Validators.required]],  
      version: ['', [Validators.required]],  
       
    })
    
    this.getAllDevice();
  }

  getAllDevice() {
    this.devices = this.apiService.getDeviceList();
  }

  onChange(deviceName:string,event) {  
    this.errorMsg="";  
     const checked = event.target.checked;  
    
      if (checked) {  
        this.resultText.push(deviceName);  
       
         } else {  
           const index = this.resultText.indexOf(deviceName);  
           this.resultText.splice(index, 1);  
       }
       
       this.deviceNames=this.resultText.toString();  
       const count=this.resultText.length;  
       this.count=count;  
    }  
    
    Save() {  
    
    const count=this.resultText.length;  
    
    if(count == 0)  
    {  
      this.errorMsg="Select at least one device";  
    }  
    else  
    {  
      this.count=count;  
    } 
     

  }
  upload(files) {
    if (files.length === 0)
      return;

    const formData = new FormData();
    for (let file of files)
      formData.append(file.name, file);
    
    const selectedDevice = this.resultText.toString();
    formData.append(selectedDevice, selectedDevice);
  
    const directory = this.dir;
    formData.append(directory, directory);

    console.log(formData);
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
      //return this.deviceNames;
      }
      );

    
  }

  // getFiles() {
  //   const dir = new HttpRequest('GET', "https://localhost:5001/api/Sftp");

  //   this.http.request(dir).subscribe(response => {
  //     const filesdir = (<any>response).filesdir;
  //     localStorage.setItem("filesdir", filesdir);
  //   })
  // }
}