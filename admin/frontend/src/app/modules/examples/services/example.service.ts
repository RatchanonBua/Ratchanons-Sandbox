import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

@Injectable({ providedIn: "root" })
export class ExampleService {
  getData(): Observable<string> {
    return of("Example Data");
  }
}
