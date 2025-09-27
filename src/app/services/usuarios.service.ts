import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface UserMetrics {
  total: number;
  active: number;
  blocked: number;
}

export interface UserActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  email: string;
  action: 'created' | 'updated' | 'blocked' | 'unblocked' | 'role_changed' | 'login';
  performedBy?: string;
  details?: any;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private baseUrl = '/bff/users';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getMetrics(): Observable<UserMetrics> {
    return this.http.get<UserMetrics>(`${this.baseUrl}/_metrics`);
  }

  getActivityLogs(limit?: number): Observable<UserActivityLog[]> {
    let params: HttpParams | undefined = undefined;
    if (typeof limit === 'number') {
      params = new HttpParams().set('limit', String(limit));
    }
    return this.http.get<UserActivityLog[]>(`${this.baseUrl}/_activity_logs`, { params });
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

