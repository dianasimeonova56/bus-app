import { Component, signal } from '@angular/core';
import { Tab, Tabs, TabList, TabPanel, TabContent } from '@angular/aria/tabs';
import { RouteData } from "../route-data/route-data";

type StationPosition = 'south' | 'west';

@Component({
  selector: 'app-routes-tabs',
  imports: [RouteData, TabList, Tab, Tabs, TabPanel, TabContent],
  templateUrl: './routes-tabs.html',
  styleUrl: './routes-tabs.css',
})
export class RoutesTabs {
  readonly station = signal<StationPosition>('south');

  setStation(value: StationPosition): void {
    this.station.set(value);
  }
}
