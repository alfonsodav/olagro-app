import {Component, OnInit} from '@angular/core';
import { Storage } from '@capacitor/storage';
import {AuthService} from '@core/services/auth.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  user;

  constructor(private auth: AuthService) {
  }

  ngOnInit() {
    this.auth.user$.subscribe(data => this.user = data);
  }
  goHome(){
    this.auth.router.navigate(['home']);
  }
}
