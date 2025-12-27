import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.html',
  styleUrls: ['./map.css'],
  standalone: true,
  imports: [] 

})
export class MapComponent implements AfterViewInit {
  private map: L.Map | undefined;

  // List of locations
  locations = [
    { id: 1, name: 'Burgas', latitude: 42.490721, longitude: 27.473981 },
    { id: 2, name: 'Varna', latitude: 43.2160, longitude: 27.8972 }
  ];

  latlngs: L.LatLngExpression[] = [
    [42.490721, 27.473981],
    [43.2160, 27.8972]
  ];

  // Initialize the map
  private initMap(): void {

    const defaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    // Set the default marker icon
    L.Marker.prototype.options.icon = defaultIcon;

    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
      console.error('Map container not found! Make sure <div id="map"></div> exists in the DOM.');
      return;
    }

    // Create map centered at a default location
    this.map = L.map('map').setView([this.locations[0].latitude, this.locations[0].longitude], 2);
    const polyline = L.polyline(this.latlngs, {color: 'red'}).addTo(this.map);

// zoom the map to the polyline
    this.map.fitBounds(polyline.getBounds());

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    // Add markers for each location
   this.locations.forEach((location) => {
      L.marker([location.latitude, location.longitude])
        .addTo(this.map!)
        .bindPopup(`<b>${location.name}</b>`);
    });
  }

  // Lifecycle hook to initialize the map after the view is loaded
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
    });
  }
  
}