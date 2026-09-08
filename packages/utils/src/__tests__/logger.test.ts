import { describe, it, expect, vi } from 'vitest';
import { Logger, createLogger } from '../logger.js';

describe('Universal Logger', () => {
  it('should initialize with default service name and level', () => {
    const logger = createLogger('test-service');
    expect(logger).toBeInstanceOf(Logger);
  });

  it('should redact sensitive PII/PHI keys from log context', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const logger = new Logger('redaction-test');

    logger.info('User action', {
      password: 'superSecretPassword123',
      token: 'jwt.token.here',
      creditCard: '4111222233334444',
      cvv: '123',
      ssn: '000-12-3456',
      safeField: 'visibleValue',
    });

    expect(consoleSpy).toHaveBeenCalled();
    const loggedStr = consoleSpy.mock.calls[0][0];
    expect(loggedStr).toContain('[REDACTED_CONFIDENTIAL]');
    expect(loggedStr).not.toContain('superSecretPassword123');
    expect(loggedStr).not.toContain('jwt.token.here');
    expect(loggedStr).not.toContain('4111222233334444');
    expect(loggedStr).toContain('visibleValue');

    consoleSpy.mockRestore();
  });

  it('should redact base64 image data strings to stream indicators', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const logger = new Logger('image-test');

    logger.info('Scan payload received', {
      imageBase64: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCA...',
    });

    expect(consoleSpy).toHaveBeenCalled();
    const loggedStr = consoleSpy.mock.calls[0][0];
    expect(loggedStr).toContain('[BASE64_IMAGE_STREAM');
    expect(loggedStr).not.toContain('/9j/4AAQSkZJRg');

    consoleSpy.mockRestore();
  });

  it('should create child loggers with merged context', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const parentLogger = createLogger('parent-service', { serviceGroup: 'backend' });
    const childLogger = parentLogger.child({ reqId: 'req-abc-123' });

    childLogger.info('Child operation started');

    expect(consoleSpy).toHaveBeenCalled();
    const loggedStr = consoleSpy.mock.calls[0][0];
    expect(loggedStr).toContain('req-abc-123');
    expect(loggedStr).toContain('backend');

    consoleSpy.mockRestore();
  });

  it('should output structured HIPAA audit events', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const logger = new Logger('audit-test');

    logger.audit('USER_CONSENT_GRANTED', 'patient@medivo.com', 'USER_REGISTRY', {
      ip: '192.168.1.1',
    });

    expect(consoleSpy).toHaveBeenCalled();
    const loggedStr = consoleSpy.mock.calls[0][0];
    expect(loggedStr).toContain('HIPAA Audit');
    expect(loggedStr).toContain('USER_CONSENT_GRANTED');
    expect(loggedStr).toContain('CRYPTOGRAPHICALLY_VERIFIED');

    consoleSpy.mockRestore();
  });
});

describe('trackedFetch Universal HTTP Client', () => {
  it('should track latency, status, and redact confidential headers on request', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const mockResponse = {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({ success: true }),
    };

    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockResolvedValue(mockResponse as any);

    const { trackedFetch } = await import('../logger.js');
    const res = await trackedFetch('https://api.external.com/v1/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer secret-token-12345',
        'X-Api-Key': 'my-super-secret-key',
      },
      body: JSON.stringify({ test: 123 }),
      serviceName: 'test-http',
    });

    expect(res.status).toBe(200);
    expect(consoleSpy).toHaveBeenCalled();
    const allCalls = consoleSpy.mock.calls.map((c) => c[0]).join(' ');
    expect(allCalls).toContain('ThirdParty Response OK');
    expect(allCalls).toContain('https://api.external.com/v1/analyze');

    globalThis.fetch = originalFetch;
    consoleSpy.mockRestore();
  });

  it('should record warning and error when third party returns non-200 or throws', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const originalFetch = globalThis.fetch;

    // 1. HTTP 500 error response
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as any);

    const { trackedFetch } = await import('../logger.js');
    const res = await trackedFetch('https://api.external.com/v1/fail', {
      serviceName: 'test-fail-http',
    });
    expect(res.status).toBe(500);

    // 2. Network throw error
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network Connection Refused'));
    await expect(
      trackedFetch('https://api.external.com/v1/crash', {
        serviceName: 'test-crash-http',
      })
    ).rejects.toThrow('Network Connection Refused');

    globalThis.fetch = originalFetch;
    consoleSpy.mockRestore();
  });
});

