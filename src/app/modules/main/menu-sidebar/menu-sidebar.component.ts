import {Component, OnInit} from '@angular/core';
import { ApiService } from '@services/api.service';
@Component({
    selector: 'app-menu-sidebar',
    templateUrl: './menu-sidebar.component.html',
    styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent implements OnInit {
    public user;
    public roles: string;
    public menu = MENU;

    constructor(public apiService: ApiService) {}

    ngOnInit() {
        this.user = this.apiService.user;
        this.roles = localStorage.getItem("roleNames");
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
