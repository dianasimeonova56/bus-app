import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WestBusStation } from './west-bus-station';

describe('WestBusStation', () => {
  let component: WestBusStation;
  let fixture: ComponentFixture<WestBusStation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WestBusStation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WestBusStation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
