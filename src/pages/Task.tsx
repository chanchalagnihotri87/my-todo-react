import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import TodoTab from "../components/Todo/TodoTab";
import Top20PercentTodos from "../components/Todo/Top20PercentTodos";
import Goal from "../models/Goal";
import Objective from "../models/Objective";
import Problem from "../models/Problem";
import Task from "../models/Task";
import GoalService from "../services/goals.service";
import ObjectiveService from "../services/objective.service";
import ProblemService from "../services/problems.service";
import TaskService from "../services/task.service";
import { converToNumber } from "../utils";

const TaskPage: React.FC = () => {
  const id = converToNumber(useParams().id);

  const { data: task } = useQuery<Task>({
    queryKey: ["task", id.toString()],
    queryFn: () => TaskService.getTaskById(id),
  });

  const { data: objective } = useQuery<Objective>({
    queryKey: ["objective", id.toString()],
    queryFn: () => ObjectiveService.getObjectiveById(task!.objectiveId),
    enabled: task && task.id > 0,
  });

  const { data: goal } = useQuery<Goal>({
    queryKey: ["goal", id.toString()],
    queryFn: () => GoalService.getGoalById(objective!.goalId),
    enabled: objective && objective.id > 0,
  });

  const { data: problem } = useQuery<Problem>({
    queryKey: ["problem", id.toString()],
    queryFn: () => ProblemService.getProblemById(goal!.problemId),
    enabled: goal && goal.id > 0,
  });

  return (
    <>
      <div className="container pt-3">
        {/* Breadcrum */}
        <Breadcrumb
          items={[
            { path: "/", text: "Life Areas" },
            { path: `/lifearea/${problem?.lifeAreaId}`, text: "Problems" },
            { path: `/problem/${goal?.problemId}`, text: "Goals" },
            { path: `/goal/${objective?.goalId}`, text: "Objectives" },
            { path: `/objective/${task?.objectiveId}`, text: "Tasks" },
            { path: "", text: "Detail" },
          ]}
        />

        {/* Title */}
        <div className="row">
          <div className="col">
            <h4>{task?.text}</h4>
          </div>
        </div>

        {/* Top 20% Problems */}
        <div className="row">
          <div className="col">
            <Top20PercentTodos taskId={id} />
          </div>
        </div>

        <TodoTab taskId={id} />
      </div>
    </>
  );
};

export default TaskPage;
