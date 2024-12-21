import LifeArea from "../models/LifeArea";
import { GetRequest, PatchRequest } from "../utils/httprequest";

const LifeAreaService = {
  getLifeAreaById: async (id: number): Promise<LifeArea> => {
    const { lifeArea }: { lifeArea: LifeArea } = await GetRequest(
      `/lifearea-service/lifeareas/detail/${id}`
    );

    return lifeArea;
  },

  updateVision: async (id: number, vision: string): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/lifearea-service/lifeareas/vision/${id}`,
      { vision: vision }
    );

    return isSuccess;
  },
  updatePlan: async (id: number, plan: string): Promise<boolean> => {
    const { isSuccess }: { isSuccess: boolean } = await PatchRequest(
      `/lifearea-service/lifeareas/plan/${id}`,
      { plan: plan }
    );

    return isSuccess;
  },
};

export default LifeAreaService;
