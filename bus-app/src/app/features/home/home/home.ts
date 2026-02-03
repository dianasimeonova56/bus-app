import { Component } from '@angular/core';
import { Hero } from "../../hero/hero";
import { RouteData } from "../../routes/route-data/route-data";

@Component({
  selector: 'app-home',
  imports: [Hero, RouteData],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
