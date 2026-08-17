import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ResearchProgramService } from '../../services/research-program.service';
import { AuthService } from '../../services/auth.service';
import { ResearchParticipant, ResearchProgram } from '../../models/research-program.model';

@Component({
  selector: 'app-participant-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-100">
      <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center space-x-4">
              <button (click)="goBack()" class="text-gray-600 hover:text-gray-900">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 class="text-2xl font-bold text-gray-800">{{ isEditMode ? 'Edit' : 'Add' }} Research Participant</h1>
            </div>
          </div>
        </div>
      </nav>

      <div class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="bg-white shadow-md rounded-lg p-6">
          <form (ngSubmit)="onSubmit()" #participantForm="ngForm">
            
            <!-- Program Selection -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Research Program <span class="text-red-500">*</span>
              </label>
              <select
                [(ngModel)]="participant.programId"
                name="programId"
                required
                [disabled]="isEditMode"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select a program...</option>
                <option *ngFor="let program of programs" [value]="program.id">
                  {{ program.programName }}
                </option>
              </select>
            </div>

            <!-- Participant Number -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Participant Number <span class="text-red-500">*</span>
              </label>
              <input
                type="number"
                [(ngModel)]="participant.participantNumber"
                name="participantNumber"
                required
                min="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 1001">
            </div>

            <!-- Name Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  [(ngModel)]="participant.firstName"
                  name="firstName"
                  required
                  maxlength="100"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="First name">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  [(ngModel)]="participant.lastName"
                  name="lastName"
                  required
                  maxlength="100"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Last name">
              </div>
            </div>

            <!-- Contact Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Email <span class="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  [(ngModel)]="participant.email"
                  name="email"
                  required
                  maxlength="255"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="email@example.com">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  [(ngModel)]="participant.phoneNumber"
                  name="phoneNumber"
                  maxlength="20"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="555-0123">
              </div>
            </div>

            <!-- Demographics -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth <span class="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  [(ngModel)]="participant.dateOfBirth"
                  name="dateOfBirth"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  [(ngModel)]="participant.gender"
                  name="gender"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <!-- Enrollment Date -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Enrollment Date <span class="text-red-500">*</span>
              </label>
              <input
                type="date"
                [(ngModel)]="participant.enrollmentDate"
                name="enrollmentDate"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>

            <!-- Medical History -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Medical History
              </label>
              <textarea
                [(ngModel)]="participant.medicalHistory"
                name="medicalHistory"
                rows="4"
                maxlength="500"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter relevant medical history"></textarea>
            </div>

            <!-- Consent Status -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Consent Status <span class="text-red-500">*</span>
              </label>
              <select
                [(ngModel)]="participant.consentStatus"
                name="consentStatus"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="GIVEN">Given</option>
                <option value="PENDING">Pending</option>
                <option value="WITHDRAWN">Withdrawn</option>
              </select>
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {{ errorMessage }}
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3">
              <button
                type="submit"
                [disabled]="!participantForm.valid || isSubmitting"
                class="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed">
                {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update Participant' : 'Add Participant') }}
              </button>
              <button
                type="button"
                (click)="goBack()"
                class="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ParticipantEditComponent implements OnInit {
  participant: ResearchParticipant = {
    programId: 0,
    participantNumber: 0,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    enrollmentDate: '',
    medicalHistory: '',
    consentStatus: 'PENDING'
  };

  programs: ResearchProgram[] = [];
  isEditMode = false;
  participantId?: number;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private programService: ResearchProgramService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Load available programs
    this.loadPrograms();

    // Check if we're in edit mode
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      const programId = params.get('programId');
      
      if (id) {
        this.isEditMode = true;
        this.participantId = Number(id);
        this.loadParticipant();
      } else if (programId) {
        // Pre-select program if coming from program view
        this.participant.programId = Number(programId);
      }
    });
  }

  loadPrograms(): void {
    this.programService.getAllPrograms().subscribe({
      next: (data) => {
        this.programs = data;
      },
      error: (error) => {
        console.error('Error loading programs:', error);
      }
    });
  }

  loadParticipant(): void {
    if (this.participantId) {
      this.programService.getParticipantById(this.participantId).subscribe({
        next: (data) => {
          this.participant = data;
        },
        error: (error) => {
          console.error('Error loading participant:', error);
          this.errorMessage = 'Failed to load participant data';
        }
      });
    }
  }

  onSubmit(): void {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    this.errorMessage = '';

    if (this.isEditMode && this.participantId) {
      // Update existing participant
      this.programService.updateParticipant(this.participantId, this.participant).subscribe({
        next: () => {
          alert('✅ Participant updated successfully!');
          this.router.navigate(['/participants']);
        },
        error: (error) => {
          console.error('Error updating participant:', error);
          this.errorMessage = 'Failed to update participant. Please try again.';
          this.isSubmitting = false;
        }
      });
    } else {
      // Create new participant
      this.programService.createParticipant(this.participant).subscribe({
        next: () => {
          alert('✅ Participant added successfully!');
          this.router.navigate(['/participants']);
        },
        error: (error) => {
          console.error('Error creating participant:', error);
          this.errorMessage = 'Failed to add participant. Please try again.';
          this.isSubmitting = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/participants']);
  }
}

