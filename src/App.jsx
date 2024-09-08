import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import ErrorPage from "./pages/Error.jsx";
import Landing from "./pages/Landing.jsx";
import Fields from "./pages/Fields.jsx";
import Devices from "./pages/Devices.jsx";
import Data from "./pages/Data.jsx";

const routes = [
  { path: "/", element: <Landing /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/fields", element: <Fields /> },
  { path: "/devices", element: <Devices /> },
  { path: "/data", element: <Data /> },
  { path: "*", element: <ErrorPage /> },
];

const router = createBrowserRouter(routes);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
