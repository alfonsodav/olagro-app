import { Component, OnInit } from '@angular/core';
import {NewPostService} from '@core/services/new-post.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit {
  item: any;
  constructor(private dataService: NewPostService, private activate: ActivatedRoute) { }

  ngOnInit() {
    this.activate.params.subscribe(data => {
      const id = data.id;
      this.getPost(id);
    }, err => console.log(err));
  }
  getPost(id) {
    this.dataService.getPostByID(id).subscribe((data: any[]) => {
      this.item = data;
    });
  }
}
