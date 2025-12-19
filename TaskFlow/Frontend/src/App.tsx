// App.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import ToastProvider from "./utils/toast/ToastProvider";
const App: React.FC = () => {
  return (
    <>
      <ToastProvider />
      <Outlet />
    </>
  );
};

export default App;
