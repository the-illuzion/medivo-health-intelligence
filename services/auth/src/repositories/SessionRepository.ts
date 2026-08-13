import { UserSession } from '../models/UserSession.js';

export class SessionRepository {
  private sessions: Map<string, UserSession> = new Map();

  public async save(session: UserSession): Promise<void> {
    this.sessions.set(session.sessionId, session);
  }

  public async findBySessionId(sessionId: string): Promise<UserSession | null> {
    return this.sessions.get(sessionId) || null;
  }
}
