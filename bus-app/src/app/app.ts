import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapComponent } from "./shared/components/map/map";
import { AddStop } from "./features/stops/add-stop/add-stop";
import { AddRoute } from "./features/routes/add-route/add-route";
import { AddTransportOperator } from './features/add-transport-operator/add-transport-operator';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AddStop, AddRoute, AddTransportOperator],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'bus-app';
}
