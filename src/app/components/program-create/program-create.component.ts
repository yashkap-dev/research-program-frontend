import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ResearchProgramService } from '../../services/research-program.service';
import { ResearchProgram } from '../../models/research-program.model';

@Component({
  selector: 'app-program-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-100 py-6">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-2xl font-bold mb-6">Create Research Program</h2>
          
          <form (ngSubmit)="onSubmit()">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Program Name *</label>
                <input
                  type="text"
                  [(ngModel)]="program.programName"
                  name="programName"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  [(ngModel)]="program.description"
                  name="description"
                  rows="3"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Start Date *</label>
                  <input
                    type="date"
                    [(ngModel)]="program.startDate"
                    name="startDate"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">End Date *</label>
                  <input
                    type="date"
                    [(ngModel)]="program.endDate"
                    name="endDate"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Budget *</label>
                <input
                  type="number"
                  [(ngModel)]="program.budget"
                  name="budget"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Principal Investigator</label>
                <input
                  type="text"
                  [(ngModel)]="program.principalInvestigator"
                  name="principalInvestigator"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Status *</label>
                <select
                  [(ngModel)]="program.status"
                  name="status"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Target Participants *</label>
                <input
                  type="number"
                  [(ngModel)]="program.targetParticipants"
                  name="targetParticipants"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
              </div>
            </div>

            <div class="mt-6 flex gap-4">
              <button
                type="submit"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Create Program
              </button>
              <button
                type="button"
                (click)="cancel()"
                class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ProgramCreateComponent {
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

  constructor(
    private programService: ResearchProgramService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.programService.createProgram(this.program).subscribe({
      next: () => {
        alert('Program created successfully!');
        this.router.navigate(['/programs']);
      },
      error: (error) => {
        alert('Error creating program');
        console.error('Error:', error);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/programs']);
  }
}

