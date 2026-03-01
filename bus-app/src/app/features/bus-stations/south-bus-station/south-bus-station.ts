import { Component } from '@angular/core';
import {Tab, Tabs, TabList, TabPanel, TabContent} from '@angular/aria/tabs';
import { RouteData } from "../../routes/route-data/route-data";

@Component({
  selector: 'app-south-bus-station',
  imports: [RouteData, TabList, Tab, Tabs, TabPanel, TabContent],
  templateUrl: './south-bus-station.html',
  styleUrl: './south-bus-station.css',
})
export class SouthBusStation {

}
