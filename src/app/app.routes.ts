import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProgramListComponent } from './components/program-list/program-list.component';
import { ProgramCreateComponent } from './components/program-create/program-create.component';
import { ProgramEditComponent } from './components/program-edit/program-edit.component';
import { AuditViewerComponent } from './components/audit-viewer/audit-viewer.component';
import { ParticipantListComponent } from './components/participant-list/participant-list.component';
import { ParticipantEditComponent } from './components/participant-edit/participant-edit.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'programs', component: ProgramListComponent, canActivate: [authGuard] },
  { path: 'programs/create', component: ProgramCreateComponent, canActivate: [authGuard] },
  { path: 'programs/edit/:id', component: ProgramEditComponent, canActivate: [authGuard] },
  { path: 'participants', component: ParticipantListComponent, canActivate: [authGuard] },
  { path: 'participants/program/:programId', component: ParticipantListComponent, canActivate: [authGuard] },
  { path: 'participants/create', component: ParticipantEditComponent, canActivate: [authGuard] },
  { path: 'participants/create/:programId', component: ParticipantEditComponent, canActivate: [authGuard] },
  { path: 'participants/edit/:id', component: ParticipantEditComponent, canActivate: [authGuard] },
  { path: 'audit', component: AuditViewerComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
