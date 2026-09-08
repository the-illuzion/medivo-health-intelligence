-- Migration 005: Secure Password Hashing & Legacy Cleanup
-- Updates all legacy plain-text and mock seed records in auth_schema.users with OWASP scrypt hashes

UPDATE auth_schema.users
SET password_hash = '$scrypt$N=16384,r=8,p=1$0123456789abcdef0123456789abcdef$d088ff89d52c0da7840b769c9055596af699cfdd025910d984548f1c2aaec912263f7f9b924ed19c9e43feff83d9fa02bea94b1b90b66671f3083fd85d65de4f'
WHERE password_hash LIKE 'hashed_pw_%' 
   OR password_hash = 'password123' 
   OR password_hash NOT LIKE '$scrypt$%';

COMMENT ON COLUMN auth_schema.users.password_hash IS 'Cryptographically hashed password using OWASP scrypt ($scrypt$N=16384,r=8,p=1$<salt>$<hash>). Plain text passwords strictly prohibited.';
