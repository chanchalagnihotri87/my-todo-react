import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "../node_modules/bootstrap/dist/js/bootstrap";
import "./scss/style.scss";
// import  * as bootstrap from 'bootstrap';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardPage from "./pages/Dashboard.tsx";
import GoalPage from "./pages/Goal.tsx";
import LifeAreaPage from "./pages/LifeArea.tsx";
import ObjectivePage from "./pages/Objective.tsx";
import ProblemPage from "./pages/Problem.tsx";
import RootPage from "./pages/Root.tsx";
import SprintDetailPage from "./pages/SprintDetail.tsx";
import SprintsPage from "./pages/Sprints.tsx";
import TaskPage from "./pages/Task.tsx";
import store from "./store/index.ts";
import {queryClient} from './utils/http.ts';

const router = createBrowserRouter([
  {
    path: "",
    element: <RootPage />,
    children: [
      {
        path: "/",
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "lifearea/:id",
        element: <LifeAreaPage />,
      },
      {
        path: "problem/:id",
        element: <ProblemPage />,
      },
      {
        path: "goal/:id",
        element: <GoalPage />,
      },
      {
        path: "objective/:id",
        element: <ObjectivePage />,
      },
      {
        path: "task/:id",
        element: <TaskPage />,
      },

      {
        path: "/sprints",
        element: <SprintsPage />,
      },
      { path: "/sprint/:id", element: <SprintDetailPage /> },
    ],
  },
]);



createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <RouterProvider router={router} />
        </DndProvider>
      </Provider>
    </QueryClientProvider>
  </StrictMode>
);
