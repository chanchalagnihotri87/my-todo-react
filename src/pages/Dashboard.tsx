import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LifeArea from "../models/LifeArea";

const DashboardPage: React.FC = () => {
  // const lifeAreas = useAppSelector((state) => state.lifearea.lifeAreas);

  const [lifeAreas, setLifeAreas] = useState<LifeArea[]>([]);

  useEffect(() => {
    async function fetchPlaces() {
      const response = await fetch(
        "https://localhost:5057/lifearea-service/lifeareas"
      );

      const resData = await response.json();

      setLifeAreas(resData.lifeAreas);
    }

    fetchPlaces();
  }, []);

  return (
    <>
      <div className="row mt-4 g-4 life-area-box-container">
        {lifeAreas.map((lifearea) => (
          <div key={lifearea.id} className="col-4">
            <Link to={`lifearea/${lifearea.id}`}>
              <div className="border life-area-box">
                <h5>{lifearea.name}</h5>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default DashboardPage;
