import { createSlice } from "@reduxjs/toolkit";
import TodoItem from "../models/TodoItem";
import { converToNumber } from "../utils";

const initialState = {
  items: [
    new TodoItem(1, "Remind before random topic for 7 days", 1, true, true),
    new TodoItem(
      2,
      "Remind before dictionary practice for 7 days",
      1,
      true,
      true
    ),
    new TodoItem(3, "Remind before FS set for 7 days", 1, true, true, 2),
    new TodoItem(
      4,
      "Aware for real life conversation without reminder for 7 days",
      1,
      false,
      false,
      2
    ),
  ],
};

const todoSlice = createSlice({
  name: "todo",
  initialState: initialState,
  reducers: {
    addItem(state, action) {
      let updatedItems = [...state.items];

      const id = Math.max(...updatedItems.map((task) => task.id)) + 1;
      updatedItems.push(new TodoItem(id, action.payload.text, 1));

      return { ...state, items: [...updatedItems] };
    },
    updateItem(state, action) {
      const id = converToNumber(action.payload.id);
      const text = action.payload.text;

      const updatedItems = [...state.items];

      const currentItemIndex = updatedItems.findIndex((item) => item.id == id);

      if (currentItemIndex > -1) {
        updatedItems[currentItemIndex].text = text;

        return { ...state, items: [...updatedItems] };
      }
    },
    deleteItem(state, action) {
      const id = converToNumber(action.payload);

      const updatedItems = [...state.items];

      const currentItemIndex = updatedItems.findIndex((item) => item.id == id);

      if (currentItemIndex > -1) {
        updatedItems.splice(currentItemIndex, 1);

        return { ...state, items: [...updatedItems] };
      }

      return state;
    },
    markAs20Percent(state, action) {
      const id = converToNumber(action.payload);

      const updatedItems = [...state.items];

      const currentItemIndex = updatedItems.findIndex((item) => item.id == id);

      if (currentItemIndex > -1) {
        updatedItems[currentItemIndex].twentyPercent = true;

        return { ...state, items: [...updatedItems] };
      }

      return state;
    },
    markAsNormal(state, action) {
      const id = converToNumber(action.payload);

      const updatedItems = [...state.items];

      const currentItemIndex = updatedItems.findIndex((item) => item.id == id);

      if (currentItemIndex > -1) {
        updatedItems[currentItemIndex].twentyPercent = false;

        return { ...state, items: [...updatedItems] };
      }

      return state;
    },

    toggleCompleted(state, action) {
      const id = converToNumber(action.payload);

      const updatedItems = [...state.items];

      const currentItemIndex = updatedItems.findIndex((item) => item.id == id);

      if (currentItemIndex > -1) {
        updatedItems[currentItemIndex].completed =
          !updatedItems[currentItemIndex].completed;

        return { ...state, items: [...updatedItems] };
      }

      return state;
    },

    moveItem(state, action) {
      const id = action.payload.id;
      const index = action.payload.index;
      const taskId = action.payload.taskId;
      const actualIndex = index + 1;

      console.log("Id: " + id);
      console.log("Index: " + index);
      console.log("Task Id: " + taskId);

      const nonUpdatedItems = [
        ...state.items.filter((task) => task.taskId !== taskId),
      ];

      const updatedItems = [
        ...state.items.filter((task) => task.taskId === taskId),
      ];

      const draggedItem = updatedItems.find((task) => task.id === id);

      if (actualIndex === draggedItem!.index) {
        return state;
      }

      if (actualIndex < draggedItem!.index) {
        updatedItems
          .filter(
            (task) =>
              task.index <= draggedItem!.index && task.index >= actualIndex
          )
          .forEach((task) => {
            task.index++;
          });
      } else {
        updatedItems
          .filter(
            (task) =>
              task.index >= draggedItem!.index && task.index <= actualIndex
          )
          .forEach((task) => {
            task.index--;
          });
      }

      draggedItem!.index = actualIndex;

      return {
        ...state,
        items: [...nonUpdatedItems, ...updatedItems],
      };
    },
    assignSprint(state, action) {
      const id = converToNumber(action.payload.id);
      const sprintId = converToNumber(action.payload.sprintId);

      const updatedItems = [...state.items];

      const currentItemIndex = updatedItems.findIndex((item) => item.id == id);

      if (currentItemIndex > -1) {
        updatedItems[currentItemIndex].sprintId = sprintId;
        updatedItems[currentItemIndex].date = undefined;

        return { ...state, items: [...updatedItems] };
      }

      return state;
    },

    assignDate(state, action) {
      const id = converToNumber(action.payload.id);
      const date = action.payload.date
        ? new Date(action.payload.date)
        : undefined;

      const updatedItems = [...state.items];

      const currentItemIndex = updatedItems.findIndex((item) => item.id == id);

      if (currentItemIndex > -1) {
        updatedItems[currentItemIndex].date = date;

        return { ...state, items: [...updatedItems] };
      }

      return state;
    },
  },
});

export const todoActions = todoSlice.actions;

export default todoSlice.reducer;
