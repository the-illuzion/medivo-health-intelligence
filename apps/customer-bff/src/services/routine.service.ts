export interface SkinRoutineStep {
  id: string;
  step: number;
  title: string;
  desc: string;
  duration: string;
  completed?: boolean;
}

export interface SkinRoutine {
  id: string;
  name: string;
  timing: 'Morning' | 'Evening';
  duration: string;
  completedCount?: number;
  totalSteps?: number;
  steps: SkinRoutineStep[];
}

class DynamicRoutineService {
  private userCompletions: Record<string, Record<string, boolean>> = {};

  private routines: SkinRoutine[] = [
    {
      id: 'morning-barrier-protocol',
      name: 'Morning Barrier Defense Protocol',
      timing: 'Morning',
      duration: '5 mins',
      steps: [
        { id: 'm_step_1', step: 1, title: 'Gentle Cleansing', desc: 'Wash with tepid water and gentle balancing clay cleanser.', duration: '1 min', completed: true },
        { id: 'm_step_2', step: 2, title: 'Barrier Hydramist', desc: 'Mist face generously with hyaluronic acid hydramist.', duration: '1 min', completed: true },
        { id: 'm_step_3', step: 3, title: 'Peptide Serum Application', desc: 'Apply 3-4 drops of restorative micro-peptide serum.', duration: '1 min', completed: false },
        { id: 'm_step_4', step: 4, title: 'Mineral Sunscreen SPF 50', desc: 'Apply broad-spectrum mineral sunscreen over face and neck.', duration: '2 mins', completed: false },
      ],
    },
    {
      id: 'evening-renewal-protocol',
      name: 'Evening Cell Renewal Protocol',
      timing: 'Evening',
      duration: '8 mins',
      steps: [
        { id: 'e_step_1', step: 1, title: 'Double Cleanse', desc: 'Purify pores with oil cleanser followed by clay cleanser.', duration: '2 mins', completed: true },
        { id: 'e_step_2', step: 2, title: 'Active Niacinamide Serum', desc: 'Pat 10% Niacinamide serum onto cleansed skin.', duration: '2 mins', completed: true },
        { id: 'e_step_3', step: 3, title: 'Ceramide Moisture Seal', desc: 'Massaging rich ceramide cream to lock in overnight moisture.', duration: '4 mins', completed: false },
      ],
    },
  ];

  public getUserRoutines(userId: string): SkinRoutine[] {
    return this.routines.map((r) => this.mapRoutineWithUserCompletions(userId, r));
  }

  public getById(id: string, userId?: string): SkinRoutine | null {
    const routine = this.routines.find((r) => r.id === id);
    if (!routine) return null;
    return userId ? this.mapRoutineWithUserCompletions(userId, routine) : routine;
  }

  public toggleStepCompletion(userId: string, routineId: string, stepId: string, completed: boolean): SkinRoutine | null {
    if (!this.userCompletions[userId]) {
      this.userCompletions[userId] = {};
    }
    const key = `${routineId}:${stepId}`;
    this.userCompletions[userId][key] = completed;

    return this.getById(routineId, userId);
  }

  private mapRoutineWithUserCompletions(userId: string, routine: SkinRoutine): SkinRoutine {
    const userState = this.userCompletions[userId] || {};
    const updatedSteps = routine.steps.map((s) => {
      const key = `${routine.id}:${s.id}`;
      const isCompleted = userState[key] !== undefined ? userState[key] : !!s.completed;
      return { ...s, completed: isCompleted };
    });

    const completedCount = updatedSteps.filter((s) => s.completed).length;

    return {
      ...routine,
      completedCount,
      totalSteps: updatedSteps.length,
      steps: updatedSteps,
    };
  }
}

export const routineService = new DynamicRoutineService();
