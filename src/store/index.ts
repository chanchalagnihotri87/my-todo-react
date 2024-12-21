import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import Goal from "./Goal";
import LifeArea from "./LifeArea";
import Objective from "./Objective";
import Problem from "./Problem";
import Sprint from "./Sprint";
import Task from "./Task";
import Todo from "./Todo";

const store = configureStore({
  reducer: {
    lifearea: LifeArea,
    problem: Problem,
    goal: Goal,
    objective: Objective,
    task: Task,
    todo: Todo,
    sprint: Sprint,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

type RootState = ReturnType<typeof store.getState>;

type AppDispatch = typeof store.dispatch;

export type AppStore = typeof store;

export const useAppSelector = useSelector.withTypes<RootState>();

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export default store;
