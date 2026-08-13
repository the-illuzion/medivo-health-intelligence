export interface SkinRoutineStep {
  step: number;
  title: string;
  desc: string;
  duration: string;
}

export interface SkinRoutine {
  id: string;
  name: string;
  timing: 'Morning' | 'Evening';
  duration: string;
  steps: SkinRoutineStep[];
}

class DynamicRoutineService {
  private routines: SkinRoutine[] = [
    {
      id: 'morning-barrier-protocol',
      name: 'Morning Barrier Defense Protocol',
      timing: 'Morning',
      duration: '5 mins',
      steps: [
        { step: 1, title: 'Gentle Cleansing', desc: 'Wash with tepid water and gentle balancing clay cleanser.', duration: '1 min' },
        { step: 2, title: 'Barrier Hydramist', desc: 'Mist face generously with hyaluronic acid hydramist.', duration: '1 min' },
        { step: 3, title: 'Peptide Serum Application', desc: 'Apply 3-4 drops of restorative micro-peptide serum.', duration: '1 min' },
        { step: 4, title: 'Mineral Sunscreen SPF 50', desc: 'Apply broad-spectrum mineral sunscreen over face and neck.', duration: '2 mins' },
      ],
    },
    {
      id: 'evening-renewal-protocol',
      name: 'Evening Cell Renewal Protocol',
      timing: 'Evening',
      duration: '8 mins',
      steps: [
        { step: 1, title: 'Double Cleanse', desc: 'Purify pores with oil cleanser followed by clay cleanser.', duration: '2 mins' },
        { step: 2, title: 'Active Niacinamide Serum', desc: 'Pat 10% Niacinamide serum onto cleansed skin.', duration: '2 mins' },
        { step: 3, title: 'Ceramide Moisture Seal', desc: 'Massaging rich ceramide cream to lock in overnight moisture.', duration: '4 mins' },
      ],
    },
  ];

  public getAll(): SkinRoutine[] {
    return this.routines;
  }

  public getById(id: string): SkinRoutine | null {
    return this.routines.find((r) => r.id === id) || null;
  }
}

export const routineService = new DynamicRoutineService();
