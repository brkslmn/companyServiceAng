import {Component, OnInit} from '@angular/core';
import { ApiService } from '@services/api.service';

@Component({
    selector: 'app-menu-sidebar',
    templateUrl: './menu-sidebar.component.html',
    styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent implements OnInit {
    public user;
    public menu = MENU;
    public roles : string[];
    public roleMap = new Map<string, number>();
    
    constructor(public apiService: ApiService) {}

    ngOnInit() {
        this.user = this.apiService.user;
        this.getListRoles();
    }


    getListRoles(){
        this.roles = JSON.parse(localStorage.getItem("user")).role;

      
        for(var role of this.roles){
            this.roleMap.set(role, parseInt(role));
        }
        
        return this.roleMap;
    }

    roleHaS(){
        if(this.roleMap.has("1")){
            return true;
        }else{
            return false;
        }




    }
}   

export const MENU = [
    // {
    //     name: 'Dashboard',
    //     path: ['/']
    // },
    // {
    //     name: 'Companies',
    //     path: ['/company']
    // },
    // {
    //     name: 'Upload File',
    //     path: ['/upload']
    // },
    {
        name: 'Devices',
        path: ['/device']
    },
    

];
