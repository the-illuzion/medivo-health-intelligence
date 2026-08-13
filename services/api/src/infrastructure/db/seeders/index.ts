import { seedUsers } from './user.seeder.js';
import { seedDoctors } from './doctor.seeder.js';
import { seedProducts } from './product.seeder.js';
import { seedScans } from './scan.seeder.js';
import { seedAppointments } from './appointment.seeder.js';
import { seedOrders } from './order.seeder.js';

export async function runSeeders(): Promise<void> {
  console.log('🌱 Executing All PostgreSQL Domain Seeders...');
  await seedUsers();
  await seedDoctors();
  await seedProducts();
  await seedScans();
  await seedAppointments();
  await seedOrders();
  console.log('✅ PostgreSQL Database Seeding Complete across all schemas.');
}
