import {Injectable} from '@angular/core';
import {User} from '../_models/user';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
import { UserService } from '../_services/user.service';
// import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PaginatedResult } from '../_models/pagination';

@Injectable()
export class MemberListResolver implements Resolve<User[]> {
    pageNumber = 1;
    pageSize = 5;
    res: any;

    constructor(private userService: UserService, private router: Router) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        // return this.userService.getUsers(this.pageNumber, this.pageSize).pipe(
        //     catchError(error => {
        //        // this.alertify.error('Problem retrieving data');
        //         this.router.navigate(['/home']);
        //         return of(null);
        //     })
        // );

        

        return this.userService.getUsers(this.pageNumber, this.pageSize).pipe(response => {
            if(response){
                const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
                this.res = response;
                paginatedResult.result = this.res.body;
                // if (this.res.headers.get('Pagination') != null) {
                //         paginatedResult.pagination = JSON.parse(this.res.headers.get('Pagination'));
                //       }
            }
        });

    }
}
