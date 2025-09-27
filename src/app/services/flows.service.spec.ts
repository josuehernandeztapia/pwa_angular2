import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FlowDraftBody, FlowsService } from './flows.service';

describe('FlowsService', () => {
  let service: FlowsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(FlowsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should list flows', () => {
    const mockList = [{ id: 'f1', name: 'Flow 1' }];
    service.list().subscribe((list) => {
      expect(list.length).toBe(1);
      expect(list[0].id).toBe('f1');
    });

    const req = httpMock.expectOne('/bff/flows');
    expect(req.request.method).toBe('GET');
    req.flush(mockList);
  });

  it('should GET flow with ETag', () => {
    const id = 'flow123';
    const body = { nodes: [], connections: [], version: '1.0' } as FlowDraftBody;
    service.get(id).subscribe((entity) => {
      expect(entity.id).toBe(id);
      expect(entity.body.version).toBe('1.0');
      expect(entity.etag).toBe('W/"etag-1"');
    });

    const req = httpMock.expectOne(`/bff/flows/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(body, { headers: { ETag: 'W/"etag-1"' } as any });
  });

  it('should create flow and return id and ETag', () => {
    const draft: FlowDraftBody = { nodes: [], connections: [], version: '1.0' };
    service.create(draft).subscribe(({ id, etag }) => {
      expect(id).toBe('new-id');
      expect(etag).toBe('W/"etag-new"');
    });

    const req = httpMock.expectOne('/bff/flows');
    expect(req.request.method).toBe('POST');
    req.flush({ id: 'new-id' }, { headers: { ETag: 'W/"etag-new"', Location: '/bff/flows/new-id' } as any });
  });

  it('should fallback to Location header for new id', () => {
    const draft: FlowDraftBody = { nodes: [], connections: [], version: '1.0' };
    service.create(draft).subscribe(({ id, etag }) => {
      expect(id).toBe('loc-id');
      expect(etag).toBeUndefined();
    });

    const req = httpMock.expectOne('/bff/flows');
    expect(req.request.method).toBe('POST');
    req.flush({}, { headers: { Location: '/bff/flows/loc-id' } as any });
  });

  it('should update with If-Match header and return new ETag', () => {
    const id = 'f2';
    const draft: FlowDraftBody = { nodes: [], connections: [], version: '1.1' };
    service.update(id, draft, 'W/"etag-old"').subscribe(({ etag }) => {
      expect(etag).toBe('W/"etag-new"');
    });

    const req = httpMock.expectOne(`/bff/flows/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('If-Match')).toBe('W/"etag-old"');
    req.flush({}, { headers: { ETag: 'W/"etag-new"' } as any });
  });

  it('should publish a flow', () => {
    const id = 'f3';
    service.publish(id).subscribe((res) => {
      expect(res.status).toBe('ok');
    });

    const req = httpMock.expectOne(`/bff/flows/${id}/publish`);
    expect(req.request.method).toBe('POST');
    req.flush({ status: 'ok' });
  });

  it('should validate a flow and return errors', () => {
    const id = 'f4';
    service.validate(id).subscribe((res) => {
      expect(res.valid).toBeFalse();
      expect(res.errors?.length).toBe(2);
    });

    const req = httpMock.expectOne(`/bff/flows/${id}/validate`);
    expect(req.request.method).toBe('POST');
    req.flush({ valid: false, errors: ['missing market node', 'no reachable product'] });
  });
});

