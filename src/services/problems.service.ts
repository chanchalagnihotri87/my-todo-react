import Problem from "../models/Problem";
import {
  DeleteRequest,
  GetRequest,
  PatchRequest,
  PostRequest,
} from "../utils/httprequest.ts";

const ProblemService = {
  async getTwentyPercentProblems(lifeAreaId: number) {
    const response = await fetch(`/problem-service/problems/${lifeAreaId}`);

    const { problems }: { problems: Problem[] } = await response.json();

    return problems
      .filter((p) => p.twentyPercent && !p.completed)
      .sort((a: Problem, b: Problem) => a.index - b.index);
  },

  async getProblems(lifeAreaId: number) {
    const { problems }: { problems: Problem[] } = await GetRequest(
      `/problem-service/problems/${lifeAreaId}`
    );

    return problems.sort((a: Problem, b: Problem) => a.index - b.index);
  },

  async getProblemById(id: number) {
    const { problem }: { problem: Problem } = await GetRequest(
      `/problem-service/problems/detail/${id}`
    );

    return problem;
  },

  addProblem: async (lifeAreaId: number, text: string): Promise<number> => {
    const { id }: { id: number } = await PostRequest(
      `/problem-service/problems`,
      {
        Problem: { lifeAreaId: lifeAreaId, text: text },
      }
    );

    return id;
  },

  updateText: async (id: number, text: string): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/problem-service/problems/text/${id}`,
      { text: text }
    );

    return isSuccess;
  },
  updatePlan: async (id: number, plan: string): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/problem-service/problems/plan/${id}`,
      { plan: plan }
    );

    return isSuccess;
  },
  deleteProblem: async (id: number): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await DeleteRequest(
      `/problem-service/problems/${id}`
    );

    return isSuccess;
  },
  markAsTwentyPercent: async (id: number): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/problem-service/problems/twentypercent/${id}`,
      { twentyPercent: true }
    );

    return isSuccess;
  },
  markAsNormal: async (id: number): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/problem-service/problems/twentypercent/${id}`,
      { twentyPercent: false }
    );

    return isSuccess;
  },
  toggleCompleted: async (problem: Problem): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/problem-service/problems/complete/${problem.id}`,
      { completed: !problem.completed }
    );

    return isSuccess;
  },
  moveProblem: async (
    id: number,
    index: number,
    lifeAreaId: number
  ): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/problem-service/problems/move/${id}`,
      { lifeAreaId, index }
    );

    return isSuccess;
  },
};

export default ProblemService;
