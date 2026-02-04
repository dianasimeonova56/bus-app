import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StopsService } from '../../../core/services';
import { Observable } from 'rxjs';
import { Stop } from '../../../models';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../../../shared/components/map/map';

@Component({
  selector: 'app-add-stop',
  imports: [ReactiveFormsModule, CommonModule, MapComponent],
  templateUrl: './add-stop.html',
  styleUrl: './add-stop.css',
})
export class AddStop {
  private stopService = inject(StopsService);
  private formBuilder = inject(FormBuilder);
  selectedStopId: string | null = null;
  stops$: Observable<Stop[]>;

  addStopForm: FormGroup;

  constructor() {
    this.addStopForm = this.formBuilder.group({
      latitude: [''],
      longitude: [''],
      name: [''],
      address: [''],
      type: [''],
      sectors: ['']
    });
    this.stops$ = this.stopService.stops$;
    this.stopService.getStops().subscribe();
  }


  get name(): AbstractControl<any, any> | null {
    return this.addStopForm.get('name');
  }

  get address(): AbstractControl<any, any> | null {
    return this.addStopForm.get('address');
  }

  get latitude(): AbstractControl<any, any> | null {
    return this.addStopForm.get('latitude');
  }

  get longitude(): AbstractControl<any, any> | null {
    return this.addStopForm.get('longitude');
  }

  get type(): AbstractControl<any, any> | null {
    return this.addStopForm.get('type');
  }

  get sectors(): AbstractControl<any, any> | null {
    return this.addStopForm.get('sectors');
  }

  onSubmit(): void {
    if (this.name != null && this.address != null && this.latitude != null && this.longitude != null) {
      const { name, address, latitude, longitude, type, sectors } = this.addStopForm.value;
      const newStop: Stop = {
        name,
        address,
        location: {
          type: 'Point',
          coordinates: [
            Number(longitude),
            Number(latitude)
          ] as [number, number]
        },
        type: type
      }

      if (type === 'Bus Station' && sectors) {
        newStop.sectors = sectors;
      }

      console.log(newStop);
      

      this.stopService.createStop(newStop).subscribe({
        next: (stop) => {
          console.log('Stop created:', stop);
          this.addStopForm.reset();
        },
        error: (err) => {
          console.log("Login failed", err);
        }
      })
    }
  }

  onStopSelected(stop: { lat: number; lng: number; address: string }) {
    this.latitude?.setValue(stop.lat);
    this.longitude?.setValue(stop.lng);
    this.address?.setValue(stop.address);
  }
}
