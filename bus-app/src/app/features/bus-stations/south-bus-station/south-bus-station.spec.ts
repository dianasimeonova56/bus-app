import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SouthBusStation } from './south-bus-station';

describe('SouthBusStation', () => {
  let component: SouthBusStation;
  let fixture: ComponentFixture<SouthBusStation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SouthBusStation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SouthBusStation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
