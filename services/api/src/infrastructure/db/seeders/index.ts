import { seedUsers } from './user.seeder.js';
import { seedDoctors } from './doctor.seeder.js';
import { seedProducts } from './product.seeder.js';
import { seedScans } from './scan.seeder.js';
import { seedAppointments } from './appointment.seeder.js';
import { seedOrders } from './order.seeder.js';
import { seedDemoHealthData } from './demo.seeder.js';

export async function runSeeders(): Promise<void> {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PRODUCTION_SEED !== 'true') {
    console.log('🔒 Production environment detected: skipping demo seeders to protect production data integrity.');
    return;
  }
  console.log('🌱 Executing All PostgreSQL Domain Seeders...');
  await seedUsers();
  await seedDoctors();
  await seedProducts();
  await seedScans();
  await seedAppointments();
  await seedOrders();
  await seedDemoHealthData();
  console.log('✅ PostgreSQL Database Seeding Complete across all schemas.');
}
