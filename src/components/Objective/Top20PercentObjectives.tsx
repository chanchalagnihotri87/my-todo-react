import { useQuery } from "@tanstack/react-query";
import Objective from "../../models/Objective";
import { PathItem } from "../../models/PathItem";
import ObjectiveService from "../../services/objective.service";
import TwentyPercentItems from "../TwentyPercentItems";

const Top20PercentObjectives: React.FC<{ goalId: number }> = ({ goalId }) => {
  const { data: twentyPercentObjectives } = useQuery<Objective[]>({
    queryKey: ["objectives", goalId.toString(), "twentypercent"],
    queryFn: () => ObjectiveService.getTwentyPercentObjectives(goalId),
  });

  return (
    twentyPercentObjectives && (
      <TwentyPercentItems
        items={twentyPercentObjectives.map(
          (objective) =>
            new PathItem(objective.text, `/objective/${objective.id}`)
        )}
      />
    )
  );
};

export default Top20PercentObjectives;
