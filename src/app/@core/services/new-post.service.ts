import {Injectable} from '@angular/core';
import {BaseService} from '@core/services/base.service';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {Comment} from '@core/models/comment';
import {environment} from '@env/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NewPostService extends BaseService {
  items: any[];
  comments: any[];
  item: any;
  apiUrl = environment.endpointURL;

  constructor(public http: HttpClient) {
    super();
  }

  getPosts(): any {
    if (this.items) {
      return of(this.items);
    } else {
      return this.http.get(this.apiUrl + 'wp/v2/posts?_embed').pipe(map(this.processPostData, this));
    }
  }

  getPostsLatest(): any {
    return this.http.get(this.apiUrl + 'wp/v2/posts?_embed&per_page=4');
  }

  processPostData(data: any[]) {
    this.items = data;
    return this.items;
  }

  // get one post
  getPostByID(id: number): any {
    return this.http.get(this.apiUrl + 'wp/v2/posts' + `/${id}` + '?_embed').pipe(map(this.processPostDataID, this));
  }

  processPostDataID(data: any) {
    this.item = data;
    return this.item;
  }

  // get comments
  getComments(queryParams: number): any {
    if (this.comments) {
      return of(this.comments);
    } else {
      return this.http.get(this.apiUrl + 'wp/v2/comments?post=' + queryParams).pipe(map(this.processPostData, this));
    }
  }

  processCommentsData(data: any[]) {
    this.comments = data;
    return this.comments;
  }

  // post comment
  addComment(comment: Comment): Observable<Comment> {
    const formData = new FormData(); // contract_name
    formData.append('post', comment.post.toString());
    formData.append('author_name', comment.author_name.toString());
    formData.append('author_email', comment.author_email);
    formData.append('content', comment.content);
    return this.http.post<Comment>(this.apiUrl + 'wp/v2/comments', formData).pipe();
  }

}
