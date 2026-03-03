import { Component, inject, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common'
import { HighlightStopDirective } from '../../../shared/directive';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-routes-table',
  standalone: true,
  imports: [AsyncPipe, HighlightStopDirective, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './routes-table.html',
  styleUrl: './routes-table.css',
})
export class RoutesTable implements OnChanges {
  private cdr = inject(ChangeDetectorRef);

  @Input() data: any[] | null = null; 
  @Input() searchedStopId: string | null = null;

  private dataSubject = new BehaviorSubject<any[]>([]);
  displayData$ = this.dataSubject.asObservable();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.dataSubject.next(this.data || []);
      this.cdr.detectChanges();
    }
  }

  isTrip(item: any): boolean {
    return !!(item && item.route);
  }

  isSearchedStop(stopId: string): boolean {
    return this.searchedStopId === stopId;
  }

  expandedRouteId: string | undefined;

  toggle(id: string | undefined) {
    this.expandedRouteId = this.expandedRouteId === id ? undefined : id;
    this.cdr.detectChanges();
  }
}