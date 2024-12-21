import React from "react";
import { Link } from "react-router-dom";
import { PathItem } from "../models/PathItem";

const TwentyPercentItems: React.FC<{ items: PathItem[] }> = ({ items }) => {
  return (
    <div className="row">
      <div className="col">
        {items.map((item) => {
          if (!item.path) {
            return (
              <button
                key={item.text}
                className="btn btn-outline-success btn-sm me-1"
                type="button">
                {item.text}
              </button>
            );
          }

          return (
            <Link
              to={item.path}
              key={item.text}
              className="btn btn-outline-success btn-sm me-1">
              {item.text}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TwentyPercentItems;
