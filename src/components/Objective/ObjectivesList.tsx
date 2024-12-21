import { useQuery } from "@tanstack/react-query";
import Objective from "../../models/Objective";
import ObjectiveService from "../../services/objective.service";
import ObjectiveListItem from "./ObjectiveListItem";

const ObjectivesList: React.FC<{
  goalId: number;
  onEdit: (objective: Objective) => void;
}> = ({ goalId, onEdit }) => {
  const { data: objectives } = useQuery<Objective[]>({
    queryKey: ["objectives", goalId.toString()],
    queryFn: () => ObjectiveService.getObjectives(goalId),
  });

  return (
    <ul className="list-group">
      {objectives &&
        objectives.map((objective, index) => (
          <ObjectiveListItem
            key={objective.id}
            objective={objective}
            index={index}
            onEdit={onEdit}
          />
        ))}
    </ul>
  );
};

export default ObjectivesList;
