import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { StopsService } from '../../../core/services';
import { Stop } from '../../../models';
import { ReactiveFormsModule, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../../../shared/components/map/map';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-add-route',
  imports: [ReactiveFormsModule, CommonModule, MapComponent, DragDropModule],
  templateUrl: './add-route.html',
  styleUrl: './add-route.css',
})
export class AddRoute {
  private stopService = inject(StopsService);
  private formBuilder = inject(FormBuilder);
  selectedDepartureId: string | undefined;
  selectedArrivalId: string | undefined;
  selectedStops: Stop[] = [];
  busStations$: Observable<Stop[]>;
  normalStops$: Observable<Stop[]>;

  addStopForm: FormGroup;

  constructor() {
    this.addStopForm = this.formBuilder.group({
      latitude: [''],
      longitude: [''],
      name: ['']
    });
    this.busStations$ = this.stopService.getBusStations();
    this.normalStops$ = this.stopService.getNormalStops();
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

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selectedStops, event.previousIndex, event.currentIndex);
  }

  onSubmit(): void {
    // if (this.name != null && this.latitude != null && this.longitude != null) {
    //   const newStop = {
    //     name: this.name.value,
    //     location: {
    //       type: 'Point',
    //       coordinates: [
    //         Number(this.longitude.value),
    //         Number(this.latitude.value)
    //       ] as [number, number]
    //     }
    //   }

    //   this.stopService.createStop(newStop).subscribe({
    //     next: () => {
    //       console.log('Stop created:', stop);
    //       this.addStopForm.reset();
    //     },
    //     error: (err) => {
    //       console.log("Login failed", err);
    //     }
    //   })
    // }
  }

  onStopDepartureSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    this.busStations$.subscribe(stops => {
      const found = stops.find(s => s.name === value);
      if (found) {
        if (found?._id == this.selectedArrivalId) {
          //TODO: make error handling better
          alert('Stop has been chosen as an arrival!')
        } else if (this.selectedStops.includes(found!)) {
          alert('Stop has been chosen as an intermidiate stop!')
        } else {
          this.selectedArrivalId = found!._id;
          console.log('Selected arrival:', found);
        }
      }
    }).unsubscribe();
  }

  onStopArrivalSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    this.busStations$.subscribe(stops => {
      const found = stops.find(s => s.name === value);
      if (found) {
        if (found?._id == this.selectedDepartureId) {
          //TODO: make error handling better
          alert('Stop has been chosen as an departure!')
        } else if (this.selectedStops.includes(found!)) {
          alert('Stop has been chosen as an intermediate stop!')
        } else {
          this.selectedArrivalId = found!._id;
          console.log('Selected arrival:', found);
        }
      }

    }).unsubscribe();
  }

  onStopIntermediateSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    this.normalStops$.subscribe(stops => {
      const found = stops.find(s => s.name === value);
      if (found) {
        if (found?._id == this.selectedArrivalId) {
          //TODO: make error handling better
          console.log(found, this.selectedArrivalId);

          alert('Stop has been chosen as an arrival!')
        } else if (found?._id == this.selectedDepartureId) {
          alert('Stop has been chosen as an departire!')
        } else {
          this.selectedStops.push(found);
        }
      }
    }).unsubscribe();
  }

  getDepartureSector(): void {

  }

  onStopSelected(stop: { lat: number; lng: number; name: string }) {
    this.latitude?.setValue(stop.lat);
    this.longitude?.setValue(stop.lng);
    this.name?.setValue(stop.name);
  }
}
