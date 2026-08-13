import { DatabasePool } from '../DatabasePool.js';

export async function seedDoctors(): Promise<void> {
  const doctors = [
    { id: '1', userId: 'usr-doc-1', spec: 'Clinical Dermatology & Tele-Health', license: 'MD-7489201', bio: 'Board-Certified Dermatologist specializing in AI sub-dermal barrier restoration.' },
    { id: '2', userId: 'usr-doc-2', spec: 'Cosmetic & Laser Specialist', license: 'MD-8839202', bio: 'Expert in facial pigmentation, acne therapy, and micro-peptide formulations.' },
  ];

  for (const doc of doctors) {
    try {
      await DatabasePool.query(
        `INSERT INTO doctor_schema.doctors (id, user_id, specialization, license_number, bio)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (license_number) DO NOTHING`,
        [doc.id, doc.userId, doc.spec, doc.license, doc.bio]
      );
    } catch (err) {}
  }
}
