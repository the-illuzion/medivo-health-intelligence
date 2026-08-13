import { seedUsers } from './user.seeder.js';
import { seedDoctors } from './doctor.seeder.js';
import { seedProducts } from './product.seeder.js';

export async function runSeeders(): Promise<void> {
  console.log('🌱 Executing Database Seeders...');
  await seedUsers();
  await seedDoctors();
  await seedProducts();
  console.log('✅ PostgreSQL Database Seeding Complete.');
}
