import { createSlice } from "@reduxjs/toolkit";
import LifeArea from "../models/LifeArea";
import { converToNumber } from "../utils";
const LIFE_AREAS = [
  new LifeArea(
    1,
    "Business",
    `1. Top IT Company
     2. Top IT Products`,
    "1. Start IT Company \n 2. Make IT company auto pilot 3. Start own product."
  ),
  new LifeArea(2, "Health"),
  new LifeArea(3, "Family"),
  new LifeArea(4, "Finance"),
  new LifeArea(5, "Social"),
  new LifeArea(6, "Finance"),
];

const initialState = { lifeAreas: LIFE_AREAS };

const lifeAreaSlice = createSlice({
  name: "lifearea",
  initialState: initialState,
  reducers: {
    updateVision(state, action) {
      const id = converToNumber(action.payload.id);
      const vision = action.payload.vision;

      const lifeArea = state.lifeAreas.find((lifearea) => lifearea.id == id);
      lifeArea!.vision = vision;

      return { ...state, lifeAreas: [...state.lifeAreas] };
    },
    updatePlan(state, action) {
      const id = action.payload.id;
      const plan = action.payload.plan;

      const lifeArea = state.lifeAreas.find((lifearea) => lifearea.id == id);
      lifeArea!.plan = plan;

      return { ...state, lifeAreas: [...state.lifeAreas] };
    },
  },
});

export const lifeAreaActions = lifeAreaSlice.actions;
export default lifeAreaSlice.reducer;
