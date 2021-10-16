import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
    providedIn: 'root'
})
export class ApiService {
    invalidLogin : boolean;
    public user: any = null;

    constructor(private http: HttpClient, private router:Router) {}
    
    public loginByAuth(value){
        const credentials = JSON.stringify(value);
        this.http.post("https://localhost:5001/users/authenticate", credentials, {
            headers: new HttpHeaders({
            "Content-Type": "application/json"
        })
    }).subscribe(response => {
      const token = (<any>response).token;
      localStorage.setItem("token", token);
      const username = (<any>response).username;
      localStorage.setItem("username", username);
      const user= (<any>response);
      localStorage.setItem("user", JSON.stringify(user));
      this.invalidLogin = false;
      this.router.navigate(['/']);
     
      if (this.user = (<any>response)) {
         return true;
       }
    }, err => {
      this.invalidLogin = true;
    });

  }
    async registerByAuth(value){
      const credentials = JSON.stringify(value);
      this.http.post("https://localhost:5001/Users/register", credentials, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }).subscribe(response => {
        this.router.navigate(['/login']);
      })
    }

    async getProfile() {
      try{
          this.user = JSON.parse(localStorage.getItem("user"));
      } catch (error) {
        this.logout();
        throw error;
      }
    }


    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('username');
      this.user = null;
      this.router.navigate(['/login']);
   }

}
