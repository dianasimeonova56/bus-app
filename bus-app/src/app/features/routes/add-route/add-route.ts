import { Component, inject } from '@angular/core';
import { Observable, take } from 'rxjs';
import { OperatorsService, StopsService, RoutesService } from '../../../core/services';
import { Stop, TransportOperator } from '../../../models';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  AbstractControl,
  FormArray,
  FormControl
} from '@angular/forms';
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
  private routesService = inject(RoutesService);
  private fb = inject(FormBuilder);
  private operatorsService = inject(OperatorsService);

  selectedDeparture?: Stop;
  selectedArrival?: Stop;
  selectedStops: Stop[] = [];

  busStations$: Observable<Stop[]>;
  normalStops$: Observable<Stop[]>;
  allStops$: Observable<Stop[]>;
  operators$: Observable<TransportOperator[]>;

  currentRoutePoints: [number, number][] = [];

  addRouteForm: FormGroup;

  daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  departureSectors: number[] = [];
  arrivalSectors: number[] = [];

  distanceKm = 0;
  durationStr = '';
  duration = 0;
  legTimes: number[] = [];

  constructor() {
    this.addRouteForm = this.fb.group({
      departureStop: this.fb.group({
        departureStopId: null,
        departureSector: null
      }),
      intermediateStops: this.fb.array([]),
      arrivalStop: this.fb.group({
        arrivalStopId: null,
        arrivalSector: null
      }),
      days: this.fb.array([]),
      startHour: '',
      transportOperator: ''
    });

    this.busStations$ = this.stopService.getBusStations();
    this.normalStops$ = this.stopService.getNormalStops();
    this.allStops$ = this.stopService.getStops();
    this.operators$ = this.operatorsService.getOperators();

  }

  /* ================== GETTERS ================== */

  get days(): FormArray {
    return this.addRouteForm.get('days') as FormArray;
  }

  get transportOperator(): AbstractControl | null {
    return this.addRouteForm.get('transportOperator');
  }

  get intermediateStops(): FormArray {
    return this.addRouteForm.get('intermediateStops') as FormArray;
  }

  /* ================== DAYS ================== */

  onCheckboxChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const day = input.value;

    if (input.checked) {
      this.days.push(new FormControl(day));
    } else {
      const index = this.days.controls.findIndex(c => c.value === day);
      if (index !== -1) {
        this.days.removeAt(index);
      }
    }
  }

  selectAllDays() {
    this.days.clear();
    this.daysOfWeek.forEach(d => this.days.push(new FormControl(d)));
  }

  selectWeekend() {
    this.days.clear();
    this.days.push(new FormControl('Saturday'));
    this.days.push(new FormControl('Sunday'));
  }

  getSectorsArray(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  /* ================== STOPS ================== */

  addIntermediateStop(stop: Stop) {

    const control = this.fb.group({
      intermediateStopId: stop._id,
      sectors: stop.sectors ?? 0,
      intermediateSector: null,
      intermediateStopDurationMinutes: 1,
      intermediateStopName: stop.name,
      location: stop.location
    });

    this.intermediateStops.push(control);

  }

  updateIntermediateStopSector(stopId: string, event: Event) {

    const value = (event.target as HTMLInputElement).value;
    const index = this.intermediateStops.controls.findIndex(
      c => c.value.intermediateStopId === stopId
    );
    if (index === -1) return;

    const stopGroup = this.intermediateStops.at(index) as FormGroup;
    stopGroup.patchValue({
      intermediateSector: value
    });
  }

  updateIntermediateStopDwell(stopId: string, event: Event) {

    const value = (event.target as HTMLInputElement).value;
    const index = this.intermediateStops.controls.findIndex(
      c => c.value.intermediateStopId === stopId
    );
    if (index === -1) return;

    const stopGroup = this.intermediateStops.at(index) as FormGroup;
    stopGroup.patchValue({
      intermediateStopDurationMinutes: Number(value)
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selectedStops, event.previousIndex, event.currentIndex);
    moveItemInArray(this.intermediateStops.controls, event.previousIndex, event.currentIndex);
  }

  onStopDepartureSelected(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.busStations$.pipe(take(1)).subscribe(stops => {
      const found = stops.find(s => s.name === value);
      if (!found) return;

      if (found._id === this.selectedArrival?._id) {
        alert('Stop already selected as arrival!');
        return;
      }

      this.selectedDeparture = found;
      this.departureSectors = Array.from({ length: found.sectors ?? 0 }, (_, i) => i + 1);
      this.addRouteForm.get('departureStop.departureStopId')?.setValue(found._id);
    });
  }

  onStopArrivalSelected(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.busStations$.pipe(take(1)).subscribe(stops => {
      const found = stops.find(s => s.name === value);
      if (!found) return;

      if (found._id === this.selectedDeparture?._id) {
        alert('Stop already selected as departure!');
        return;
      }

      this.selectedArrival = found;
      this.arrivalSectors = Array.from({ length: found.sectors ?? 0 }, (_, i) => i + 1);
      this.addRouteForm.get('arrivalStop.arrivalStopId')?.setValue(found._id);
    });
  }

  onStopIntermediateSelected(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.allStops$.pipe(take(1)).subscribe(stops => {
      const found = stops.find(s => s.name === value);
      if (!found) return;

      if (
        found._id === this.selectedDeparture?._id ||
        found._id === this.selectedArrival?._id ||
        this.selectedStops.some(s => s._id === found._id)
      ) {
        alert('Stop already used!');
        return;
      }

      this.addIntermediateStop(found);
      this.selectedStops = this.intermediateStops.value;

    });
  }

  calculateTimeFromSeconds(time: string, secondsToAdd: number): string {
    const [h, m] = String(time).split(':').map(Number);

    const totalMinutes = h * 60 + m + secondsToAdd / 60;

    const hh = Math.floor(totalMinutes / 60) % 24;
    const mm = Math.floor(totalMinutes % 60);

    return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;
  }

  calculateTime(time: string, minutesToAdd: number): string {
    const [h, m] = String(time).split(':').map(Number);
    const total = h * 60 + m + minutesToAdd;
    const hh = Math.floor(total / 60) % 24;

    const mm = total % 60;
    return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;
  }

  buildSchedule(
    startTime: string,
    legs: number[],
    dwell: number[]
  ) {

    let time = startTime;

    return legs.map((travelMinutes, i) => {
      if (i == legs.length - 1) {
        const arrival = this.calculateTimeFromSeconds(time, travelMinutes);

        return { arrival }
      } else {
        const arrival = this.calculateTimeFromSeconds(time, travelMinutes);
        const departure = this.calculateTime(arrival, Number(dwell[i]) ?? 0);

        time = departure;
        return { arrival, departure };
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


  /* ================== SUBMIT ================== */

  onSubmit() {
    debugger
    const formValue = this.addRouteForm.value;

    const dwellings = formValue.intermediateStops.map((stop: any) => stop.intermediateStopDurationMinutes)

    const schedule = this.buildSchedule(formValue.startHour, this.legTimes, dwellings);

    console.log(schedule);

    let durationTotal = this.duration + dwellings.reduce((acc: any, num: any) => acc + (num *60), 0)
    console.log(durationTotal);
    
    durationTotal = this.formatDuration(durationTotal);
    console.log(durationTotal);

    console.log(formValue.intermediateStops);

    const newRoute = {
      startStop: {
        stopId: formValue.departureStop.departureStopId,
        sector: formValue.departureStop.departureSector
      },
      endStop: {
        stopId: formValue.arrivalStop.arrivalStopId,
        sector: formValue.arrivalStop.arrivalSector
      },
      distance: Number(this.distanceKm.toFixed(1)),
      duration: durationTotal[0],
      days: this.days.value as string[],
      stops: formValue.intermediateStops.map((s: any, index: number) => ({
        stopId: s.intermediateStopId,
        order: index + 1,
        sector: s.intermediateSector,
        arrivalTime: schedule[index].arrival,
        departureTime: schedule[index].departure,
      })),
      transportOperator: formValue.transportOperator,
      startHour: formValue.startHour,
      arrivalHour: schedule[schedule.length - 1].arrival
    };

    this.routesService.createRoute(newRoute).subscribe({
      next: () => {
        console.log('Route created');
        this.addRouteForm.reset();
        this.days.clear();
        this.intermediateStops.clear();
        this.selectedStops = [];
      },
      error: err => console.error(err)
    });
  }
}
