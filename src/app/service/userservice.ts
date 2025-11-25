import { Injectable } from '@angular/core';
import { ApiResponse, User } from '../interface/userinterface';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersChanged = new BehaviorSubject<boolean>(false);
  usersChanged$ = this.usersChanged.asObservable();

  constructor(private http: HttpClient) {}

  private baseUrl = 'http://localhost:8080/user-controller';

  getUsers(): Observable<any> {
    return this.http
      .get<ApiResponse<any>>(`${this.baseUrl}/get-all-user`)
      .pipe(map((res) => res.data));
  }

  getUserByField(user: User): Observable<any> {
    return this.http
      .post<ApiResponse<any>>(`${this.baseUrl}/find-user-by-field`, user)
      .pipe(map((res) => res.data));
  }

  addUser(user: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-user`, user);
  }

  updateUser(id: number, updatedUser: User): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-user/${id}`, updatedUser);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-user/${id}`);
  }

  notifyUsersChanged() {
    this.usersChanged.next(true);
  }

  calculateAge(date: Date): number {
    if (!date) return 0;
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    const d = today.getDate() - date.getDate();
    if (m < 0 || (m === 0 && d < 0)) age--;
    return age > 0 ? age : 0;
  }
}
