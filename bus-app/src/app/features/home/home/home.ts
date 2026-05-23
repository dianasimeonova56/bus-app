import { Component } from '@angular/core';
import { Hero } from "../../hero/hero";
import { RoutesTabs } from "../../routes/routes-tabs/routes-tabs";
import { NewsSection } from "../../news/news-section/news-section";

@Component({
  selector: 'app-home',
  imports: [Hero, RoutesTabs, NewsSection],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
