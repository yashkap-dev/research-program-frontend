import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuditRecord {
  id: number;
  entityType: string;
  entityId: number;
  entityName: string;
  deletedBy: string;
  deletedAt: string;
  entityData: string;
  auditedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private apiUrl = `${environment.auditApiUrl}/audit`;

  constructor(private http: HttpClient) {}

  getAllDeleteAudits(): Observable<AuditRecord[]> {
    return this.http.get<AuditRecord[]>(`${this.apiUrl}/deletes`);
  }

  getAuditsByEntityType(entityType: string): Observable<AuditRecord[]> {
    return this.http.get<AuditRecord[]>(`${this.apiUrl}/deletes/entity/${entityType}`);
  }

  getAuditsByUser(username: string): Observable<AuditRecord[]> {
    return this.http.get<AuditRecord[]>(`${this.apiUrl}/deletes/user/${username}`);
  }
}

