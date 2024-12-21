import Task from "../models/Task";
import {
  DeleteRequest,
  GetRequest,
  PatchRequest,
  PostRequest,
} from "../utils/httprequest";

const TaskService = {
  async getTwentyPercentTasks(objectiveId: number) {
    const tasks = await this.getTasks(objectiveId);

    return tasks
      .filter((x) => x.twentyPercent && !x.completed)
      .sort((a: Task, b: Task) => a.index - b.index);
  },

  async getTasks(goalId: number) {
    const { tasks }: { tasks: Task[] } = await GetRequest(
      `/todo-service/tasks/${goalId}`
    );

    return tasks.sort((a: Task, b: Task) => a.index - b.index);
  },

  async getTaskById(id: number) {
    const { task }: { task: Task } = await GetRequest(
      `/todo-service/tasks/detail/${id}`
    );

    return task;
  },

  addTask: async (objectiveId: number, text: string): Promise<number> => {
    const { id }: { id: number } = await PostRequest(`/todo-service/tasks`, {
      Task: { objectiveId, text },
    });

    return id;
  },

  updateText: async (id: number, text: string): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/todo-service/tasks/text/${id}`,
      { text: text }
    );

    return isSuccess;
  },

  updatePlan: async (id: number, plan: string): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/todo-service/tasks/plan/${id}`,
      { plan: plan }
    );

    return isSuccess;
  },
  deleteTask: async (id: number): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await DeleteRequest(
      `/todo-service/tasks/${id}`
    );

    return isSuccess;
  },
  markAsTwentyPercent: async (id: number): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/todo-service/tasks/twentypercent/${id}`,
      { twentyPercent: true }
    );

    return isSuccess;
  },
  markAsNormal: async (id: number): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/todo-service/tasks/twentypercent/${id}`,
      { twentyPercent: false }
    );

    return isSuccess;
  },
  toggleCompleted: async (task: Task): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/todo-service/tasks/complete/${task.id}`,
      { completed: !task.completed }
    );

    return isSuccess;
  },
  moveTask: async (
    id: number,
    index: number,
    objectiveId: number
  ): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/todo-service/tasks/move/${id}`,
      { objectiveId, index }
    );

    return isSuccess;
  },
};

export default TaskService;
