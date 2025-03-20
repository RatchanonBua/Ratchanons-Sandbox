import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

@Injectable({ providedIn: "root" })
export class ChatService {
  getData(): Observable<string> {
    return of("Chat Data");
  }
}
