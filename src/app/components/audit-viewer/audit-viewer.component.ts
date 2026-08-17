import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuditService, AuditRecord } from '../../services/audit.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-audit-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-100">
      <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center space-x-4">
              <button
                (click)="goBack()"
                class="text-gray-600 hover:text-gray-900">
                ← Back to Programs
              </button>
              <h1 class="text-xl font-semibold">Delete Audit Logs</h1>
              <button
                (click)="refreshAudits()"
                class="text-blue-600 hover:text-blue-800 text-sm">
                🔄 Refresh
              </button>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600">
                Total Records: {{ audits.length }}
              </span>
              <button
                (click)="logout()"
                class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          
          <!-- Filter Buttons -->
          <div class="mb-6 flex gap-2">
            <button
              (click)="filterByType(null)"
              [class]="currentFilter === null ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'"
              class="px-4 py-2 rounded border hover:shadow">
              All ({{ audits.length }})
            </button>
            <button
              (click)="filterByType('RESEARCH_PROGRAM')"
              [class]="currentFilter === 'RESEARCH_PROGRAM' ? 'bg-green-600 text-white' : 'bg-white text-gray-700'"
              class="px-4 py-2 rounded border hover:shadow">
              Programs ({{ countByType('RESEARCH_PROGRAM') }})
            </button>
            <button
              (click)="filterByType('RESEARCH_PARTICIPANT')"
              [class]="currentFilter === 'RESEARCH_PARTICIPANT' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'"
              class="px-4 py-2 rounded border hover:shadow">
              Participants ({{ countByType('RESEARCH_PARTICIPANT') }})
            </button>
          </div>

          <!-- Empty State -->
          <div *ngIf="filteredAudits.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
            <div class="text-6xl mb-4">📋</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No Audit Records Yet</h3>
            <p class="text-gray-600 mb-6">
              Delete a research program or participant to see audit logs here
            </p>
            <div class="bg-blue-50 border border-blue-200 rounded p-4 max-w-2xl mx-auto text-left">
              <p class="font-semibold text-blue-900 mb-2">How to test the audit flow:</p>
              <ol class="list-decimal list-inside space-y-1 text-blue-800 text-sm">
                <li>Go back to the Programs page</li>
                <li>Create a new research program</li>
                <li>Click the "Delete" button on that program</li>
                <li>Return to this page to see the audit log</li>
              </ol>
            </div>
            <button
              (click)="goBack()"
              class="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded">
              Go to Programs
            </button>
          </div>

          <!-- Audit Records Table -->
          <div *ngIf="filteredAudits.length > 0" class="bg-white shadow overflow-hidden sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entity Type
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entity Name
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deleted By
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deleted At
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let audit of filteredAudits" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      [class]="getEntityTypeBadgeClass(audit.entityType)"
                      class="px-2 py-1 text-xs font-semibold rounded">
                      {{ formatEntityType(audit.entityType) }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900">{{ audit.entityName }}</div>
                    <div class="text-xs text-gray-500">ID: {{ audit.entityId }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ audit.deletedBy }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(audit.deletedAt) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      (click)="viewDetails(audit)"
                      class="text-blue-600 hover:text-blue-900 font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Detail Modal -->
          <div *ngIf="selectedAudit" 
               class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
               (click)="closeDetails()">
            <div class="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white"
                 (click)="$event.stopPropagation()">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold">Audit Record Details</h3>
                <button
                  (click)="closeDetails()"
                  class="text-gray-400 hover:text-gray-600 text-2xl">
                  ×
                </button>
              </div>
              
              <div class="space-y-3">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Audit ID</label>
                    <p class="mt-1 text-sm text-gray-900">{{ selectedAudit.id }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Entity Type</label>
                    <p class="mt-1 text-sm text-gray-900">{{ selectedAudit.entityType }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Entity ID</label>
                    <p class="mt-1 text-sm text-gray-900">{{ selectedAudit.entityId }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Entity Name</label>
                    <p class="mt-1 text-sm text-gray-900">{{ selectedAudit.entityName }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Deleted By</label>
                    <p class="mt-1 text-sm text-gray-900">{{ selectedAudit.deletedBy }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Deleted At</label>
                    <p class="mt-1 text-sm text-gray-900">{{ formatDate(selectedAudit.deletedAt) }}</p>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Original Entity Data (JSON)</label>
                  <pre class="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">{{ formatJson(selectedAudit.entityData) }}</pre>
                </div>
              </div>

              <div class="mt-6 flex justify-end">
                <button
                  (click)="closeDetails()"
                  class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                  Close
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class AuditViewerComponent implements OnInit {
  audits: AuditRecord[] = [];
  filteredAudits: AuditRecord[] = [];
  selectedAudit: AuditRecord | null = null;
  currentFilter: string | null = null;

  constructor(
    private auditService: AuditService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAudits();
    // Auto-refresh every 30 seconds
    setInterval(() => this.loadAudits(), 30000);
  }

  loadAudits(): void {
    this.auditService.getAllDeleteAudits().subscribe({
      next: (data) => {
        this.audits = data.sort((a, b) => 
          new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime()
        );
        this.applyFilter();
      },
      error: (error) => console.error('Error loading audits:', error)
    });
  }

  refreshAudits(): void {
    this.loadAudits();
  }

  filterByType(type: string | null): void {
    this.currentFilter = type;
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.currentFilter) {
      this.filteredAudits = this.audits.filter(a => a.entityType === this.currentFilter);
    } else {
      this.filteredAudits = this.audits;
    }
  }

  countByType(type: string): number {
    return this.audits.filter(a => a.entityType === type).length;
  }

  viewDetails(audit: AuditRecord): void {
    this.selectedAudit = audit;
  }

  closeDetails(): void {
    this.selectedAudit = null;
  }

  goBack(): void {
    this.router.navigate(['/programs']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  formatEntityType(type: string): string {
    return type.replace('_', ' ');
  }

  getEntityTypeBadgeClass(type: string): string {
    if (type === 'RESEARCH_PROGRAM') {
      return 'bg-green-100 text-green-800';
    } else if (type === 'RESEARCH_PARTICIPANT') {
      return 'bg-purple-100 text-purple-800';
    }
    return 'bg-gray-100 text-gray-800';
  }

  formatJson(jsonString: string): string {
    try {
      const obj = JSON.parse(jsonString);
      return JSON.stringify(obj, null, 2);
    } catch {
      return jsonString;
    }
  }
}

