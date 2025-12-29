import { Component, AfterViewInit, inject } from '@angular/core';
// import * as L from 'leaflet';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { latLng, LatLng, tileLayer } from 'leaflet';
import 'leaflet-control-geocoder';
import { StopsService } from '../../../core/services';
import { FormControl, FormGroup, ReactiveFormsModule, FormBuilder, AbstractControl } from '@angular/forms';

declare let L: any;
@Component({
  selector: 'app-map',
  templateUrl: './map.html',
  styleUrls: ['./map.css'],
  standalone: true,
  imports: [LeafletModule, ReactiveFormsModule]

})
export class MapComponent {
  private map: L.Map | undefined;
  private stopService = inject(StopsService);
  private formBuilder = inject(FormBuilder)

  addStopForm: FormGroup;

  constructor() {
    this.addStopForm = this.formBuilder.group({
      latitude: [''],
      longitude: [''],
      name: ['']
    });
  }

  locations = [
    { id: 1, name: 'Burgas', latitude: 42.490721, longitude: 27.473981 },
    { id: 2, name: 'Varna', latitude: 43.2160, longitude: 27.8972 }
  ];

  latlngs: L.LatLngExpression[] = [
    [42.490721, 27.473981],
    [43.2160, 27.8972]
  ];

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

        this.addStopForm.patchValue({
          latitude: latlng.lat,
          longitude: latlng.lng,
          name: e.geocode.name
        })
        console.log(this.addStopForm.value)
      })
      .addTo(map);
  }

  get name(): AbstractControl<any, any> | null {
    return this.addStopForm.get('name');
  }

  get latitude(): AbstractControl<any, any> | null {
    return this.addStopForm.get('latitude');
  }

  get longitude(): AbstractControl<any, any> | null {
    return this.addStopForm.get('longitude');
  }

  onSubmit(): void {
    if (this.name != null && this.latitude != null && this.longitude != null) {
      const newStop = {
        name: this.name.value,
        location: {
          type: 'Point',
          coordinates: [
            Number(this.longitude.value) ,
            Number(this.latitude.value)
          ] as [number, number]
        }
      }

      this.stopService.createStop(newStop).subscribe({
        next: () => {
          console.log('Stop created:', stop);
          this.addStopForm.reset();
        },
         error: (err) => {
          console.log("Login failed", err);
        }
      })
    }
  }
}