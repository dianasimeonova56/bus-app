import { Component } from '@angular/core';
import { AddTransportOperator } from "../add-transport-operator/add-transport-operator";
import { AddStop } from "../../stops/add-stop/add-stop";
import { AddRoute } from "../../routes/add-route/add-route";

@Component({
  selector: 'app-admin-panel',
  imports: [AddTransportOperator, AddStop, AddRoute],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel {

}
