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
import { RestService } from './rest.service';
import { DeviceService } from './device.service';
import jwt_decode from 'jwt-decode';
import { TokenService } from './token.service';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    invalidLogin : boolean;
    public user: any = null;
    public userRoles: string;

    constructor(private http: HttpClient, private router:Router, private toastr:ToastrService, private rest:RestService, private deviceRest:DeviceService, private tokenService:TokenService) {}
    
    public loginByAuth(value){
        
        let body = 'username=' + value.username + '&' + 'password=' +
        value.password + '&' + 'grant_type=password' + '&' + 'client_id=099153c2625149bc8ecb3e85e03f0022';

        this.http.post("http://atlas.linkas.com.tr:65010/token", body, {
            headers: new HttpHeaders({
            "Content-Type": "application/x-www-form-urlencoded"
        })
    }).subscribe(response => {
      const token = (<any>response).access_token;
      localStorage.setItem("token", token);
      this.router.navigate(['/']);

      const decoded = jwt_decode(token);
      console.log(decoded); 
      
      const user= decoded;
      localStorage.setItem("user", JSON.stringify(user));

      
    
      this.invalidLogin = false;
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

    //Sftp Services:
    getSftpFiles(directory: string){
      return this.http.get(environment.apiUrl+"api/Sftp?remoteDirectory="+directory);
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
