import { useQuery } from "@tanstack/react-query";
import Sprint from "../../models/Sprint";
import SprintService from "../../services/sprint.service";
import SprintListItem from "./SprintListItem";

const SprintList: React.FC<{
  onEdit: (sprint: Sprint) => void;
}> = ({ onEdit }) => {
  const { data: sprints } = useQuery<Sprint[]>({
    queryKey: ["sprints"],
    queryFn: () => SprintService.getSprints(),
  });

  return (
    sprints && (
      <ul className="list-group">
        {sprints.map((sprint) => {
          return (
            <SprintListItem key={sprint.id} sprint={sprint} onEdit={onEdit} />
          );
        })}
      </ul>
    )
  );
};

export default SprintList;
