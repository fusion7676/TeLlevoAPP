import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiUrl = 'http://localhost:3000/login';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<{ message: string, user: any }>(this.apiUrl, { username, password })
      .pipe(
        map(response => {
          if (response && response.user) {
            localStorage.setItem('Usuario Registrado', JSON.stringify(response.user));
            return true;
          }
          return false;
        })
      );
  }
  isAuthenticated(): boolean {
    return !!localStorage.getItem('Usuario Registrado');
  }
  logout() {
    localStorage.removeItem('Usuario Registrado');
  }
}
