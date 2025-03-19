import { Routes } from "@angular/router";
import { routes as examplesRoutes } from "@/modules/examples/examples.routes";

export const routes: Routes = [
  { path: "examples", children: examplesRoutes },
  { path: "**", redirectTo: "", pathMatch: "full" },
];
