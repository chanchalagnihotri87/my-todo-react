import { useQuery } from "@tanstack/react-query";
import { PathItem } from "../../models/PathItem";
import Problem from "../../models/Problem";
import ProblemService from "../../services/problems.service";
import TwentyPercentItems from "../TwentyPercentItems";

const Top20PercentProblems: React.FC<{ lifeAreaId: number }> = ({
  lifeAreaId,
}) => {
  const { data: twentyPercentProblems } = useQuery<Problem[]>({
    queryKey: ["lifeareas", lifeAreaId.toString(), "twentypercent"],
    queryFn: () => ProblemService.getTwentyPercentProblems(lifeAreaId),
  });
  // const twentyPercentProblems = useAppSelector((state) =>
  //   state.problem.problems
  //     .filter((prob) => prob.lifeAreaId === lifeAreaId && prob.twentyPercent)
  //     .sort((a: Problem, b: Problem) => a.index - b.index)
  // );

  //  = problems.filter(
  //     (problem) => problem.twentyPercent
  //   );

  return (
    <TwentyPercentItems
      items={(twentyPercentProblems ?? []).map(
        (problem) => new PathItem(problem.text, `/problem/${problem.id}`)
      )}
    />
  );
};

export default Top20PercentProblems;
