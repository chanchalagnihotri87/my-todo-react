import Objective from "../models/Objective";
import {
  DeleteRequest,
  GetRequest,
  PatchRequest,
  PostRequest,
} from "../utils/httprequest";

const ObjectiveService = {
  async getTwentyPercentObjectives(goalId: number) {
    const objectives = await this.getObjectives(goalId);

    return objectives
      .filter((x) => x.twentyPercent && !x.completed)
      .sort((a: Objective, b: Objective) => a.index - b.index);
  },

  async getObjectives(goalId: number) {
    const { objectives }: { objectives: Objective[] } = await GetRequest(
      `/objective-service/objectives/${goalId}`
    );

    return objectives.sort((a: Objective, b: Objective) => a.index - b.index);
  },

  async getObjectiveById(id: number) {
    const { objective }: { objective: Objective } = await GetRequest(
      `/objective-service/objectives/detail/${id}`
    );

    return objective;
  },

  addObjective: async (goalId: number, text: string): Promise<number> => {
    const { id }: { id: number } = await PostRequest(
      `/objective-service/objectives`,
      {
        Objective: { goalId, text },
      }
    );

    return id;
  },

  updateText: async (id: number, text: string): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/objective-service/objectives/text/${id}`,
      { text: text }
    );

    return isSuccess;
  },

  updatePlan: async (id: number, plan: string): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/objective-service/objectives/plan/${id}`,
      { plan: plan }
    );

    return isSuccess;
  },
  deleteObjective: async (id: number): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await DeleteRequest(
      `/objective-service/objectives/${id}`
    );

    return isSuccess;
  },
  markAsTwentyPercent: async (id: number): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/objective-service/objectives/twentypercent/${id}`,
      { twentyPercent: true }
    );

    return isSuccess;
  },
  markAsNormal: async (id: number): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/objective-service/objectives/twentypercent/${id}`,
      { twentyPercent: false }
    );

    return isSuccess;
  },
  toggleCompleted: async (objective: Objective): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/objective-service/objectives/complete/${objective.id}`,
      { completed: !objective.completed }
    );

    return isSuccess;
  },
  moveObjective: async (
    id: number,
    index: number,
    goalId: number
  ): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/objective-service/objectives/move/${id}`,
      { goalId, index }
    );

    return isSuccess;
  },
};

export default ObjectiveService;
