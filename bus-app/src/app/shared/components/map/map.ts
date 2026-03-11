import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
// import * as L from 'leaflet';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { latLng, LatLng, tileLayer } from 'leaflet';
import 'leaflet-control-geocoder';
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import "lrm-graphhopper";
import { SelectedStop, Stop } from '../../../models';

declare let L: any;
@Component({
  selector: 'app-map',
  templateUrl: './map.html',
  styleUrls: ['./map.css'],
  standalone: true,
  imports: [LeafletModule]
})
export class MapComponent implements OnChanges {
  @Output() stopSelected = new EventEmitter<SelectedStop>();
  @Output() distance = new EventEmitter<number>();
  @Output() duration = new EventEmitter<number>();
  @Output() legTimesChange = new EventEmitter<number[]>();

  @Input() departureStop?: Stop;
  @Input() arrivalStop?: Stop;
  @Input() intermediateStops?: Stop[];

  private map: L.Map | undefined;
  private routingControl: any;

  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      })
    ],
    zoom: 12,
    center: latLng(42.5048, 27.4626)
  };

  customSvgIcon = L.divIcon({
    html: `
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="#007bff" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="9" r="3" fill="white"/>
    </svg>`,
    className: "custom-leaflet-icon",
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  });

  onMapReady(map: L.Map) {
    this.map = map;

    (L.Control as any).geocoder({ defaultMarkGeocode: false })
      .on('markgeocode', (e: any) => {
        const latlng = e.geocode.center;
        L.marker(latlng)
          .addTo(map)
          .bindPopup(e.geocode.name)
          .openPopup();

        this.stopSelected.emit({
          lat: latlng.lat,
          lng: latlng.lng,
          address: e.geocode.name
        });
      })
      .addTo(map);

    this.updateRouting();
  }

  updateRouting() {
    if (!this.map) return;

    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
    }

    const waypoints: any[] = [];

    if (this.departureStop) waypoints.push(L.latLng(this.departureStop.location.coordinates[1], this.departureStop.location.coordinates[0]));
    if (this.intermediateStops) {

      this.intermediateStops.forEach(stop => waypoints.push(L.latLng(stop.location.coordinates[1], stop.location.coordinates[0])));
    }
    if (this.arrivalStop) waypoints.push(L.latLng(this.arrivalStop.location.coordinates[1], this.arrivalStop.location.coordinates[0]));

    if (waypoints.length < 2) return;

    this.routingControl = L.Routing.control({
    router: new L.Routing.GraphHopper('3c01185e-9fb4-411a-97f3-fc677dd1fcc3'),
    waypoints,
    routeWhileDragging: false,
    show: false,
    fitSelectedRoutes: true,
    addWaypoints: false,
    plan: L.Routing.plan(waypoints, {
      draggableWaypoints: false,
      addWaypoints: false,
      createMarker: (i: number, wp: any) => {
        return L.marker(wp.latLng, {
          draggable: false,
          icon: this.customSvgIcon
        });
      }
    })
  }).addTo(this.map);

    this.routingControl.on('routesfound', (e: any) => {
    if (e.routes && e.routes.length > 0) {

      const summary = e.routes[0].summary;
      const distanceKm = summary.totalDistance / 1000;

      this.distance.emit(distanceKm);
      this.duration.emit(summary.totalTime)
      const legTimes = this.calculateLegTimes(e.routes[0]);
      this.legTimesChange.emit(legTimes);
    }
  });
  }

calculateLegTimes(route: any): number[] {
  const legTimes: number[] = [];
  const waypointIndices = route.waypointIndices;
  const instructions = route.instructions;

  for (let i = 0; i < waypointIndices.length - 1; i++) {
    const fromIdx = waypointIndices[i];
    const toIdx = waypointIndices[i + 1];

    let legTime = 0;

    instructions.forEach((instr: any) => {
      if (instr.index >= fromIdx && instr.index < toIdx) {
        legTime += instr.time;
      }
    });

    legTimes.push(legTime);
  }

  return legTimes;
}

ngOnChanges(changes: SimpleChanges) {
  if (!this.map) return;
  if (changes['departureStop'] || changes['arrivalStop'] || changes['intermediateStops']) {
    this.updateRouting();
  }
}
}