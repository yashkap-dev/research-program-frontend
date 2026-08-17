import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResearchProgram, ResearchParticipant } from '../models/research-program.model';

@Injectable({
  providedIn: 'root'
})
export class ResearchProgramService {
  private apiUrl = `${environment.apiUrl}/programs`;
  private participantUrl = `${environment.apiUrl}/participants`;

  constructor(private http: HttpClient) {}

  // Program APIs
  getAllPrograms(): Observable<ResearchProgram[]> {
    return this.http.get<ResearchProgram[]>(this.apiUrl);
  }

  getProgramById(id: number): Observable<ResearchProgram> {
    return this.http.get<ResearchProgram>(`${this.apiUrl}/${id}`);
  }

  createProgram(program: ResearchProgram): Observable<ResearchProgram> {
    return this.http.post<ResearchProgram>(this.apiUrl, program);
  }

  updateProgram(id: number, program: ResearchProgram): Observable<ResearchProgram> {
    return this.http.put<ResearchProgram>(`${this.apiUrl}/${id}`, program);
  }

  deleteProgram(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Participant APIs
  getAllParticipants(): Observable<ResearchParticipant[]> {
    return this.http.get<ResearchParticipant[]>(this.participantUrl);
  }

  getParticipantsByProgram(programId: number): Observable<ResearchParticipant[]> {
    return this.http.get<ResearchParticipant[]>(`${this.participantUrl}/program/${programId}`);
  }

  getParticipantById(id: number): Observable<ResearchParticipant> {
    return this.http.get<ResearchParticipant>(`${this.participantUrl}/${id}`);
  }

  createParticipant(participant: ResearchParticipant): Observable<ResearchParticipant> {
    return this.http.post<ResearchParticipant>(this.participantUrl, participant);
  }

  updateParticipant(id: number, participant: ResearchParticipant): Observable<ResearchParticipant> {
    return this.http.put<ResearchParticipant>(`${this.participantUrl}/${id}`, participant);
  }

  deleteParticipant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.participantUrl}/${id}`);
  }
}

