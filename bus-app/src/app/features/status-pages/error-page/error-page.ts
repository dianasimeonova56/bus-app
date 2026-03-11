import { Component } from '@angular/core';
import { RouterLinkActive, RouterLink } from "@angular/router";

@Component({
  selector: 'app-error-page',
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './error-page.html',
  styleUrl: './error-page.css',
})
export class ErrorPage {

}
