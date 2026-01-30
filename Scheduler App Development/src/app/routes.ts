import { createBrowserRouter } from "react-router";
import { Login } from "@/app/components/login";
import { Home } from "@/app/components/home";
import { Profile } from "@/app/components/profile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/home",
    Component: Home,
  },
  {
    path: "/profile",
    Component: Profile,
  },
]);
