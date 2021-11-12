import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CompanyComponent } from '@/company/company.component';
import { Company } from '@/company/company';
import { Device } from '@/device/device';
import { environment } from 'environments/environment'; 

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    invalidLogin : boolean;
    public user: any = null;
    public userRoles: string;

    constructor(private http: HttpClient, private router:Router, private toastr:ToastrService) {}
    
    public loginByAuth(value){
        const credentials = JSON.stringify(value);
        this.http.post(environment.apiUrl+"users/authenticate", credentials, {
            headers: new HttpHeaders({
            "Content-Type": "application/json"
        })
    }).subscribe(response => {
      const token = (<any>response).token;
      localStorage.setItem("token", token);
      const roleName = (<any>response).roleName;
      this.userRoles = roleName;
      localStorage.setItem("roleNames", roleName);
      this.invalidLogin = false;
      this.router.navigate(['/']);
      const user= (<any>response);
      localStorage.setItem("user", JSON.stringify(user));
    }, err => {
      if (this.invalidLogin = true) {
        this.toastr.error('İnvalid username or password!');
    }
    });
  }

  async registerByAuth(value){  
    const credentials = JSON.stringify(value);
      this.http.post(environment.apiUrl+"users/register", credentials, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }).subscribe(response => {
        this.router.navigate(['/login']);
      })
    }
    
    //Company Services:
    getCompanyList(): Observable<Company[]> {
      return this.http.get<Company[]>(environment.apiUrl+"api/Companies");
    }
    CreateCompany(company: Company): Observable<Company>{
      const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
      return this.http.post<Company>(environment.apiUrl+"api/Companies", company, httpOptions);
    }
    UpdateCompany(company: Company): Observable<Company> {  
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
      return this.http.put<Company>(environment.apiUrl+"api/Companies", company, httpOptions);  
    }
    DeleteCompany(companyId: string): Observable<number> {  
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
      return this.http.delete<number>(environment.apiUrl+"api/Companies/" + companyId, httpOptions);  
    }  
    //---------------------------

    //Device Services:
    getDeviceList(): Observable<Device[]> {
      return this.http.get<Device[]>(environment.apiUrl+"api/Devices");
    }
    getDeviceNumber() {
      return this.http.get(environment.apiUrl+"api/Devices/DeviceNumber");
    }
    getSortedDevice(skip: number, top: number, order: string, direction: string): Observable<Device[]>{
      return this.http.get<Device[]>(environment.apiUrl+"api/Devices?$skip="+skip+"&$top="+top+"&$orderBy="+order+" "+direction+"&$count=true");
    }
    getFilteredDeviceInt(filterFeature: string, input: string, skip: number, top: number): Observable<Device[]>{
      return this.http.get<Device[]>(environment.apiUrl+"api/Devices?$filter="+filterFeature+" eq"+" "+input+"&$count=true"+"&$skip="+skip+"&$top="+top);
    }
    getFilteredDeviceString(filterFeature: string, input: string, skip: number, top: number): Observable<Device[]>{
      return this.http.get<Device[]>(environment.apiUrl+"api/Devices?$filter="+filterFeature+" eq"+" "+"\'"+input+"\'"+"&$count=true"+"&$skip="+skip+"&$top="+top);
    }
    getFilteredSortedDeviceInt(filterFeature: string, input: string, skip: number, top: number,  order: string, direction: string): Observable<Device[]>{
      return this.http.get<Device[]>(environment.apiUrl+"api/Devices?$filter="+filterFeature+" eq"+" "+input+"&$count=true"+"&$skip="+skip+"&$top="+top+"&$orderBy="+order+" "+direction);
    }
    getFilteredSortedDeviceString(filterFeature: string, input: string, skip: number, top: number,  order: string, direction: string): Observable<Device[]>{
      return this.http.get<Device[]>(environment.apiUrl+"api/Devices?$filter="+filterFeature+" eq"+" "+"\'"+input+"\'"+"&$count=true"+"&$skip="+skip+"&$top="+top+"&$orderBy="+order+" "+direction);
    }
    
    getDeviceListByNumber(skip: number, top: number): Observable<Device[]> {
      return this.http.get<Device[]>(environment.apiUrl+"api/Devices?$skip="+skip+"&$top="+top+"&$count=true");
    }
    CreateDevice(device: Device): Observable<Device>{
      const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
      return this.http.post<Device>(environment.apiUrl+"api/Devices", device, httpOptions);
    }
    UpdateDevice(device: Device): Observable<Device> {  
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
      return this.http.put<Device>(environment.apiUrl+"api/Devices", device, httpOptions);  
    }
    DeleteDevice(deviceId: string): Observable<number> {  
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
      return this.http.delete<number>(environment.apiUrl+"api/Devices/" + deviceId, httpOptions);  
    }  
    //----------------------------
    //Sftp Services:
    getSftpFiles(){
      return this.http.get(environment.apiUrl+"api/Sftp");
    }
    //-----------------------------
    async getProfile() {
      try{
        this.user = JSON.parse(localStorage.getItem("user").toString());

      } catch (error) {
        this.logout();
        throw error;
      }
    }


    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('username');
      localStorage.removeItem('roleNames');
      this.user = null;
      this.router.navigate(['/login']);
   }

}
