import Goal from "../models/Goal";
import {
  DeleteRequest,
  GetRequest,
  PatchRequest,
  PostRequest,
} from "../utils/httprequest";

const GoalService = {
  async getTwentyPercentGoals(problemId: number) {
    const goals = await this.getGoals(problemId);

    return goals
      .filter((x) => x.twentyPercent && !x.completed)
      .sort((a: Goal, b: Goal) => a.index - b.index);
  },

  async getGoals(problemId: number) {
    const { goals }: { goals: Goal[] } = await GetRequest(
      `/goal-service/goals/${problemId}`
    );

    return goals.sort((a: Goal, b: Goal) => a.index - b.index);
  },

  async getGoalById(id: number) {
    const { goal }: { goal: Goal } = await GetRequest(
      `/goal-service/goals/detail/${id}`
    );

    return goal;
  },

  addGoal: async (problemId: number, text: string): Promise<number> => {
    const { id }: { id: number } = await PostRequest(`/goal-service/goals`, {
      Goal: { problemId, text },
    });

    return id;
  },

  updateText: async (id: number, text: string): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/goal-service/goals/text/${id}`,
      { text: text }
    );

    return isSuccess;
  },

  updatePlan: async (id: number, plan: string): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/goal-service/goals/plan/${id}`,
      { plan: plan }
    );

    return isSuccess;
  },
  deleteGoal: async (id: number): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await DeleteRequest(
      `/goal-service/goals/${id}`
    );

    return isSuccess;
  },
  markAsTwentyPercent: async (id: number): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/goal-service/goals/twentypercent/${id}`,
      { twentyPercent: true }
    );

    return isSuccess;
  },
  markAsNormal: async (id: number): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/goal-service/goals/twentypercent/${id}`,
      { twentyPercent: false }
    );

    return isSuccess;
  },
  toggleCompleted: async (goal: Goal): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/goal-service/goals/complete/${goal.id}`,
      { completed: !goal.completed }
    );

    return isSuccess;
  },
  moveGoal: async (
    id: number,
    index: number,
    problemId: number
  ): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/goal-service/goals/move/${id}`,
      { problemId, index }
    );

    return isSuccess;
  },
};

export default GoalService;
