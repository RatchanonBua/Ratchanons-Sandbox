import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

@Injectable({ providedIn: "root" })
export class WebhookChatService {
  getData(): Observable<string> {
    return of("Webhook Chat Data");
  }
}
