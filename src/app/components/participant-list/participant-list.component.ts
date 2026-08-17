import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ResearchProgramService } from '../../services/research-program.service';
import { AuthService } from '../../services/auth.service';
import { ResearchParticipant } from '../../models/research-program.model';

@Component({
  selector: 'app-participant-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-100">
      <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center space-x-4">
              <button
                (click)="goBack()"
                class="text-gray-600 hover:text-gray-900">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 class="text-2xl font-bold text-gray-800">👥 Research Participants</h1>
              <span [class]="getRoleBadgeClass()">
                {{ getCurrentRole() }}
              </span>
            </div>
            <div class="flex items-center space-x-3">
              <button
                *ngIf="canCreate()"
                (click)="addParticipant()"
                class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                ➕ Add Participant
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
        <!-- Filter info -->
        <div class="mb-6 px-4" *ngIf="programId">
          <div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <p class="text-sm text-blue-700">
              📊 Showing participants for program ID: <strong>{{ programId }}</strong>
              <button (click)="clearFilter()" class="ml-4 text-blue-800 underline hover:text-blue-900">
                View All Participants
              </button>
            </p>
          </div>
        </div>

        <div class="px-4 py-6 sm:px-0">
          <!-- Statistics Summary -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-gray-500 text-sm font-medium">Total Participants</h3>
                  <p class="text-2xl font-bold text-gray-900">{{ participants.length }}</p>
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
                  <h3 class="text-gray-500 text-sm font-medium">Consented</h3>
                  <p class="text-2xl font-bold text-gray-900">{{ getConsentedCount() }}</p>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-gray-500 text-sm font-medium">Pending Consent</h3>
                  <p class="text-2xl font-bold text-gray-900">{{ getPendingConsentCount() }}</p>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-gray-500 text-sm font-medium">Gender Diversity</h3>
                  <p class="text-lg font-bold text-gray-900">{{ getGenderDiversity() }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Participants Table -->
          <div class="bg-white shadow-md rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participant ID
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date of Birth
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enrollment Date
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Consent Status
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr *ngFor="let participant of participants" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{{ participant.participantNumber }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">
                        {{ participant.firstName }} {{ participant.lastName }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ participant.gender }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ participant.dateOfBirth }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>📧 {{ participant.email }}</div>
                      <div>📱 {{ participant.phoneNumber }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ participant.enrollmentDate }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span [class]="getConsentStatusBadgeClass(participant.consentStatus)">
                        {{ participant.consentStatus }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        (click)="viewDetails(participant)"
                        class="text-blue-600 hover:text-blue-900 mr-3">
                        View
                      </button>
                      <button
                        *ngIf="canEdit()"
                        (click)="editParticipant(participant.id!)"
                        class="text-yellow-600 hover:text-yellow-900 mr-3">
                        Edit
                      </button>
                      <button
                        *ngIf="canDelete()"
                        (click)="deleteParticipant(participant.id!)"
                        class="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div *ngIf="participants.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 class="mt-2 text-lg font-medium text-gray-900">No participants found</h3>
            <p class="mt-1 text-sm text-gray-500">
              {{ programId ? 'This program has no participants yet.' : 'No participants have been enrolled in any program yet.' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Participant Details Modal -->
      <div *ngIf="selectedParticipant" 
           class="fixed z-10 inset-0 overflow-y-auto" 
           (click)="closeDetails()">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
          
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full"
               (click)="$event.stopPropagation()">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="w-full">
                  <div class="flex justify-between items-center mb-4">
                    <h3 class="text-2xl font-bold text-gray-900">
                      Participant Details
                    </h3>
                    <button (click)="closeDetails()" class="text-gray-400 hover:text-gray-600">
                      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 class="text-sm font-medium text-gray-500 mb-2">Personal Information</h4>
                      <div class="space-y-2 text-sm">
                        <p><strong>Participant ID:</strong> #{{ selectedParticipant.participantNumber }}</p>
                        <p><strong>Full Name:</strong> {{ selectedParticipant.firstName }} {{ selectedParticipant.lastName }}</p>
                        <p><strong>Date of Birth:</strong> {{ selectedParticipant.dateOfBirth }}</p>
                        <p><strong>Gender:</strong> {{ selectedParticipant.gender }}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 class="text-sm font-medium text-gray-500 mb-2">Contact Information</h4>
                      <div class="space-y-2 text-sm">
                        <p><strong>Email:</strong> {{ selectedParticipant.email }}</p>
                        <p><strong>Phone:</strong> {{ selectedParticipant.phoneNumber }}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 class="text-sm font-medium text-gray-500 mb-2">Study Information</h4>
                      <div class="space-y-2 text-sm">
                        <p><strong>Enrollment Date:</strong> {{ selectedParticipant.enrollmentDate }}</p>
                        <p><strong>Consent Status:</strong> 
                          <span [class]="getConsentStatusBadgeClass(selectedParticipant.consentStatus)">
                            {{ selectedParticipant.consentStatus }}
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    <div class="md:col-span-2">
                      <h4 class="text-sm font-medium text-gray-500 mb-2">Medical History</h4>
                      <p class="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        {{ selectedParticipant.medicalHistory || 'No medical history recorded' }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                (click)="closeDetails()"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ParticipantListComponent implements OnInit {
  participants: ResearchParticipant[] = [];
  selectedParticipant: ResearchParticipant | null = null;
  programId: number | null = null;

  constructor(
    private programService: ResearchProgramService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if we have a programId in the route
    this.route.paramMap.subscribe(params => {
      const programIdParam = params.get('programId');
      if (programIdParam) {
        this.programId = Number(programIdParam);
        this.loadParticipantsByProgram(this.programId);
      } else {
        this.loadAllParticipants();
      }
    });
  }

  loadAllParticipants(): void {
    this.programService.getAllParticipants().subscribe({
      next: (data) => this.participants = data,
      error: (error) => console.error('Error loading participants:', error)
    });
  }

  loadParticipantsByProgram(programId: number): void {
    this.programService.getParticipantsByProgram(programId).subscribe({
      next: (data) => this.participants = data,
      error: (error) => console.error('Error loading participants:', error)
    });
  }

  clearFilter(): void {
    this.programId = null;
    this.router.navigate(['/participants']);
  }

  deleteParticipant(id: number): void {
    if (confirm('Are you sure you want to delete this participant? This will create an audit log entry.')) {
      this.programService.deleteParticipant(id).subscribe({
        next: () => {
          alert('✅ Participant deleted successfully! Audit log has been created.');
          if (this.programId) {
            this.loadParticipantsByProgram(this.programId);
          } else {
            this.loadAllParticipants();
          }
        },
        error: (error) => {
          console.error('Error deleting participant:', error);
          alert('❌ Error deleting participant. Please try again.');
        }
      });
    }
  }

  viewDetails(participant: ResearchParticipant): void {
    this.selectedParticipant = participant;
  }

  closeDetails(): void {
    this.selectedParticipant = null;
  }

  addParticipant(): void {
    if (this.programId) {
      // If viewing participants for a specific program, pre-select it
      this.router.navigate(['/participants/create', this.programId]);
    } else {
      this.router.navigate(['/participants/create']);
    }
  }

  editParticipant(id: number): void {
    this.router.navigate(['/participants/edit', id]);
  }

  goBack(): void {
    this.router.navigate(['/programs']);
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
    return this.authService.hasRole('ROLE_ADMIN') ? '👑 ADMIN' : '👤 USER';
  }

  getRoleBadgeClass(): string {
    return this.authService.hasRole('ROLE_ADMIN')
      ? 'px-3 py-1 text-xs font-bold rounded-full bg-yellow-400 text-yellow-900'
      : 'px-3 py-1 text-xs font-bold rounded-full bg-green-400 text-green-900';
  }

  getConsentedCount(): number {
    return this.participants.filter(p => p.consentStatus === 'GIVEN').length;
  }

  getPendingConsentCount(): number {
    return this.participants.filter(p => p.consentStatus === 'PENDING').length;
  }

  getGenderDiversity(): string {
    const genderCounts: { [key: string]: number } = {};
    this.participants.forEach(p => {
      genderCounts[p.gender] = (genderCounts[p.gender] || 0) + 1;
    });
    return Object.keys(genderCounts).map(g => `${g}:${genderCounts[g]}`).join(' | ') || 'N/A';
  }

  getConsentStatusBadgeClass(status: string): string {
    const classes: { [key: string]: string } = {
      'GIVEN': 'px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800',
      'PENDING': 'px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800',
      'WITHDRAWN': 'px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800'
    };
    return classes[status] || 'px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

