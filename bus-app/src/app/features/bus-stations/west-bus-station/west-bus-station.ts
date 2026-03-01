import { Component } from '@angular/core';
import {Tab, Tabs, TabList, TabPanel, TabContent} from '@angular/aria/tabs';
import { RouteData } from "../../routes/route-data/route-data";

@Component({
  selector: 'app-west-bus-station',
  imports: [RouteData, TabList, Tab, Tabs, TabPanel, TabContent],
  templateUrl: './west-bus-station.html',
  styleUrl: './west-bus-station.css',
})
export class WestBusStation {

}
