import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CompanyComponent } from '@/company/company.component';
import { Company } from '@/company/company';
import { Device } from '@/device/device';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    invalidLogin : boolean;
    public user: any = null;

    constructor(private http: HttpClient, private router:Router, private toastr:ToastrService) {}
    
    public loginByAuth(value){
        const credentials = JSON.stringify(value);
        this.http.post("https://localhost:5001/users/authenticate", credentials, {
            headers: new HttpHeaders({
            "Content-Type": "application/json"
        })
    }).subscribe(response => {
      const token = (<any>response).token;
      localStorage.setItem("token", token);
      // const role = (<any>response).roleName;
      // localStorage.setItem("role", role);
      this.invalidLogin = false;
      this.router.navigate(['/']);
      const user= (<any>response);
      localStorage.setItem("user", JSON.stringify(user));
     
      
     
      // if (this.user = (<any>response)) {
      //    return false;
      //  }
    }, err => {
      if (this.invalidLogin = true) {
        this.toastr.error('İnvalid username or password!');
    }
    });

  }
    async registerByAuth(value){
      const credentials = JSON.stringify(value);
      this.http.post("https://localhost:5001/users/register", credentials, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }).subscribe(response => {
        this.router.navigate(['/login']);
      })
    }
    
    //Company Services:
    getCompanyList(): Observable<Company[]> {
      return this.http.get<Company[]>("https://localhost:5001/api/Companies");
    }
    CreateCompany(company: Company): Observable<Company>{
      const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
      return this.http.post<Company>("https://localhost:5001/api/Companies", company, httpOptions);
    }
    UpdateCompany(company: Company): Observable<Company> {  
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
      return this.http.put<Company>("https://localhost:5001/api/Companies", company, httpOptions);  
    }
    DeleteCompany(companyId: string): Observable<number> {  
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
      return this.http.delete<number>("https://localhost:5001/api/Companies/" + companyId, httpOptions);  
    }  
    //---------------------------

    //Device Services:
    getDeviceList(): Observable<Device[]> {
      return this.http.get<Device[]>("https://localhost:5001/api/Devices");
    }
    CreateDevice(device: Device): Observable<Device>{
      const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
      return this.http.post<Device>("https://localhost:5001/api/Devices", device, httpOptions);
    }
    UpdateDevice(device: Device): Observable<Device> {  
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
      return this.http.put<Device>("https://localhost:5001/api/Devices", device, httpOptions);  
    }
    DeleteDevice(deviceId: string): Observable<number> {  
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
      return this.http.delete<number>("https://localhost:5001/api/Devices/" + deviceId, httpOptions);  
    }  
    //----------------------------
    
    //Sftp Services:
    // getSftpFiles(): Observable<Files[]>{
    //   return this.http.get<Files[]>("https://localhost:5001/api/Sftp");
    // }
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
      localStorage.removeItem('role');
      this.user = null;
      this.router.navigate(['/login']);
   }

}
