import {Component} from '@angular/core';
import { ApiService } from '@services/api.service';
import { OnInit } from '@angular/core';


@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent  implements OnInit{
    public user;

    items = ['Roles'];
    expandedIndex = 0;

    constructor(public apiService: ApiService) {}

    ngOnInit() {
        
        this.user = this.apiService.user;

    }


}

