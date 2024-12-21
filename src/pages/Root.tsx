import { Outlet } from "react-router-dom";
import Header from "../components/Header";

function RootPage() {
  return (
    <>
      <Header />
      <main>
        <div className="container">
          <Outlet />
        </div>
      </main>
    </>
  );
}

export default RootPage;
