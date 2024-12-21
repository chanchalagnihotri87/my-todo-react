import Sprint from "../models/Sprint";
import AppHelper from "../utils/app.helper";
import {
  DeleteRequest,
  GetRequest,
  PatchRequest,
  PostRequest,
  PutRequest,
} from "../utils/httprequest";
import { converTotString } from "../utils/index.ts";

const SprintService = {
  async getSprints() {
    const { sprints }: { sprints: Sprint[] } = await GetRequest(
      `/sprint-service/sprints`
    );

    return sprints.sort((a: Sprint, b: Sprint) =>
      AppHelper.convertToDate(a.startDate) <
      AppHelper.convertToDate(b.startDate)
        ? -1
        : 0
    );
  },
  async getActiveSprints() {
    const sprints = await this.getSprints();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return sprints
      .filter((x) => AppHelper.convertToDate(x.endDate) > today)
      .sort((a: Sprint, b: Sprint) =>
        AppHelper.convertToDate(a.startDate) <
        AppHelper.convertToDate(b.startDate)
          ? -1
          : 0
      );
  },

  async getSprintById(id: number) {
    const { sprint }: { sprint: Sprint } = await GetRequest(
      `/sprint-service/sprints/detail/${id}`
    );

    return sprint;
  },

  addSprint: async (
    text: string,
    startDate: Date,
    endDate: Date
  ): Promise<number> => {
    const { id }: { id: number } = await PostRequest(
      `/sprint-service/sprints`,
      {
        text,
        startDate: converTotString(startDate),
        endDate: converTotString(endDate),
      }
    );

    return id;
  },

  updateSprint: async (
    id: number,
    text: string,
    startDate: Date,
    endDate: Date
  ): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PutRequest(
      `/sprint-service/sprints`,
      {
        id,
        text,
        startDate: converTotString(startDate),
        endDate: converTotString(endDate),
      }
    );

    return isSuccess;
  },

  deleteSprint: async (id: number): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await DeleteRequest(
      `/sprint-service/sprints/${id}`
    );

    return isSuccess;
  },
  toggleCompleted: async (sprint: Sprint): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/sprint-service/sprints/complete/${sprint.id}`,
      { completed: !sprint.completed }
    );

    return isSuccess;
  },
};

export default SprintService;
