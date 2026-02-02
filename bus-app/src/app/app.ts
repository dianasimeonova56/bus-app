import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AddStop } from "./features/stops/add-stop/add-stop";
import { AddRoute } from "./features/routes/add-route/add-route";
import { AddTransportOperator } from './features/add-transport-operator/add-transport-operator';
import { RouteData } from './features/routes/route-data/route-data';
import { Footer, Header } from './shared/components';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Hero } from './features/hero/hero';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AddStop, AddRoute, AddTransportOperator, RouteData, Header, Footer, Hero],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'bus-app';
}
