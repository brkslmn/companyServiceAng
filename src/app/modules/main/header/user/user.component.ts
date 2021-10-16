import {Component, OnInit} from '@angular/core';
import {DateTime} from 'luxon';
import { ApiService } from '@services/api.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
    public user;

    constructor(private apiService: ApiService) {}

    ngOnInit(): void {
        this.user = this.apiService.user;
    }

    logout() {
        this.apiService.logout();
    }

}
