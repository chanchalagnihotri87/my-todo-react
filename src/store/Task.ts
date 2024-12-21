import { createSlice } from "@reduxjs/toolkit";
import Task from "../models/Task";
import { converToNumber } from "../utils";

const initialState = {
  tasks: [
    new Task(
      1,
      "Remind yourself to think as real life conversation before start video",
      1,
      true,
      true
    ),
    new Task(2, "Look at bar above mobile screen", 1, true, true),
    new Task(
      3,
      "Make runtime content, just keep the content clarity points",
      1,
      true,
      true
    ),
    new Task(4, "Normal face expression", 1),
  ],
};

const taskSlice = createSlice({
  name: "task",
  initialState: initialState,
  reducers: {
    addTask(state, action) {
      let updatedTasks = [...state.tasks];

      const id = Math.max(...updatedTasks.map((task) => task.id)) + 1;
      updatedTasks.push(new Task(id, action.payload.text, 1));

      return { ...state, tasks: [...updatedTasks] };
    },
    updateTask(state, action) {
      const id = converToNumber(action.payload.id);
      const text = action.payload.text;

      const updatedTasks = [...state.tasks];

      const currentTaskIndex = updatedTasks.findIndex((item) => item.id == id);

      if (currentTaskIndex > -1) {
        updatedTasks[currentTaskIndex].text = text;

        return { ...state, tasks: [...updatedTasks] };
      }
    },
    deleteTask(state, action) {
      const id = converToNumber(action.payload);

      const updatedTasks = [...state.tasks];

      const currentTaskndex = updatedTasks.findIndex((item) => item.id == id);

      if (currentTaskndex > -1) {
        updatedTasks.splice(currentTaskndex, 1);

        return { ...state, tasks: [...updatedTasks] };
      }

      return state;
    },
    markAs20Percent(state, action) {
      const id = converToNumber(action.payload);

      const updatedTasks = [...state.tasks];

      const currentTaskIndex = updatedTasks.findIndex((item) => item.id == id);

      if (currentTaskIndex > -1) {
        updatedTasks[currentTaskIndex].twentyPercent = true;

        return { ...state, tasks: [...updatedTasks] };
      }

      return state;
    },
    markAsNormal(state, action) {
      const id = converToNumber(action.payload);

      const updatedTasks = [...state.tasks];

      const currentTaskIndex = updatedTasks.findIndex((item) => item.id == id);

      if (currentTaskIndex > -1) {
        updatedTasks[currentTaskIndex].twentyPercent = false;

        return { ...state, tasks: [...updatedTasks] };
      }

      return state;
    },

    toggleCompleted(state, action) {
      const id = converToNumber(action.payload);

      const updatedTasks = [...state.tasks];

      const currentTaskIndex = updatedTasks.findIndex((item) => item.id == id);

      if (currentTaskIndex > -1) {
        updatedTasks[currentTaskIndex].completed =
          !updatedTasks[currentTaskIndex].completed;

        return { ...state, tasks: [...updatedTasks] };
      }

      return state;
    },

    moveTask(state, action) {
      const id = action.payload.id;
      const index = action.payload.index;
      const objectiveId = action.payload.objectiveId;
      const actualIndex = index + 1;

      console.log("Id: " + id);
      console.log("Index: " + index);
      console.log("Problem Id: " + objectiveId);

      const nonUpdatedTasks = [
        ...state.tasks.filter((task) => task.objectiveId !== objectiveId),
      ];

      const updatedTasks = [
        ...state.tasks.filter((task) => task.objectiveId === objectiveId),
      ];

      const draggedTask = updatedTasks.find((task) => task.id === id);

      if (actualIndex === draggedTask!.index) {
        return state;
      }

      if (actualIndex < draggedTask!.index) {
        updatedTasks
          .filter(
            (task) =>
              task.index <= draggedTask!.index && task.index >= actualIndex
          )
          .forEach((task) => {
            task.index++;
          });
      } else {
        updatedTasks
          .filter(
            (task) =>
              task.index >= draggedTask!.index && task.index <= actualIndex
          )
          .forEach((task) => {
            task.index--;
          });
      }

      draggedTask!.index = actualIndex;

      return {
        ...state,
        tasks: [...nonUpdatedTasks, ...updatedTasks],
      };
    },
  },
});

export const taskActions = taskSlice.actions;

export default taskSlice.reducer;
