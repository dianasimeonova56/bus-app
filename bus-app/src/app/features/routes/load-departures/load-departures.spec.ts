import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDepartures } from './load-departures';

describe('LoadDepartures', () => {
  let component: LoadDepartures;
  let fixture: ComponentFixture<LoadDepartures>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadDepartures]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadDepartures);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
