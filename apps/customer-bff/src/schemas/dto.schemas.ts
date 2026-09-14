import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  skinType: z.string().optional().default('Combination'),
});

export const analyzeScanSchema = z.object({
  userId: z.string().optional(),
  imageBase64: z.string().min(10, 'imageBase64 skin payload is required'),
});

export const bookAppointmentSchema = z.object({
  doctorId: z.string().min(1, 'doctorId is required'),
  doctorName: z.string().min(1, 'doctorName is required'),
  date: z.string().min(1, 'date is required'),
  time: z.string().min(1, 'time is required'),
  condition: z.string().optional(),
});

export const checkoutSchema = z.object({
  items: z.array(z.object({
    id: z.number(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
  })).min(1, 'At least one item required in cart'),
  totalAmount: z.number().positive(),
});

export const coachChatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
});

export const hipaaConsentSchema = z.object({
  consent: z.boolean(),
});

// Vitals & Biomarkers DTO Schemas
export const createVitalReadingSchema = z.object({
  metricType: z.string().min(1, 'Metric type is required'),
  valueNumeric: z.number().optional(),
  valueString: z.string().min(1, 'Value string is required'),
  unit: z.string().optional().default(''),
  baselineValue: z.number().optional(),
  changePct: z.number().optional().default(0),
  changeLabel: z.string().optional().default('Within'),
  tone: z.enum(['blue', 'green', 'purple', 'orange', 'red']).optional().default('blue'),
  source: z.string().optional().default('Manual'),
});

export const vitalsQuerySchema = z.object({
  period: z.enum(['Day', 'Week', 'Month']).optional().default('Day'),
});

// Care Plans & Daily Tasks DTO Schemas
export const carePlanQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD').optional(),
});

export const toggleCareTaskSchema = z.object({
  taskId: z.string().min(1, 'Task ID is required'),
  status: z.enum(['Completed', 'Pending', 'Upcoming']),
});

export const markAllTasksSchema = z.object({
  planDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD').optional(),
});

// Health Profile & Medical Records DTO Schemas
export const updateHealthProfileSchema = z.object({
  name: z.string().optional(),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  bloodGroup: z.string().optional(),
  location: z.string().optional(),
  allergies: z.array(z.string()).optional(),
  conditions: z.array(z.string()).optional(),
  goals: z.array(z.string()).optional(),
  lifestyle: z.record(z.string(), z.string()).optional(),
});

export const createMedicationSchema = z.object({
  name: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().optional().default('Daily'),
  instructions: z.string().optional().default(''),
});

export const createCareNetworkMemberSchema = z.object({
  memberName: z.string().min(1, 'Member name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  role: z.string().optional().default('Family Caregiver'),
  isMale: z.boolean().optional().default(false),
});

export const createHealthRecordSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  recordType: z.enum(['lab', 'medical', 'prescription']),
  doctorName: z.string().optional().default('Attending Physician'),
  recordDate: z.string().optional(),
  notes: z.string().optional(),
  s3Key: z.string().optional(),
});

// Wearable Devices DTO Schemas
export const connectDeviceSchema = z.object({
  name: z.string().min(1, 'Device name is required'),
  kind: z.enum(['watch', 'monitor', 'ring', 'cgm']).optional().default('watch'),
  sharingScopes: z.array(z.string()).optional().default(['Heart Rate', 'Sleep', 'Activity']),
});

export const toggleDeviceSyncSchema = z.object({
  deviceId: z.string().min(1, 'Device ID is required'),
  isEnabled: z.boolean(),
});

