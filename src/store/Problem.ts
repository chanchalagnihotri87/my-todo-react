import { createSlice } from "@reduxjs/toolkit";
import Problem from "../models/Problem";
import { converToNumber } from "../utils";

const initialState = {
  problems: [
    new Problem(1, "Not able to speak in english", 1, true, true),
    new Problem(2, "Lack of sales man skill", 1, true, true),
    new Problem(3, "Build product from scratch", 1, true, true),
    new Problem(4, "Business mindset", 1),
  ],
};

const problemSlice = createSlice({
  name: "problem",
  initialState: initialState,
  reducers: {
    addProblem(state, action) {
      let updatedProblems = [...state.problems];

      const id = Math.max(...updatedProblems.map((prob) => prob.id)) + 1;
      updatedProblems.push(new Problem(id, action.payload.text, 1));

      return { ...state, problems: [...updatedProblems] };
    },
    updateProblem(state, action) {
      const id = converToNumber(action.payload.id);
      const text = action.payload.text;

      const updatedProblems = [...state.problems];

      const currentProblemIndex = updatedProblems.findIndex(
        (item) => item.id == id
      );

      if (currentProblemIndex > -1) {
        updatedProblems[currentProblemIndex].text = text;

        return { ...state, problems: [...updatedProblems] };
      }
    },
    deleteProblem(state, action) {
      const id = converToNumber(action.payload);

      const updatedProblems = [...state.problems];

      const currentProblemIndex = updatedProblems.findIndex(
        (item) => item.id == id
      );

      if (currentProblemIndex > -1) {
        updatedProblems.splice(currentProblemIndex, 1);

        return { ...state, problems: [...updatedProblems] };
      }

      return state;
    },
    markAs20Percent(state, action) {
      const id = converToNumber(action.payload);

      const updatedProblems = [...state.problems];

      const currentProblemIndex = updatedProblems.findIndex(
        (item) => item.id == id
      );

      if (currentProblemIndex > -1) {
        updatedProblems[currentProblemIndex].twentyPercent = true;

        return { ...state, problems: [...updatedProblems] };
      }

      return state;
    },
    markAsNormal(state, action) {
      const id = converToNumber(action.payload);

      const updatedProblems = [...state.problems];

      const currentProblemIndex = updatedProblems.findIndex(
        (item) => item.id == id
      );

      if (currentProblemIndex > -1) {
        updatedProblems[currentProblemIndex].twentyPercent = false;

        return { ...state, problems: [...updatedProblems] };
      }

      return state;
    },

    toggleCompleted(state, action) {
      const id = converToNumber(action.payload);

      const updatedProblems = [...state.problems];

      const currentProblemIndex = updatedProblems.findIndex(
        (item) => item.id == id
      );

      if (currentProblemIndex > -1) {
        updatedProblems[currentProblemIndex].completed =
          !updatedProblems[currentProblemIndex].completed;

        return { ...state, problems: [...updatedProblems] };
      }

      return state;
    },

    moveProblem(state, action) {
      const id = action.payload.id;
      const index = action.payload.index;
      const lifeAreaId = action.payload.lifeAreaId;
      const actualIndex = index + 1;

      console.log("Id: " + id);
      console.log("Index: " + index);
      console.log("Life Area Id: " + lifeAreaId);

      const nonUpdatedProblems = [
        ...state.problems.filter(
          (problem) => problem.lifeAreaId !== lifeAreaId
        ),
      ];

      const updatedProblems = [
        ...state.problems.filter(
          (problem) => problem.lifeAreaId === lifeAreaId
        ),
      ];

      const draggedProblem = updatedProblems.find(
        (problem) => problem.id === id
      );

      if (actualIndex === draggedProblem!.index) {
        return state;
      }

      if (actualIndex < draggedProblem!.index) {
        updatedProblems
          .filter(
            (problem) =>
              problem.index <= actualIndex && problem.index >= actualIndex
          )
          .forEach((problem) => {
            problem.index++;
          });
      } else {
        updatedProblems
          .filter(
            (problem) =>
              problem.index >= actualIndex && problem.index <= actualIndex
          )
          .forEach((problem) => {
            problem.index--;
          });
      }

      draggedProblem!.index = actualIndex;

      return {
        ...state,
        problems: [...nonUpdatedProblems, ...updatedProblems],
      };
    },
    updatePlan(state, action) {
      const id = action.payload.id;
      const plan = action.payload.plan;

      const problem = state.problems.find((problem) => problem.id == id);
      problem!.plan = plan;

      return { ...state, problems: [...state.problems] };
    },
  },
});

export const problemActions = problemSlice.actions;

export default problemSlice.reducer;
