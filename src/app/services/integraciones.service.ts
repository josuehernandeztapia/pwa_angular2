import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IntegracionesService {
  private baseUrl = '/bff/integrations';

  constructor(private http: HttpClient) {}

  getIntegraciones(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  toggleIntegracion(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/toggle`, {});
  }

  updateIntegracion(id: string, payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}`, payload);
  }
}

