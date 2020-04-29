import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';
import { Message } from '../_models/message';
import { EditUser } from '../_models/editUser';

// const httpOptions = {
//   headers: new HttpHeaders({
//     Authorization: 'Bearer' + localStorage.getItem('token')
// })
// };

// const httpOptions = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.apiUrl;
  params: any = {};
  res: any;
  constructor(private http: HttpClient) {}

  getUsers(
    page?,
    itemsPerPage?,
    userParams?,
    likesParam?
  ): Observable<PaginatedResult<User[]>> {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<
      User[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      // this.params.PageNumber = page;
      // this.params.pageSize = itemsPerPage;

      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (userParams != null) {
      // this.params.minAge = userParams.minAge;
      // this.params.maxAge = userParams.maxAge;
      // this.params.gender = userParams.gender;
      // this.params.orderBy = userParams.orderBy;

      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
    }

    if (likesParam === 'Likers') {
      // this.params.Likers = true;
      // params = params.append('Likers', 'true');
      params = params.append('Likers', 'false');
    }

    if (likesParam === 'Likees') {
      //  this.params.Likees = true;
      params = params.append('Likees', 'true');
    }

    //   const httpOptions = {
    //     headers: new HttpHeaders({
    //     Authorization: 'Bearer' + localStorage.getItem('token')
    //     })
    //  };

    return this.http
      .get<User[]>(this.baseUrl + 'users', { observe: 'response', params })
      .pipe(
        map((response) => {
          this.res = response;
          paginatedResult.result = this.res.body;
          if (this.res.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(
              this.res.headers.get('Pagination')
            );
          }
          return paginatedResult;
        })
      );

    // return this.http.post<any>(this.baseUrl + 'users', JSON.stringify(this.params), httpOptions)
    //   .pipe(map(response => {
    //       return response;
    //     })
    //   );
  }

  getUser(id): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'users/' + id);
  }

  updateUser(id: number, user: EditUser) {
    // let params = new HttpParams();
    // params = params.append('City', user.City);
    // params = params.append('Country', user.Country);
    // params = params.append('Interests', user.Interests);
    // params = params.append('Introduction', user.Introduction);
    // params = params.append('LookingFor', user.LookingFor);

   // return this.http.put(this.baseUrl + 'users/' + id, params);

       return this.http.put(this.baseUrl + 'users/' + id, user);

  }

  setMainPhoto(userId: number, id: number) {
    return this.http.post(
      this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain',
      {}
    );
  }

  deletePhoto(userId: number, id: number) {
    return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id);
  }

  sendLike(id: number, recipientId: number) {
    return this.http.post(
      this.baseUrl + 'users/' + id + '/like/' + recipientId,
      {}
    );
  }

  getMessages(id: number, page?, itemsPerPage?, messageContainer?) {
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<
      Message[]
    >();

    let params = new HttpParams();

    params = params.append('MessageContainer', messageContainer);

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    return this.http
      .get<Message[]>(this.baseUrl + 'users/' + id + '/messages', {
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') !== null) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get('Pagination')
            );
          }

          return paginatedResult;
        })
      );
  }

  getMessageThread(id: number, recipientId: number) {
    return this.http.get<Message[]>(
      this.baseUrl + 'users/' + id + '/messages/thread/' + recipientId
    );
  }

  sendMessage(id: number, message: Message) {
    return this.http.post(this.baseUrl + 'users/' + id + '/messages', message);
  }

  deleteMessage(id: number, userId: number) {
    return this.http.post(
      this.baseUrl + 'users/' + userId + '/messages/' + id,
      {}
    );
  }

  markAsRead(userId: number, messageId: number) {
    this.http
      .post(
        this.baseUrl + 'users/' + userId + '/messages/' + messageId + '/read',
        {}
      )
      .subscribe();
  }
}
