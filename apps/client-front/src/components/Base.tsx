import { Outlet } from "react-router-dom";
import { FooterMenu } from "./FooterMenu";

export function Base() {
  return (
    <div className="relative h-screen min-h-[568px] bg-lightGray mx-auto overflow-hidden min-w-[320px] max-w-[450px]">
      <Outlet />
      <FooterMenu />
    </div>
  );
}
