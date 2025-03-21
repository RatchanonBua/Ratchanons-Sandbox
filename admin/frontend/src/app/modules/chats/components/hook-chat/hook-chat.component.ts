import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, ActivatedRoute } from "@angular/router";

import { ChatType } from "@/modules/chats/enums/chat-type.enum";
import { ChatService } from "@/modules/chats/services/chat.service";

@Component({
  selector: "hook-chat",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "hook-chat.component.html",
  styleUrls: ["hook-chat.component.scss"],
})
export class HookChatComponent {
  private chatType: ChatType = ChatType.Provider;
  private platform: string = "";
  private chatService = inject(ChatService);
  public chatList: any[] = [];

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.platform = params["platform"];
      this.loadChatList();
      this.loadChatHistory();
    });
  }

  public loadChatList(): undefined {
    this.chatService.getProviderChatList(this.platform).subscribe({
      next: (result) => {
        this.chatList = result;
        console.log("Provider Chats Success:", this.getChatTypeAndPlatform());
        console.log(this.chatList);
      },
      error: (error) => {
        console.error("Provider Chats Error:", error);
      },
    });
  }

  public loadChatHistory(): undefined {
    const tempData = { id: "67d2a6b4d64be2eb209f8bf3" };
    this.chatService.getProviderChatHistory(this.platform, tempData).subscribe({
      next: (result) => {
        console.log(result);
      }, error: (error) => {
        console.error("Retrieve Chat History Error:", error);
      },
    });
  }

  public getChatTypeAndPlatform(): string {
    if (this.platform === "line") {
      return "LINE Chat";
    } else if (this.platform === "facebook") {
      return "Facebook Chat";
    }
    return "Provider Chat";
  }
}
