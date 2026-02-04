import { Component } from '@angular/core';
import {Tab, Tabs, TabList, TabPanel, TabContent} from '@angular/aria/tabs';
import { RouteData } from "../route-data/route-data";

@Component({
  selector: 'app-routes-tabs',
  imports: [RouteData, TabList, Tab, Tabs, TabPanel, TabContent],
  templateUrl: './routes-tabs.html',
  styleUrl: './routes-tabs.css',
})
export class RoutesTabs {

}
