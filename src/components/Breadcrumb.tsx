import { Link } from "react-router-dom";
import { PathItem } from "../models/PathItem";

const Breadcrumb: React.FC<{ items: PathItem[] }> = ({ items }) => {
  return (
    <div className="row">
      <div className="col">
        <div className="row">
          <div className="col">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                {items.map((item) =>
                  item.path.length ? (
                    <li key={item.text} className="breadcrumb-item">
                      <Link to={item.path}>{item.text}</Link>
                    </li>
                  ) : (
                    <li
                      key={item.text}
                      className="breadcrumb-item active"
                      aria-current="page">
                      {item.text}
                    </li>
                  )
                )}
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
