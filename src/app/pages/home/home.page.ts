import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NewPostService} from '@core/services/new-post.service';
import {AuthService} from '@core/services/auth.service';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  user: any = {};
  items: any[];

  constructor(private router: Router, private dataService: NewPostService, public auth: AuthService) {
  }

  ngOnInit() {
    this.auth.user$.subscribe(data => this.user = data);
    this.getPosts();
  }

  getPosts() {
    this.dataService.getPosts().subscribe((data: any[]) => {
      this.items = data;
    });
  }

  showNew(id) {
    this.router.navigate(['share/new', id]);
  }
  goProfile(){
    this.router.navigate(['user']);
  }
}
