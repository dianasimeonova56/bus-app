import { Component } from '@angular/core';
import { Hero } from "../../hero/hero";
import { RoutesTabs } from "../../routes/routes-tabs/routes-tabs";

@Component({
  selector: 'app-home',
  imports: [Hero, RoutesTabs],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
