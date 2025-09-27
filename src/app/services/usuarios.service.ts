import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private baseUrl = '/bff/users';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  createUsuario(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  updateUsuario(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}`, data);
  }

  toggleUsuario(id: string, status: boolean): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/status`, { activo: status });
  }
}

