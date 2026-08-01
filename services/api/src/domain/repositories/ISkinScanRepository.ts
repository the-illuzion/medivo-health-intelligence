import { SkinScan } from '../skin/SkinScanEntity.js';

export interface ISkinScanRepository {
  save(scan: SkinScan): Promise<void>;
  findByUserId(userId: string): Promise<SkinScan[]>;
  findLatestByUserId(userId: string): Promise<SkinScan | null>;
}
