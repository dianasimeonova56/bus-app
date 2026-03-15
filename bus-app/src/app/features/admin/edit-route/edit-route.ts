import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators
} from '@angular/forms';
import { RoutesService, StopsService } from '../../../core/services/index';
import { RoutePopulated, Stop } from '../../../models/index';
import { moveItemInArray, CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { MapComponent } from '../../../shared/components/map/map';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-edit-route',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragDropModule, MapComponent],
  templateUrl: './edit-route.html',
  styleUrl: './edit-route.css'
})
export class EditRoute implements OnInit {
  private fb = inject(FormBuilder);
  private routesService = inject(RoutesService);
  private stopService = inject(StopsService);

  routes: RoutePopulated[] = [];
  allStops$: Observable<Stop[]>;
  selectedRouteId: string | undefined = undefined;
  editForm: FormGroup;

  selectedDeparture?: Stop;
  selectedArrival?: Stop;
  selectedStops: Stop[] = [];

  distanceKm = 0;
  duration = 0;
  totalRouteDuration = 0;
  private _legTimes: number[] = [];
  selectedRouteObject: any = null;

  constructor() {
    this.allStops$ = this.stopService.getStops();
    this.editForm = this.fb.group({
      startHour: ['', Validators.required],
      arrivalHour: [''],
      oneWayTicketPrice: [0, [Validators.required, Validators.min(0)]],
      twoWayTicketPrice: [0, [Validators.required, Validators.min(0)]],
      distance: [0],
      duration: [''],
      stops: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadRoutes();
  }

  loadRoutes() {
    this.routesService.getRoutes().subscribe({
      next: (data) => this.routes = data,
      error: (err) => console.error('Грешка при зареждане:', err)
    });
  }

  get stopsFormArray() {
    return this.editForm.get('stops') as FormArray;
  }

  set legTimes(values: number[]) {
    this._legTimes = values;
    this.buildSchedule();
  }

  get legTimes() {
    return this._legTimes;
  }

  selectRoute(route: RoutePopulated) {
    this.selectedRouteId = route._id;
    this.selectedRouteObject = route;
    this.selectedDeparture = route.startStop.stopId;
    this.selectedArrival = route.endStop.stopId;
    this.selectedStops = route.stops.map(s => s.stopId);

    this.stopsFormArray.clear();
    this.editForm.patchValue({
      startHour: route.startHour,
      arrivalHour: route.arrivalHour,
      oneWayTicketPrice: route.oneWayTicketPrice,
      twoWayTicketPrice: route.twoWayTicketPrice,
      distance: route.distance,
      duration: route.duration
    });

    route.stops.forEach(s => {
      const calculatedDwell = this.calculateDwell(s.arrivalTime, s.departureTime);

      this.stopsFormArray.push(this.fb.group({
        stopId: [s.stopId._id],
        stopName: [s.stopId.name],
        location: [s.stopId.location],
        arrivalTime: [s.arrivalTime, Validators.required],
        departureTime: [s.departureTime, Validators.required],
        price: [s.price, [Validators.required, Validators.min(0)]],
        order: [s.order],
        sector: [s.sector],
        dwell: [calculatedDwell]
      }));
    });

    this.distanceKm = route.distance;
    this.totalRouteDuration = this.timeToSeconds(route.arrivalHour) - this.timeToSeconds(route.startHour);
  }

 toggleRouteStatus() {
  if (!this.selectedRouteObject) return;

  const newStatus = !this.selectedRouteObject.isActive;
  const actionText = newStatus ? 'активирате' : 'деактивирате';

  if (confirm(`Сигурни ли сте, че искате да ${actionText} този маршрут?`)) {
    this.routesService.patchRoute(this.selectedRouteId!, { isActive: newStatus }).subscribe({
      next: (updatedRoute) => {
        this.selectedRouteObject.isActive = updatedRoute.isActive;
        
        const index = this.routes.findIndex(r => r._id === updatedRoute._id);
        if (index !== -1) {
          this.routes[index].isActive = updatedRoute.isActive;
        }
        
        alert(`Маршрутът е успешно ${newStatus ? 'активиран' : 'деактивиран'}.`);
      },
      error: (err) => {
        console.error('Грешка при смяна на статуса:', err);
        alert('Възникна грешка при операцията.');
      }
    });
  }
}

  buildSchedule() {
    const startHour = this.editForm.get('startHour')?.value;
    if (!startHour || this.legTimes.length === 0) return;

    let currentTotalSeconds = this.timeToSeconds(startHour);
    const stops = this.stopsFormArray.controls;

    stops.forEach((stop, index) => {
      const travelTime = this.legTimes[index] || 0;
      const dwellMinutes = stop.get('dwell')?.value || 0;
      const dwellSeconds = dwellMinutes * 60;

      const arrivalSeconds = currentTotalSeconds + travelTime;
      const departureSeconds = arrivalSeconds + dwellSeconds;

      stop.patchValue({
        arrivalTime: this.secondsToTime(arrivalSeconds),
        departureTime: this.secondsToTime(departureSeconds)
      }, { emitEvent: false });

      currentTotalSeconds = departureSeconds;
    });

    const finalLeg = this.legTimes[this.legTimes.length - 1] || 0;
    const finalArrivalSeconds = currentTotalSeconds + finalLeg;
    const finalArrivalStr = this.secondsToTime(finalArrivalSeconds);

    this.editForm.patchValue({ arrivalHour: finalArrivalStr });

    const startSeconds = this.timeToSeconds(startHour);
    this.totalRouteDuration = finalArrivalSeconds - startSeconds;
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.stopsFormArray.controls, event.previousIndex, event.currentIndex);

    const updatedStops = this.stopsFormArray.value.map((val: any) => ({
      _id: val.stopId,
      name: val.stopName,
      location: val.location
    } as Stop));

    this.selectedStops = [...updatedStops];

    this.stopsFormArray.controls.forEach((control, index) => {
      control.patchValue({ order: index + 1 }, { emitEvent: false });
    });
  }

  onStopSelectedForEdit(event: Event) {
    const input = event.target as HTMLInputElement;
    const stopName = input.value;
    if (!stopName) return;

    this.allStops$.pipe(take(1)).subscribe(stops => {
      const found = stops.find(s => s.name === stopName);

      if (found) {
        const isAlreadyIntermediate = this.stopsFormArray.controls.some(
          control => control.get('stopId')?.value === found._id
        );

        const isStartOrEnd =
          this.selectedDeparture?._id === found._id ||
          this.selectedArrival?._id === found._id;

        if (isAlreadyIntermediate || isStartOrEnd) {
          alert(`Грешка: Спирката "${found.name}" не може да бъде добавена. Тя вече е начална, крайна или съществуваща междинна спирка.`);
          input.value = '';
          return;
        }

        this.stopsFormArray.push(this.fb.group({
          stopId: [found._id],
          stopName: [found.name],
          location: [found.location],
          arrivalTime: ['', Validators.required],
          departureTime: ['', Validators.required],
          price: [0, Validators.required],
          order: [this.stopsFormArray.length + 1],
          sector: [null],
          dwell: [15]
        }));

        this.selectedStops = [...this.selectedStops, found];
        input.value = '';
      }
    });
  }

  removeStop(index: number) {
    this.stopsFormArray.removeAt(index);
    const updated = [...this.selectedStops];
    updated.splice(index, 1);
    this.selectedStops = updated;
  }

  formatDuration(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.round((seconds % 3600) / 60);
    return hrs > 0 ? `${hrs}h ${mins}min` : `${mins}min`;
  }

  private timeToSeconds(time: string): number {
    const [hh, mm] = time.split(':').map(Number);
    return hh * 3600 + mm * 60;
  }

  private secondsToTime(seconds: number): string {
    const h = Math.floor((seconds / 3600) % 24);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  private calculateDwell(arrival: string, departure: string): number {
    if (!arrival || !departure) return 15; // По подразбиране
    const diff = this.timeToSeconds(departure) - this.timeToSeconds(arrival);
    return Math.max(0, Math.floor(diff / 60)); // Връща минутите
  }

  onSave() {
  if (this.editForm.invalid || !this.selectedRouteId) {
    alert('Моля, попълнете всички задължителни полета правилно.');
    return;
  }

  const formValue = this.editForm.getRawValue();
  
  const routeData = {
    startHour: formValue.startHour,
    arrivalHour: formValue.arrivalHour,
    oneWayTicketPrice: formValue.oneWayTicketPrice,
    twoWayTicketPrice: formValue.twoWayTicketPrice,
    distance: Number(this.distanceKm.toFixed(1)),
    duration: this.formatDuration(this.totalRouteDuration),
    stops: formValue.stops.map((s: any) => ({
      stopId: s.stopId,
      arrivalTime: s.arrivalTime,
      departureTime: s.departureTime,
      price: s.price,
      order: s.order,
      sector: s.sector
    }))
  };

  this.routesService.updateRoute(this.selectedRouteId, routeData).subscribe({
    next: (response) => {
      console.log('Успех:', response);
      alert('Маршрутът беше успешно актуализиран!');
      
      this.selectedRouteId = undefined;
      this.loadRoutes();
    },
    error: (err) => {
      console.error('Бекенд грешка:', err);
      alert('Възникна грешка при запис на данните. Проверете конзолата.');
    }
  });
}
}