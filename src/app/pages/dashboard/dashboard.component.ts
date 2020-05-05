import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings/settings.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {
  userLogin:any;

  constructor(public _settingService: SettingsService) { }

  ngOnInit() {
    this.userLogin=this._settingService.myUser;
  }

}
