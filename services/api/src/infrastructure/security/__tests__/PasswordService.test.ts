import { describe, it, expect } from 'vitest';
import { PasswordService } from '../PasswordService.js';

describe('PasswordService (OWASP scrypt)', () => {
  it('should hash a password and return a standard scrypt format', async () => {
    const password = 'CorrectHorseBatteryStaple123!';
    const hash = await PasswordService.hash(password);

    expect(hash).toBeDefined();
    expect(hash.startsWith('$scrypt$')).toBe(true);
    expect(hash).toContain('N=16384,r=8,p=1');
  });

  it('should verify a correct password against its hash', async () => {
    const password = 'MySecureClinicalPassword@2026';
    const hash = await PasswordService.hash(password);

    const isMatch = await PasswordService.verify(password, hash);
    expect(isMatch).toBe(true);
  });

  it('should reject an incorrect password', async () => {
    const password = 'RealPassword#1';
    const hash = await PasswordService.hash(password);

    const isMatch = await PasswordService.verify('WrongPassword#2', hash);
    expect(isMatch).toBe(false);
  });

  it('should reject empty, null, or invalid inputs safely', async () => {
    const hash = await PasswordService.hash('validPassword');

    expect(await PasswordService.verify('', hash)).toBe(false);
    expect(await PasswordService.verify(null as any, hash)).toBe(false);
    expect(await PasswordService.verify('validPassword', '')).toBe(false);
    expect(await PasswordService.verify('validPassword', null as any)).toBe(false);
  });

  it('should detect when a legacy hash needs upgrading', () => {
    expect(PasswordService.needsRehash('hashed_pw_123')).toBe(true);
    expect(PasswordService.needsRehash('password123')).toBe(true);
    expect(PasswordService.needsRehash('$scrypt$N=16384,r=8,p=1$abc$def')).toBe(false);
  });

  it('should support synchronous hashing and verification for seeders', () => {
    const password = 'SyncPassword#2026';
    const hash = PasswordService.hashSync(password);
    expect(hash.startsWith('$scrypt$')).toBe(true);

    expect(PasswordService.verifySync(password, hash)).toBe(true);
    expect(PasswordService.verifySync('Wrong', hash)).toBe(false);
  });
});
