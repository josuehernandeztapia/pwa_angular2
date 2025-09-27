import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface FlowListItem {
  id: string;
  name?: string;
  updatedAt?: string;
  etag?: string;
}

export interface FlowDraftBody {
  nodes: any[];
  connections: any[];
  version: string;
}

export interface FlowEntity {
  id: string;
  body: FlowDraftBody;
  etag?: string;
}

@Injectable({ providedIn: 'root' })
export class FlowsService {
  private baseUrl = '/bff/flows';

  constructor(private http: HttpClient) {}

  list(): Observable<FlowListItem[]> {
    return this.http.get<FlowListItem[]>(this.baseUrl);
  }

  get(id: string): Observable<FlowEntity> {
    return this.http.get<FlowDraftBody>(`${this.baseUrl}/${id}`, { observe: 'response' }).pipe(
      map((resp) => ({ id, body: resp.body as FlowDraftBody, etag: resp.headers.get('ETag') || undefined }))
    );
  }

  create(body: FlowDraftBody): Observable<{ id: string; etag?: string }> {
    return this.http.post(`${this.baseUrl}`, body, { observe: 'response' }).pipe(
      map((resp) => {
        const location = resp.headers.get('Location') || '';
        const id = (resp.body as any)?.id || location.split('/').pop() || '';
        return { id, etag: resp.headers.get('ETag') || undefined };
      })
    );
  }

  update(id: string, body: FlowDraftBody, etag?: string): Observable<{ etag?: string }> {
    const headers = new HttpHeaders(etag ? { 'If-Match': etag } : {});
    return this.http.put(`${this.baseUrl}/${id}`, body, { headers, observe: 'response' }).pipe(
      map((resp) => ({ etag: resp.headers.get('ETag') || undefined }))
    );
  }

  publish(id: string): Observable<{ status: 'ok' | 'error'; message?: string }> {
    return this.http.post<{ status: 'ok' | 'error'; message?: string }>(`${this.baseUrl}/${id}/publish`, {});
  }

  validate(id: string): Observable<{ valid: boolean; errors?: string[] }> {
    return this.http.post<{ valid: boolean; errors?: string[] }>(`${this.baseUrl}/${id}/validate`, {});
  }
}

