import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
// import { TRPCProvider } from "./utils/api";
import "./index.css";

function App() {
  return <RouterProvider router={router} />;
  // return (
  //   <TRPCProvider>
  //       <RouterProvider router={router} />
  //   </TRPCProvider>
  // );
}

export default App;
