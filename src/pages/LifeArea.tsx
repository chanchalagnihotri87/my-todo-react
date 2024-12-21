import React from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../store";

import { converToNumber } from "../utils";

import { useMutation, useQuery } from "@tanstack/react-query";
import Breadcrumb from "../components/Breadcrumb";
import PageHeader from "../components/PageHeader";
import ProblemTab from "../components/Problems/ProblemTab";
import Top20PercentProblems from "../components/Problems/Top20PercentProblems";
import LifeArea from "../models/LifeArea";
import { PathItem } from "../models/PathItem";
import LifeAreaService from "../services/lifearea.service";

const LifeAreaPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const id = converToNumber(useParams().id);

  // const lifeArea = useAppSelector((state) => state.lifearea.lifeAreas).find(
  //   (area) => area.id == id
  // );

  const { data: lifeArea } = useQuery<LifeArea>({
    queryKey: ["lifearea", id.toString()],
    queryFn: () => LifeAreaService.getLifeAreaById(id),
  });

  //#region HandleVisionChange
  const { mutate: updateVision } = useMutation<
    boolean,
    unknown,
    { id: number; vision: string }
  >({
    mutationFn: async (data) =>
      await LifeAreaService.updateVision(data.id, data.vision),
  });

  const handleVisionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    updateVision({ id: id, vision: event.target.value });
  };

  //#endregion

  //#region HandlePlanChange
  const { mutate: updatePlan } = useMutation<
    boolean,
    unknown,
    { id: number; plan: string }
  >({
    mutationFn: async (data) =>
      await LifeAreaService.updatePlan(data.id, data.plan),
  });

  const handlePlanChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    updatePlan({ id: id, plan: event.target.value });
  };

  //#endregion

  return (
    <>
      <div className="container pt-3">
        {/* Breadcrum */}
        <Breadcrumb
          items={[new PathItem("Life Areas", "/"), new PathItem("Detail", "")]}
        />

        {/* Title */}
        <PageHeader text={lifeArea?.name} />

        {/* Top 20% Problems */}
        <div className="row">
          <div className="col">
            <Top20PercentProblems lifeAreaId={id} />
          </div>
        </div>

        {/* Tabs */}
        <div className="row mt-4">
          <div className="col">
            {/* Tab Links */}
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <button
                  className="nav-link"
                  id="vision-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#vision"
                  type="button"
                  role="tab"
                  aria-controls="home"
                  aria-selected="true">
                  Vision
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link"
                  id="vision-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#plan"
                  type="button"
                  role="tab"
                  aria-controls="home"
                  aria-selected="true">
                  Plan
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link active"
                  id="vision-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#problems"
                  type="button"
                  role="tab"
                  aria-controls="home"
                  aria-selected="true">
                  Problems
                </button>
              </li>
            </ul>

            {/* <!-- Tab panes --> */}
            <div className="tab-content border p-3">
              {/* Vision Tab pane */}
              <div
                className="tab-pane"
                id="vision"
                role="tabpanel"
                aria-labelledby="home-tab"
                tabIndex={0}>
                <textarea
                  name=""
                  id=""
                  rows={5}
                  cols={30}
                  className="form-control"
                  defaultValue={lifeArea?.vision}
                  onBlur={handleVisionChange}></textarea>
              </div>

              {/* Plan Tab pane */}
              <div
                className="tab-pane"
                id="plan"
                role="tabpanel"
                aria-labelledby="profile-tab"
                tabIndex={0}>
                <textarea
                  name=""
                  id=""
                  rows={5}
                  cols={30}
                  className="form-control"
                  defaultValue={lifeArea?.plan}
                  onBlur={handlePlanChange}></textarea>
              </div>

              {/* Problems tab pane */}
              <div
                className="tab-pane active"
                id="problems"
                role="tabpanel"
                aria-labelledby="messages-tab"
                tabIndex={0}>
                <ProblemTab lifeAreaId={id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LifeAreaPage;
