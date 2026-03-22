import { Component } from '@angular/core';
import { AddTransportOperator } from "../add-transport-operator/add-transport-operator";
import { AddStop } from "../../stops/add-stop/add-stop";
import { AddRoute } from "../../routes/add-route/add-route";
import { EditRoute } from "../edit-route/edit-route";
import { AddSubscription } from "../add-subscription/add-subscription";
import { Verifications } from "../verifications/verifications";
import { AddNews } from "../add-news/add-news";

@Component({
  selector: 'app-admin-panel',
  imports: [AddTransportOperator, AddStop, AddRoute, EditRoute, AddSubscription, Verifications, AddNews],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel {
  
}
