import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { Device } from '@/device/device';
import { Observable } from 'rxjs';
import { QueryBuilder } from '@/models/queryBuilder/queryBuilder';

@Injectable({
  providedIn: 'root'
})

export class DeviceService {

  constructor(private http: HttpClient, private rest: RestService) { }
  
  path = "Devices/";
  public query: QueryBuilder;
  
  getDevices(): Observable<Device[]>{
    return this.rest.get("api/"+this.path+this.query.Query());
  }

}
