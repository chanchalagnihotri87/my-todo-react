import { createSlice } from "@reduxjs/toolkit";
import Sprint from "../models/Sprint";
import { converToNumber } from "../utils";

const initialState = {
  sprints: [
    new Sprint(1, "Sprint 101", new Date(2024, 8, 16), new Date(2024, 8, 20)),
    new Sprint(
      2,
      "Sprint 102",
      new Date(2024, 8, 23),
      new Date(2024, 8, 27),
      false
    ),
    new Sprint(3, "Sprint 103", new Date(2024, 8, 30), new Date(2024, 9, 4)),
  ],
};

const sprintSlice = createSlice({
  name: "sprint",
  initialState: initialState,
  reducers: {
    addSprint(state, action) {
      let updatedSprints = [...state.sprints];

      const id = Math.max(...updatedSprints.map((sprint) => sprint.id)) + 1;
      updatedSprints.push(
        new Sprint(
          id,
          action.payload.text,
          action.payload.startDate,
          action.payload.endDate
        )
      );

      return { ...state, sprints: [...updatedSprints] };
    },
    updateSprint(state, action) {
      const id = converToNumber(action.payload.id);
      const text = action.payload.text;
      const startDate = action.payload.startDate;
      const endDate = action.payload.endDate;

      const updatedSprints = [...state.sprints];

      const currentSprintIndex = updatedSprints.findIndex(
        (item) => item.id == id
      );

      if (currentSprintIndex > -1) {
        updatedSprints[currentSprintIndex].text = text;
        updatedSprints[currentSprintIndex].startDate = startDate;
        updatedSprints[currentSprintIndex].endDate = endDate;

        return { ...state, sprints: [...updatedSprints] };
      }

      return state;
    },
    deleteSprint(state, action) {
      const id = converToNumber(action.payload);

      const updatedSprints = [...state.sprints];

      const currentSprintIndex = updatedSprints.findIndex(
        (item) => item.id == id
      );

      if (currentSprintIndex > -1) {
        updatedSprints.splice(currentSprintIndex, 1);

        return { ...state, sprints: [...updatedSprints] };
      }

      return state;
    },

    toggleCompleted(state, action) {
      const id = converToNumber(action.payload);

      const updatedSprints = [...state.sprints];

      const currentSprintIndex = updatedSprints.findIndex(
        (item) => item.id == id
      );

      if (currentSprintIndex > -1) {
        updatedSprints[currentSprintIndex].completed =
          !updatedSprints[currentSprintIndex].completed;

        return { ...state, sprints: [...updatedSprints] };
      }

      return state;
    },

    addTodoItem(state, action) {
      const id = action.payload.id;
      const todoItemId = action.payload.todoItemId;

      const sprint = state.sprints.find((sprint) => sprint.id == id);

      if (!sprint?.todoItemIds.includes(todoItemId)) {
        sprint?.todoItemIds.push(todoItemId);
      }
      return { ...state, sprints: [...state.sprints] };
    },
  },
});

export const sprintActions = sprintSlice.actions;

export default sprintSlice.reducer;
