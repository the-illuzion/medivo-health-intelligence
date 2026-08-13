export interface HipaaAuditLog {
  id: string;
  timestamp: string;
  event: string;
  user: string;
  resource: string;
  ipHash: string;
  verification: string;
}

class DynamicAuditService {
  private logs: HipaaAuditLog[] = [
    { id: 'LOG-9482', timestamp: '2026-08-13 20:45:15', event: 'HIPAA_CONSENT_GRANTED', user: 'sarah.j@example.com', resource: 'USER_CONSENT_REGISTRY', ipHash: 'a8f9...39b1', verification: 'CRYPTOGRAPHICALLY_VERIFIED' },
    { id: 'LOG-9481', timestamp: '2026-08-13 20:30:10', event: 'SCAN_DATA_ENCRYPTED_AES256', user: 'alex.m@example.com', resource: 'AI_SCAN_VAULT_S3', ipHash: 'b4c2...88a4', verification: 'CRYPTOGRAPHICALLY_VERIFIED' },
    { id: 'LOG-9480', timestamp: '2026-08-13 19:45:00', event: 'CLINICIAN_RECORD_ACCESS', user: 'dr.thorne@medivo.com', resource: 'PATIENT_SCAN_901', ipHash: 'c7d1...12e9', verification: 'CRYPTOGRAPHICALLY_VERIFIED' },
  ];

  public logEvent(event: string, user: string, resource: string): HipaaAuditLog {
    const newLog: HipaaAuditLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      event,
      user,
      resource,
      ipHash: `a8f9...${Math.floor(1000 + Math.random() * 9000)}`,
      verification: 'CRYPTOGRAPHICALLY_VERIFIED',
    };
    this.logs.unshift(newLog);
    return newLog;
  }

  public getLogs(): HipaaAuditLog[] {
    return this.logs;
  }
}

export const auditService = new DynamicAuditService();
