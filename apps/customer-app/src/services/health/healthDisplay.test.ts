import type { HealthConnection } from './healthApi';
import {
  APPLE_HEALTH_PERMISSION_CHECK_DELAY_MS,
  appleHealthNeedsPermissionCheck,
} from './healthDisplay';

const connectedAt = '2026-09-15T00:00:00.000Z';

function connection(overrides: Partial<HealthConnection> = {}): HealthConnection {
  return {
    provider: 'apple_health',
    status: 'connected',
    requestedMetrics: ['step_count'],
    connectedAt,
    lastSyncedAt: '2026-09-15T00:01:00.000Z',
    hasImportedData: false,
    ...overrides,
  };
}

describe('appleHealthNeedsPermissionCheck', () => {
  it('does not warn before the testing threshold', () => {
    const now = new Date(connectedAt).getTime() + APPLE_HEALTH_PERMISSION_CHECK_DELAY_MS - 1;
    expect(appleHealthNeedsPermissionCheck(connection(), now)).toBe(false);
  });

  it('warns after one hour when the connection has never imported a sample', () => {
    const now = new Date(connectedAt).getTime() + APPLE_HEALTH_PERMISSION_CHECK_DELAY_MS;
    expect(appleHealthNeedsPermissionCheck(connection(), now)).toBe(true);
  });

  it('does not warn when Apple Health data has been imported before', () => {
    const now = new Date(connectedAt).getTime() + APPLE_HEALTH_PERMISSION_CHECK_DELAY_MS * 4;
    expect(appleHealthNeedsPermissionCheck(connection({ hasImportedData: true }), now)).toBe(false);
  });

  it('does not warn until at least one sync has completed', () => {
    const now = new Date(connectedAt).getTime() + APPLE_HEALTH_PERMISSION_CHECK_DELAY_MS * 4;
    expect(appleHealthNeedsPermissionCheck(connection({ lastSyncedAt: null }), now)).toBe(false);
  });
});
