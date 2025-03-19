import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-examples",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "example.component.html",
  styleUrls: ["example.component.scss"],
})
export class ExampleComponent {
  title = "frontend";
}
