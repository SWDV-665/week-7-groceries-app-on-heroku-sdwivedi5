import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {Subject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GroceriesServiceService {

  items: any = [];

  dataChanged$: Observable<boolean>;

  private dataChangeSubject: Subject<boolean>;

  baseURL = "https://groceries-server-sokol.herokuapp.com";

  constructor(public http: HttpClient) {
    console.log("Hello GroceryServices Provider");

    this.dataChangeSubject = new Subject<boolean>();
    this.dataChanged$ = this.dataChangeSubject.asObservable();
  }

  /*getItems() {
    return this.http.get<object[]>(this.baseURL + '/api/groceries').pipe(
      map(this.extractData),
      catchError(this.handleError));
  }*/

  getItems() {
    console.log('Getting items');
    return this.http.get<object[]>(this.baseURL + '/api/groceries').pipe(
      //map(this.extractData),
      catchError(this.handleError));
    }


  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const err = error || '';
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.log(errMsg);
    return Observable.throw(errMsg);
  }

  removeItem(id) {
    console.log("#### Remove item - id = ", id);
    this.http.delete(this.baseURL + "/api/groceries/" + id).subscribe(res => {
      this.items = res;
      this.dataChangeSubject.next(true);
    });
    //this.items.splice(index, 1);
  }

  addItem(item) {
    this.http.post(this.baseURL + "/api/groceries", item).subscribe(res => {
      this.items = res;
      this.dataChangeSubject.next(true);
    });
    //this.items.push(item);
  }

  editItem(item, index) {
    console.log("Editing item = ", item);
    this.http.put(this.baseURL + "/api/groceries/" + item._id, item).subscribe(res => {
      this.items = res;
      this.dataChangeSubject.next(true);
    });
    //this.items[index]= item;
  }
}
