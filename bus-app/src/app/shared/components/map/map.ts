import { Component, EventEmitter, Output } from '@angular/core';
// import * as L from 'leaflet';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { latLng, LatLng, tileLayer } from 'leaflet';
import 'leaflet-control-geocoder';
import { SelectedStop, Stop } from '../../../models';

declare let L: any;
@Component({
  selector: 'app-map',
  templateUrl: './map.html',
  styleUrls: ['./map.css'],
  standalone: true,
  imports: [LeafletModule]
})
export class MapComponent {
  private map: L.Map | undefined;
  @Output() stopSelected = new EventEmitter<SelectedStop>();
  // locations = [
  //   { id: 1, name: 'Burgas', latitude: 42.490721, longitude: 27.473981 },
  //   { id: 2, name: 'Varna', latitude: 43.2160, longitude: 27.8972 }
  // ];

  // latlngs: L.LatLngExpression[] = [
  //   [42.490721, 27.473981],
  //   [43.2160, 27.8972]
  // ];

  optionsSpec: any = {
    layers: [{ url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: 'Open Street Map' }],
    zoom: 5,
    center: [46.879966, -121.726909]
  };

  zoom = this.optionsSpec.zoom;
  center = latLng(this.optionsSpec.center);
  options = {
    layers: [tileLayer(this.optionsSpec.layers[0].url, { attribution: this.optionsSpec.layers[0].attribution })],
    zoom: this.optionsSpec.zoom,
    center: latLng(this.optionsSpec.center)
  };

  formZoom = this.zoom;
  zoomLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  lat = this.center.lat;
  lng = this.center.lng;

  onCenterChange(center: LatLng) {
    this.lat = center.lat;
    this.lng = center.lng;
  }

  onZoomChange(zoom: number) {
    this.formZoom = zoom;
  }

  doApply() {
    this.center = latLng(this.lat, this.lng);
    this.zoom = this.formZoom;
  }


  onMapReady(map: L.Map) {
    (L.Control as any).geocoder({
      defaultMarkGeocode: false
    })
      .on('markgeocode', (e: any) => {
        const latlng = e.geocode.center;
        L.marker(latlng).addTo(map)
          .bindPopup(e.geocode.name)
          .openPopup();
        map.setView(latlng, 13);

        this.stopSelected.emit({ lat: latlng.lat, lng: latlng.lng, name: e.geocode.name });
      })
      .addTo(map);
  }
}