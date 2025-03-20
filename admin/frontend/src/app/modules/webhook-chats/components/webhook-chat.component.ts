import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-chats",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "webhook-chats.component.html",
  styleUrls: ["webhook-chats.component.scss"],
})
export class WebhookChatComponent {}
