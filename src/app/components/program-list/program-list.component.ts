import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ResearchProgramService } from '../../services/research-program.service';
import { AuthService } from '../../services/auth.service';
import { ResearchProgram } from '../../models/research-program.model';

@Component({
  selector: 'app-program-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-100">
      <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center space-x-4">
              <h1 class="text-2xl font-bold text-gray-800">🔬 Research Management System</h1>
              <span [class]="getRoleBadgeClass()">
                {{ getCurrentRole() }}
              </span>
            </div>
            <div class="flex items-center space-x-3">
              <button
                (click)="goToParticipants()"
                class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                👥 View Participants
              </button>
              <button
                *ngIf="isAdmin()"
                (click)="goToAudit()"
                class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                📋 Audit Logs
              </button>
              <button
                *ngIf="canCreate()"
                (click)="goToCreate()"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                ➕ New Program
              </button>
              <button
                (click)="logout()"
                class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <!-- Role-specific welcome message -->
        <div class="mb-6 px-4">
          <div *ngIf="isAdmin()" class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">Admin Dashboard</h3>
                <p class="mt-1 text-sm text-blue-700">You have full access to create, edit, delete programs and view audit logs.</p>
              </div>
            </div>
          </div>
          <div *ngIf="!isAdmin()" class="bg-green-50 border-l-4 border-green-400 p-4 rounded">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-green-800">User Dashboard</h3>
                <p class="mt-1 text-sm text-green-700">You can view all research programs and participant information.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="px-4 py-6 sm:px-0">
          <!-- Statistics Summary -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-gray-500 text-sm font-medium">Total Programs</h3>
                  <p class="text-2xl font-bold text-gray-900">{{ programs.length }}</p>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-gray-500 text-sm font-medium">Active Programs</h3>
                  <p class="text-2xl font-bold text-gray-900">{{ getActiveProgramsCount() }}</p>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-gray-500 text-sm font-medium">Total Budget</h3>
                  <p class="text-2xl font-bold text-gray-900">\${{ getTotalBudget() | number }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Programs Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let program of programs" 
                 class="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div class="p-6">
                <div class="flex justify-between items-start mb-3">
                  <h2 class="text-xl font-bold text-gray-900 flex-1">{{ program.programName }}</h2>
                  <span [class]="getStatusBadgeClass(program.status)">
                    {{ program.status }}
                  </span>
                </div>
                
                <p class="text-gray-600 mb-4 text-sm line-clamp-2">{{ program.description }}</p>
                
                <div class="space-y-2 text-sm border-t border-gray-200 pt-4">
                  <div class="flex items-center text-gray-700">
                    <svg class="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span><strong>PI:</strong> {{ program.principalInvestigator }}</span>
                  </div>
                  <div class="flex items-center text-gray-700">
                    <svg class="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span><strong>Budget:</strong> \${{ program.budget | number }}</span>
                  </div>
                  <div class="flex items-center text-gray-700">
                    <svg class="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="text-xs">{{ program.startDate }} to {{ program.endDate }}</span>
                  </div>
                  <div class="flex items-center text-gray-700">
                    <svg class="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span><strong>Target:</strong> {{ program.targetParticipants }} participants</span>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 px-6 py-3 flex gap-2">
                <button
                  (click)="viewParticipants(program.id!)"
                  class="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-3 rounded transition-colors">
                  👥 Participants
                </button>
                <button
                  *ngIf="canEdit()"
                  (click)="editProgram(program.id!)"
                  class="bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-2 px-3 rounded transition-colors">
                  ✏️ Edit
                </button>
                <button
                  *ngIf="canDelete()"
                  (click)="deleteProgram(program.id!)"
                  class="bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-3 rounded transition-colors">
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>

          <div *ngIf="programs.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="mt-2 text-lg font-medium text-gray-900">No research programs found</h3>
            <p class="mt-1 text-sm text-gray-500">Get started by creating your first research program.</p>
            <button
              *ngIf="canCreate()"
              (click)="goToCreate()"
              class="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg">
              ➕ Create Your First Program
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProgramListComponent implements OnInit {
  programs: ResearchProgram[] = [];

  constructor(
    private programService: ResearchProgramService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPrograms();
  }

  loadPrograms(): void {
    this.programService.getAllPrograms().subscribe({
      next: (data) => this.programs = data,
      error: (error) => console.error('Error loading programs:', error)
    });
  }

  deleteProgram(id: number): void {
    if (confirm('Are you sure you want to delete this program? This will create an audit log entry.')) {
      this.programService.deleteProgram(id).subscribe({
        next: () => {
          alert('✅ Program deleted successfully! Audit log has been created.');
          this.loadPrograms();
        },
        error: (error) => {
          console.error('Error deleting program:', error);
          alert('❌ Error deleting program. Please try again.');
        }
      });
    }
  }

  goToCreate(): void {
    this.router.navigate(['/programs/create']);
  }

  editProgram(id: number): void {
    this.router.navigate(['/programs/edit', id]);
  }

  goToAudit(): void {
    this.router.navigate(['/audit']);
  }

  goToParticipants(): void {
    this.router.navigate(['/participants']);
  }

  viewParticipants(programId: number): void {
    this.router.navigate(['/participants', 'program', programId]);
  }

  isAdmin(): boolean {
    return this.authService.hasRole('ROLE_ADMIN');
  }

  canCreate(): boolean {
    return this.authService.hasRole('ROLE_ADMIN');
  }

  canEdit(): boolean {
    return this.authService.hasRole('ROLE_ADMIN');
  }

  canDelete(): boolean {
    return this.authService.hasRole('ROLE_ADMIN');
  }

  getCurrentRole(): string {
    return this.isAdmin() ? '👑 ADMIN' : '👤 USER';
  }

  getRoleBadgeClass(): string {
    return this.isAdmin() 
      ? 'px-3 py-1 text-xs font-bold rounded-full bg-yellow-400 text-yellow-900'
      : 'px-3 py-1 text-xs font-bold rounded-full bg-green-400 text-green-900';
  }

  getActiveProgramsCount(): number {
    return this.programs.filter(p => p.status === 'ACTIVE').length;
  }

  getTotalBudget(): number {
    return this.programs.reduce((sum, p) => sum + (p.budget || 0), 0);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getStatusBadgeClass(status: string): string {
    const classes: { [key: string]: string } = {
      'ACTIVE': 'px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800',
      'COMPLETED': 'px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800',
      'SUSPENDED': 'px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800'
    };
    return classes[status] || 'px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800';
  }
}

