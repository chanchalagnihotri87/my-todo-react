import { createSlice } from "@reduxjs/toolkit";
import Goal from "../models/Goal";
import { converToNumber } from "../utils";

const initialState = {
  goals: [
    new Goal(1, "Correct in english", 1, true, true),
    new Goal(2, "Confidence in english", 1, true, true),
    new Goal(3, "Speaking fast", 1, true, true),
    new Goal(4, "Fluent in english", 1),
  ],
};

const goalSlice = createSlice({
  name: "goal",
  initialState: initialState,
  reducers: {
    addGoal(state, action) {
      let updatedGoals = [...state.goals];

      const id = Math.max(...updatedGoals.map((goal) => goal.id)) + 1;
      updatedGoals.push(new Goal(id, action.payload.text, 1));

      return { ...state, goals: [...updatedGoals] };
    },
    updateGoal(state, action) {
      const id = converToNumber(action.payload.id);
      const text = action.payload.text;

      const updatedGoals = [...state.goals];

      const currentGoalIndex = updatedGoals.findIndex((item) => item.id == id);

      if (currentGoalIndex > -1) {
        updatedGoals[currentGoalIndex].text = text;

        return { ...state, goals: [...updatedGoals] };
      }
    },
    deleteGoal(state, action) {
      const id = converToNumber(action.payload);

      const updatedGoals = [...state.goals];

      const currentGoalIndex = updatedGoals.findIndex((item) => item.id == id);

      if (currentGoalIndex > -1) {
        updatedGoals.splice(currentGoalIndex, 1);

        return { ...state, goals: [...updatedGoals] };
      }

      return state;
    },
    markAs20Percent(state, action) {
      const id = converToNumber(action.payload);

      const updatedGoals = [...state.goals];

      const currentGoalIndex = updatedGoals.findIndex((item) => item.id == id);

      if (currentGoalIndex > -1) {
        updatedGoals[currentGoalIndex].twentyPercent = true;

        return { ...state, goals: [...updatedGoals] };
      }

      return state;
    },
    markAsNormal(state, action) {
      const id = converToNumber(action.payload);

      const updatedGoals = [...state.goals];

      const currentGoalIndex = updatedGoals.findIndex((item) => item.id == id);

      if (currentGoalIndex > -1) {
        updatedGoals[currentGoalIndex].twentyPercent = false;

        return { ...state, goals: [...updatedGoals] };
      }

      return state;
    },

    toggleCompleted(state, action) {
      const id = converToNumber(action.payload);

      const updatedGoals = [...state.goals];

      const currentGoalIndex = updatedGoals.findIndex((item) => item.id == id);

      if (currentGoalIndex > -1) {
        updatedGoals[currentGoalIndex].completed =
          !updatedGoals[currentGoalIndex].completed;

        return { ...state, goals: [...updatedGoals] };
      }

      return state;
    },

    moveGoal(state, action) {
      const id = action.payload.id;
      const index = action.payload.index;
      const problemId = action.payload.problemId;
      const actualIndex = index + 1;

      console.log("Id: " + id);
      console.log("Index: " + index);
      console.log("Problem Id: " + problemId);

      const nonUpdatedGoals = [
        ...state.goals.filter((goal) => goal.problemId !== problemId),
      ];

      const updatedGoals = [
        ...state.goals.filter((goal) => goal.problemId === problemId),
      ];

      const draggedGoal = updatedGoals.find((goal) => goal.id === id);

      if (actualIndex === draggedGoal!.index) {
        return state;
      }

      if (actualIndex < draggedGoal!.index) {
        updatedGoals
          .filter(
            (goal) =>
              goal.index <= draggedGoal!.index && goal.index >= actualIndex
          )
          .forEach((goal) => {
            goal.index++;
          });
      } else {
        updatedGoals
          .filter(
            (goal) =>
              goal.index >= actualIndex && goal.index <= draggedGoal!.index
          )
          .forEach((goal) => {
            goal.index--;
          });
      }

      draggedGoal!.index = actualIndex;

      return {
        ...state,
        goals: [...nonUpdatedGoals, ...updatedGoals],
      };
    },
    updatePlan(state, action) {
      const id = action.payload.id;
      const plan = action.payload.plan;

      const goal = state.goals.find((goal) => goal.id == id);
      goal!.plan = plan;

      return { ...state, goals: [...state.goals] };
    },
  },
});

export const goalActions = goalSlice.actions;

export default goalSlice.reducer;
