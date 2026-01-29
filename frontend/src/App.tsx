import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
 <ToastContainer
        position="top-right"
        autoClose={3000}
        aria-label="Notifications"
      />
  return <AppRoutes />;
};

export default App;
