import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class ChatService {
  private apiHost = "https://fspt9ptm-3000.asse.devtunnels.ms";

  constructor(private http: HttpClient) {}

  getProviderChatList(platform: string): Observable<any> {
    const url = this.apiHost + `/chats/${platform}/list`;
    return this.http.get(url);
  }

  getProviderChatHistory(platform: string, postData: Object): Observable<any> {
    const url = this.apiHost + `/chats/${platform}/history`;
    return this.http.post(url, postData);
  }
}
