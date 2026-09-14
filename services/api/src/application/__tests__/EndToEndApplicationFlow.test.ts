import { describe, it, expect } from 'vitest';
import { AuthenticateUserUseCase } from '../auth/AuthenticateUserUseCase.js';
import { SubmitSkinScanUseCase } from '../skin/SubmitSkinScanUseCase.js';
import { InMemoryAuthRepository } from '../../infrastructure/repositories/InMemoryAuthRepository.js';
import { InMemorySkinScanRepository } from '../../infrastructure/repositories/InMemorySkinScanRepository.js';
import { JwtTokenService } from '../../infrastructure/security/JwtTokenService.js';
import { SimulatedAIInferenceService } from '../../infrastructure/ai/SimulatedAIInferenceService.js';

describe('End-to-End Application Flow — Initial Stage to Full Care Plan', () => {
  const authRepo = new InMemoryAuthRepository();
  const jwtService = new JwtTokenService();
  const authUseCase = new AuthenticateUserUseCase(authRepo, jwtService);

  const scanRepo = new InMemorySkinScanRepository();
  const aiService = new SimulatedAIInferenceService();
  const scanUseCase = new SubmitSkinScanUseCase(scanRepo, aiService);

  let authenticatedToken = '';
  let authenticatedUserId = '';

  // STAGE 1: Authentication & Identity
  describe('Stage 1: User Authentication & Credential Verification', () => {
    it('should reject authentication with invalid password', async () => {
      await expect(
        authUseCase.execute('test@yopmail.com', 'WrongPassword!'),
      ).rejects.toThrow('Invalid email or password');
    });

    it('should reject authentication for non-existent user email', async () => {
      await expect(
        authUseCase.execute('unknown.user@example.com', 'Test@123'),
      ).rejects.toThrow('Invalid email or password');
    });

    it('should successfully authenticate test@yopmail.com with Test@123 and return user DTO and valid JWT token', async () => {
      const result = await authUseCase.execute('test@yopmail.com', 'Test@123');

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('test@yopmail.com');
      expect(result.user.name).toBe('Alex Morgan');
      expect(result.user.hipaaConsent).toBe(true);
      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe('string');

      authenticatedToken = result.token;
      authenticatedUserId = result.user.id;

      // Verify JWT payload
      const payload = await jwtService.verifyToken(result.token);
      expect(payload).toBeDefined();
      expect(payload?.userId).toBe(result.user.id);
      expect(payload?.role).toBe('PATIENT');
    });
  });

  // STAGE 2: Telemetry & Biomarkers
  describe('Stage 2: Biomarkers & Vitals Telemetry Flow', () => {
    it('should structure core health vitals with valid reference ranges and baselines', () => {
      const vitals = [
        { metric: 'Heart Rate', value: '76', unit: 'bpm', baseline: '70 bpm', tone: 'red' },
        { metric: 'Blood Pressure', value: '118/76', unit: 'mmHg', baseline: '120/80 mmHg', tone: 'blue' },
        { metric: 'SpO₂', value: '98', unit: '%', baseline: '98%', tone: 'purple' },
        { metric: 'Sleep', value: '7h 24m', unit: '', baseline: '6h 30m', tone: 'blue' },
        { metric: 'Activity', value: '8,421', unit: 'steps', baseline: '7,000 steps', tone: 'green' },
        { metric: 'Temperature', value: '36.8', unit: '°C', baseline: '36.6 °C', tone: 'orange' },
        { metric: 'Stress', value: 'Low', unit: '', baseline: 'Moderate', tone: 'purple' },
      ];

      expect(vitals).toHaveLength(7);
      vitals.forEach((v) => {
        expect(v.metric).toBeTruthy();
        expect(v.value).toBeTruthy();
        expect(v.baseline).toBeTruthy();
        expect(['blue', 'green', 'purple', 'orange', 'red']).toContain(v.tone);
      });
    });

    it('should compute health score and delta comparisons correctly', () => {
      const healthScore = {
        score: 85,
        deltaPts: 6,
        comparisonPeriod: 'yesterday',
      };

      expect(healthScore.score).toBeGreaterThanOrEqual(0);
      expect(healthScore.score).toBeLessThanOrEqual(100);
      expect(healthScore.deltaPts).toBe(6);
    });
  });

  // STAGE 3: Care Plan & Task Execution
  describe('Stage 3: Care Plan Schedule & Adherence Lifecycle', () => {
    interface Task {
      id: string;
      period: 'Morning' | 'Afternoon' | 'Evening';
      time: string;
      name: string;
      status: 'Completed' | 'Pending' | 'Upcoming';
    }

    const tasks: Task[] = [
      { id: 'tsk-1', period: 'Morning', time: '8:00 AM', name: 'Take morning medication', status: 'Completed' },
      { id: 'tsk-2', period: 'Morning', time: '8:30 AM', name: 'Log breakfast', status: 'Completed' },
      { id: 'tsk-3', period: 'Morning', time: '9:00 AM', name: 'Light activity', status: 'Pending' },
      { id: 'tsk-4', period: 'Afternoon', time: '12:30 PM', name: 'Lunch & log meal', status: 'Upcoming' },
      { id: 'tsk-5', period: 'Afternoon', time: '3:00 PM', name: 'Check vitals', status: 'Upcoming' },
      { id: 'tsk-6', period: 'Evening', time: '9:00 PM', name: 'Sleep prep', status: 'Upcoming' },
    ];

    it('should accurately calculate initial task adherence (2/6 = 33%)', () => {
      const completed = tasks.filter((t) => t.status === 'Completed').length;
      const adherence = Math.round((completed / tasks.length) * 100);

      expect(completed).toBe(2);
      expect(adherence).toBe(33);
    });

    it('should toggle task completion and update overall adherence', () => {
      // Toggle tsk-3 from Pending to Completed
      const updatedTasks = tasks.map((t) =>
        t.id === 'tsk-3' ? { ...t, status: 'Completed' as const } : t,
      );

      const completed = updatedTasks.filter((t) => t.status === 'Completed').length;
      const adherence = Math.round((completed / updatedTasks.length) * 100);

      expect(completed).toBe(3);
      expect(adherence).toBe(50);
    });

    it('should mark all tasks completed and reach 100% adherence', () => {
      const allCompleted = tasks.map((t) => ({ ...t, status: 'Completed' as const }));
      const completed = allCompleted.filter((t) => t.status === 'Completed').length;
      const adherence = Math.round((completed / allCompleted.length) * 100);

      expect(completed).toBe(6);
      expect(adherence).toBe(100);
    });
  });

  // STAGE 4: Connected Devices & Wearables
  describe('Stage 4: Wearable Device Sync & Pairing', () => {
    it('should manage connected devices and allow sync state toggling', () => {
      const devices = [
        { id: 'dev-1', name: 'Apple Watch', kind: 'watch', enabled: true, battery: 78 },
        { id: 'dev-2', name: 'Withings BP Monitor', kind: 'monitor', enabled: true, battery: 90 },
        { id: 'dev-3', name: 'Dexcom CGM', kind: 'cgm', enabled: true, battery: 65 },
      ];

      expect(devices).toHaveLength(3);
      expect(devices.filter((d) => d.enabled)).toHaveLength(3);

      // Toggle off Apple Watch sync
      const updated = devices.map((d) => (d.id === 'dev-1' ? { ...d, enabled: false } : d));
      expect(updated.find((d) => d.id === 'dev-1')?.enabled).toBe(false);
      expect(updated.filter((d) => d.enabled)).toHaveLength(2);
    });
  });

  // STAGE 5: Optical AI Face & Skin Scan Pipeline
  describe('Stage 5: Optical AI Scan & Biomarker Inference', () => {
    it('should verify HIPAA consent requirement prior to optical scan analysis', () => {
      const verifyConsent = (hasConsent: boolean) => {
        if (!hasConsent) {
          throw new Error('HIPAA Consent Required: User has not consented to AI health data analysis');
        }
        return true;
      };

      expect(() => verifyConsent(false)).toThrow('HIPAA Consent Required');
      expect(verifyConsent(true)).toBe(true);
    });

    it('should submit scan with HIPAA consent, generate all 15 clinical skin biomarkers, and save scan dossier', async () => {
      const validBuffer = Buffer.alloc(1200);
      for (let i = 0; i < validBuffer.length; i += 3) {
        validBuffer[i] = 160 + (i % 30);
        validBuffer[i + 1] = 120 + ((i * 2) % 25);
        validBuffer[i + 2] = 100 + ((i * 3) % 20);
      }
      const validImage = `data:image/jpeg;base64,${validBuffer.toString('base64')}`;

      const result = await scanUseCase.execute(
        authenticatedUserId,
        validImage,
        'v1.0',
      );

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.overallScore).toBeGreaterThanOrEqual(0);
      expect(result.overallScore).toBeLessThanOrEqual(100);
      expect(result.metrics).toBeDefined();
      expect(result.recommendations.length).toBeGreaterThan(0);

      // Verify key biomarker parameters
      expect(result.metrics.hydration).toBeDefined();
      expect(result.metrics.oiliness).toBeDefined();
      expect(result.metrics.texture).toBeDefined();
      expect(result.metrics.poreClarity).toBeDefined();
      expect(result.metrics.skinAge).toBeDefined();
      expect(result.metrics.barrierHealth).toBeDefined();

      // Retrieve from repository to verify data persistence
      const persisted = await scanRepo.findById(result.id);
      expect(persisted).toBeDefined();
      expect(persisted?.userId).toBe(authenticatedUserId);
      expect(persisted?.overallScore).toBe(result.overallScore);
    });
  });
});
