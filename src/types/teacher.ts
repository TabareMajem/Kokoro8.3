export type Student = {
  id: string;
  name: string;
  email?: string;
  grade: string;
  avatar?: string;
  parentEmail?: string;
  parentInviteStatus: 'pending' | 'sent' | 'accepted' | 'expired';
  parentInviteSentAt?: string;
  classId?: string;
  accessCode: string;
  progress?: {
    completedActivities: number;
    totalActivities: number;
    lastActivityDate?: string;
  };
  scores?: {
    victim: number;
    bystander: number;
    perpetrator: number;
  };
  lastAssessment?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
};