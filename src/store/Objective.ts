import { createSlice } from "@reduxjs/toolkit";
import Objective from "../models/Objective";
import { converToNumber } from "../utils";

const initialState = {
  objectives: [
    new Objective(1, "Feeling as real time conversation", 1, true, true),
    new Objective(2, "Think in english", 1, true, true),
    new Objective(3, "Run time topic", 1, true, true),
    new Objective(4, "English Movies", 1),
  ],
};

const objectiveSlice = createSlice({
  name: "objective",
  initialState: initialState,
  reducers: {
    addObjective(state, action) {
      let updatedObjectives = [...state.objectives];

      const id =
        Math.max(...updatedObjectives.map((objective) => objective.id)) + 1;
      updatedObjectives.push(new Objective(id, action.payload.text, 1));

      return { ...state, objectives: [...updatedObjectives] };
    },
    updateObjective(state, action) {
      const id = converToNumber(action.payload.id);
      const text = action.payload.text;

      const updatedObjectives = [...state.objectives];

      const currentObjectiveIndex = updatedObjectives.findIndex(
        (item) => item.id == id
      );

      if (currentObjectiveIndex > -1) {
        updatedObjectives[currentObjectiveIndex].text = text;

        return { ...state, objectives: [...updatedObjectives] };
      }
    },
    deleteObjective(state, action) {
      const id = converToNumber(action.payload);

      const updatedObjectives = [...state.objectives];

      const currentObjectiveIndex = updatedObjectives.findIndex(
        (item) => item.id == id
      );

      if (currentObjectiveIndex > -1) {
        updatedObjectives.splice(currentObjectiveIndex, 1);

        return { ...state, objectives: [...updatedObjectives] };
      }

      return state;
    },
    markAs20Percent(state, action) {
      const id = converToNumber(action.payload);

      const updatedObjectives = [...state.objectives];

      const currentObjectiveIndex = updatedObjectives.findIndex(
        (item) => item.id == id
      );

      if (currentObjectiveIndex > -1) {
        updatedObjectives[currentObjectiveIndex].twentyPercent = true;

        return { ...state, objectives: [...updatedObjectives] };
      }

      return state;
    },
    markAsNormal(state, action) {
      const id = converToNumber(action.payload);

      const updatedObjectives = [...state.objectives];

      const currentObjectiveIndex = updatedObjectives.findIndex(
        (item) => item.id == id
      );

      if (currentObjectiveIndex > -1) {
        updatedObjectives[currentObjectiveIndex].twentyPercent = false;

        return { ...state, objectives: [...updatedObjectives] };
      }

      return state;
    },

    toggleCompleted(state, action) {
      const id = converToNumber(action.payload);

      const updatedObjectives = [...state.objectives];

      const currentObjectiveIndex = updatedObjectives.findIndex(
        (item) => item.id == id
      );

      if (currentObjectiveIndex > -1) {
        updatedObjectives[currentObjectiveIndex].completed =
          !updatedObjectives[currentObjectiveIndex].completed;

        return { ...state, objectives: [...updatedObjectives] };
      }

      return state;
    },

    moveObjective(state, action) {
      debugger;
      const id = action.payload.id;
      const index = action.payload.index;
      const goalId = action.payload.goalId;
      const actualIndex = index + 1;

      console.log("Id: " + id);
      console.log("Index: " + index);
      console.log("Problem Id: " + goalId);

      const nonUpdatedObjectives = [
        ...state.objectives.filter((objective) => objective.goalId !== goalId),
      ];

      const updatedObjectives = [
        ...state.objectives.filter((objective) => objective.goalId === goalId),
      ];

      const draggedObjective = updatedObjectives.find(
        (objective) => objective.id === id
      );

      if (actualIndex === draggedObjective!.index) {
        return state;
      }

      if (actualIndex < draggedObjective!.index) {
        updatedObjectives
          .filter(
            (objective) =>
              objective.index <= draggedObjective!.index &&
              objective.index >= actualIndex
          )
          .forEach((objective) => {
            objective.index++;
          });
      } else {
        updatedObjectives
          .filter(
            (objective) =>
              objective.index >= draggedObjective!.index &&
              objective.index <= actualIndex
          )
          .forEach((objective) => {
            objective.index--;
          });
      }

      draggedObjective!.index = actualIndex;

      return {
        ...state,
        objectives: [...nonUpdatedObjectives, ...updatedObjectives],
      };
    },
    updatePlan(state, action) {
      const id = action.payload.id;
      const plan = action.payload.plan;

      const objective = state.objectives.find(
        (objective) => objective.id == id
      );
      objective!.plan = plan;

      return { ...state, objectives: [...state.objectives] };
    },
  },
});

export const objectiveActions = objectiveSlice.actions;

export default objectiveSlice.reducer;
