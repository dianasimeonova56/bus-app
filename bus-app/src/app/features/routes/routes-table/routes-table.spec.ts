import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutesTable } from './routes-table';

describe('LoadDepartures', () => {
  let component: RoutesTable;
  let fixture: ComponentFixture<RoutesTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutesTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutesTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
