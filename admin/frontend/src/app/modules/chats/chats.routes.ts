import { Routes } from "@angular/router";
import { HookChatComponent } from "./components/hook-chat/hook-chat.component";

const routes: Routes = [
  { path: "providers/:platform", component: HookChatComponent },
  { path: "**", redirectTo: "providers/line", pathMatch: "full" },
];

export { routes };
