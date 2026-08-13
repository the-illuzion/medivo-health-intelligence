export interface UserSession {
  sessionId: string;
  userId: string;
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
  tokenHash: string;
  createdAt: string;
  expiresAt: string;
}
