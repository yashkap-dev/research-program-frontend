export interface ResearchProgram {
  id?: number;
  programName: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  principalInvestigator: string;
  status: 'ACTIVE' | 'COMPLETED' | 'SUSPENDED';
  targetParticipants: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface ResearchParticipant {
  id?: number;
  programId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  enrollmentDate: string;
  gender: string;
  medicalHistory?: string;
  consentStatus: 'GIVEN' | 'WITHDRAWN' | 'PENDING';
  consentDate?: string;
  participantNumber: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  roles: string[];
}

