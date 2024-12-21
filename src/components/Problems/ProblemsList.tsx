import { useQuery } from "@tanstack/react-query";
import Problem from "../../models/Problem";
import ProblemService from "../../services/problems.service";
import ProblemListItem from "./ProblemListItem";

const ProblemsList: React.FC<{
  lifeAreaId: number;
  onEdit: (id: number) => void;
}> = ({ lifeAreaId, onEdit }) => {
  const { data: problems } = useQuery<Problem[]>({
    queryKey: ["lifeareas", lifeAreaId.toString()],
    queryFn: () => ProblemService.getProblems(lifeAreaId),
  });

  return (
    <ul className="list-group">
      {problems?.map((problem, index) => (
        <ProblemListItem
          key={problem.id}
          problem={problem}
          index={index}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
};

export default ProblemsList;
