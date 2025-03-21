import { Routes } from "@angular/router";
import { routes as chatRoutes } from "@/modules/chats/chats.routes";

export const routes: Routes = [
  { path: "chats", children: chatRoutes },
  { path: "**", redirectTo: "", pathMatch: "full" },
];
