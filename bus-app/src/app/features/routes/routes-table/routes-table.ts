import { Component, inject, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { RoutesService } from '../../../core/services';
import { Observable, BehaviorSubject } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common'
import { HighlightStopDirective } from '../../../shared/directive';

@Component({
  selector: 'app-routes-table',
  standalone: true,
  imports: [AsyncPipe, HighlightStopDirective, CommonModule],
  templateUrl: './routes-table.html',
  styleUrl: './routes-table.css',
})
export class RoutesTable implements OnChanges {
  private routesService = inject(RoutesService);
  private cdr = inject(ChangeDetectorRef); // Добавено за сигурност

  @Input() data: any[] | null = null; 
  @Input() searchedStopId: string | null = null;

  private dataSubject = new BehaviorSubject<any[]>([]);
  displayData$ = this.dataSubject.asObservable();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      // Актуализираме потока от данни
      this.dataSubject.next(this.data || []);
      // Казваме на Angular да провери за промени веднага
      this.cdr.detectChanges();
    }
  }

  isTrip(item: any): boolean {
    // Проверка дали обектът е Trip (има вложен route)
    return !!(item && item.route);
  }

  isSearchedStop(stopId: string): boolean {
    return this.searchedStopId === stopId;
  }

  expandedRouteId: string | undefined;

  toggle(id: string | undefined) {
    this.expandedRouteId = this.expandedRouteId === id ? undefined : id;
    this.cdr.detectChanges(); // За да се отвори/затвори панелът веднага
  }
}