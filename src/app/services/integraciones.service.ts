import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface IntegrationStatusMetrics {
  total: number;
  active: number;
  error: number;
}

export interface IntegrationLog {
  timestamp: string;
  endpoint: string;
  method: string;
  status: number;
  durationMs: number;
  integrationId?: string;
}

@Injectable({ providedIn: 'root' })
export class IntegracionesService {
  private baseUrl = '/bff/integrations';

  constructor(private http: HttpClient) {}

  getIntegraciones(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getStatus(): Observable<IntegrationStatusMetrics> {
    return this.http.get<IntegrationStatusMetrics>(`${this.baseUrl}/_status`);
  }

  getRecentLogs(limit?: number): Observable<IntegrationLog[]> {
    let params: HttpParams | undefined = undefined;
    if (typeof limit === 'number') {
      params = new HttpParams().set('limit', String(limit));
    }
    return this.http.get<IntegrationLog[]>(`${this.baseUrl}/_logs`, { params });
  }

  toggleIntegracion(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/toggle`, {});
  }

  updateIntegracion(id: string, payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}`, payload);
  }
}

