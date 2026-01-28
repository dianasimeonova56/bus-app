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
  @Output() durationStr = new EventEmitter<string>();
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
    zoom: 5,
    center: latLng(46.879966, -121.726909)
  };

  onMapReady(map: L.Map) {
    this.map = map;

    // Override default marker
    // L.Marker.prototype.options.icon = L.icon({
    //   iconUrl: 'assets/marker-icon.png',
    //   shadowUrl: 'assets/marker-shadow.png'
    // });

    // Geocoder за добавяне на точки
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
          name: e.geocode.name
        });
      })
      .addTo(map);

    // Initial routing control
    this.updateRouting();
  }

  updateRouting() {
    if (!this.map) return;

    // Remove old route
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
      routeWhileDragging: false
    }).addTo(this.map);

    this.routingControl.on('routesfound', (e: any) => {
      if (e.routes && e.routes.length > 0) {
        const summary = e.routes[0].summary;
        const distanceKm = summary.totalDistance / 1000;
        const [durationFormatted, duration] = this.formatDuration(summary.totalTime);

        console.log('Distance (km):', distanceKm);
        console.log('Duration:', durationFormatted);


        this.distance.emit(distanceKm);
        this.durationStr.emit(durationFormatted);
        this.duration.emit(duration)
        const legTimes = this.calculateLegTimes(e.routes[0]);
        this.legTimesChange.emit(legTimes);
      }
    });
  }

  formatDuration(seconds: number): [string, number] {
    const total = Math.round(seconds / 60);
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.round((seconds % 3600) / 60);

    if (hrs > 0) {
      return [`${hrs}h${mins > 0 ? mins : ''}min`, total];
    } else {
      return [`${mins}min`, total];
    }
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

    // results (seconds)
    console.log('Leg times:', legTimes);

    // example usage
    legTimes.forEach((time, i) => {
      console.log(`Leg ${i} (${i} → ${i + 1}): ${Math.round(time / 60)} min`);
    });

    return legTimes;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.map) return;
    if (changes['departureStop'] || changes['arrivalStop'] || changes['intermediateStops']) {
      this.updateRouting();
    }
  }
}