import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { TRPCProvider } from "./utils/api";

function App() {
  return (
    <TRPCProvider>
      <RouterProvider router={router} />
    </TRPCProvider>
  );
}

export default App;
