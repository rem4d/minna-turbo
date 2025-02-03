import { RouterProvider } from "react-router-dom";

import { router } from "./routes";
import { TRPCProvider } from "./utils/api";

import "./index.css";

import { useEffect } from "react";
import { viewport } from "@telegram-apps/sdk-react";

function App() {
  useEffect(() => {
    const d = viewport.safeAreaInsets();
    console.log(d);
  }, []);

  return (
    <TRPCProvider>
      <RouterProvider router={router} />
    </TRPCProvider>
  );
}

export default App;
