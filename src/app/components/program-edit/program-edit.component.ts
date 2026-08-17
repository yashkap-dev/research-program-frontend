import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ResearchProgramService } from '../../services/research-program.service';
import { AuthService } from '../../services/auth.service';
import { ResearchProgram } from '../../models/research-program.model';

@Component({
  selector: 'app-program-edit',
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
              <h1 class="text-2xl font-bold text-gray-800">{{ isEditMode ? 'Edit' : 'Create' }} Research Program</h1>
            </div>
          </div>
        </div>
      </nav>

      <div class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="bg-white shadow-md rounded-lg p-6">
          <form (ngSubmit)="onSubmit()" #programForm="ngForm">
            
            <!-- Program Name -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Program Name <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                [(ngModel)]="program.programName"
                name="programName"
                required
                maxlength="255"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter program name">
            </div>

            <!-- Description -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                [(ngModel)]="program.description"
                name="description"
                rows="4"
                maxlength="1000"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter program description"></textarea>
            </div>

            <!-- Date Range -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Start Date <span class="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  [(ngModel)]="program.startDate"
                  name="startDate"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  End Date <span class="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  [(ngModel)]="program.endDate"
                  name="endDate"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
            </div>

            <!-- Budget and Target Participants -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Budget ($) <span class="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  [(ngModel)]="program.budget"
                  name="budget"
                  required
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter budget">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Target Participants <span class="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  [(ngModel)]="program.targetParticipants"
                  name="targetParticipants"
                  required
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter target number">
              </div>
            </div>

            <!-- Principal Investigator -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Principal Investigator
              </label>
              <input
                type="text"
                [(ngModel)]="program.principalInvestigator"
                name="principalInvestigator"
                maxlength="100"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter investigator name">
            </div>

            <!-- Status -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Status <span class="text-red-500">*</span>
              </label>
              <select
                [(ngModel)]="program.status"
                name="status"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="SUSPENDED">Suspended</option>
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
                [disabled]="!programForm.valid || isSubmitting"
                class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed">
                {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update Program' : 'Create Program') }}
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
export class ProgramEditComponent implements OnInit {
  program: ResearchProgram = {
    programName: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: 0,
    principalInvestigator: '',
    status: 'ACTIVE',
    targetParticipants: 0
  };

  isEditMode = false;
  programId?: number;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private programService: ResearchProgramService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if we're in edit mode
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.programId = Number(id);
        this.loadProgram();
      }
    });
  }

  loadProgram(): void {
    if (this.programId) {
      this.programService.getProgramById(this.programId).subscribe({
        next: (data) => {
          this.program = data;
        },
        error: (error) => {
          console.error('Error loading program:', error);
          this.errorMessage = 'Failed to load program data';
        }
      });
    }
  }

  onSubmit(): void {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    this.errorMessage = '';

    if (this.isEditMode && this.programId) {
      // Update existing program
      this.programService.updateProgram(this.programId, this.program).subscribe({
        next: () => {
          alert('✅ Program updated successfully!');
          this.router.navigate(['/programs']);
        },
        error: (error) => {
          console.error('Error updating program:', error);
          this.errorMessage = 'Failed to update program. Please try again.';
          this.isSubmitting = false;
        }
      });
    } else {
      // Create new program
      this.programService.createProgram(this.program).subscribe({
        next: () => {
          alert('✅ Program created successfully!');
          this.router.navigate(['/programs']);
        },
        error: (error) => {
          console.error('Error creating program:', error);
          this.errorMessage = 'Failed to create program. Please try again.';
          this.isSubmitting = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/programs']);
  }
}

