import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusSubscriptionInformation } from './bus-subscription-information';

describe('BusSubscriptionInformation', () => {
  let component: BusSubscriptionInformation;
  let fixture: ComponentFixture<BusSubscriptionInformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusSubscriptionInformation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusSubscriptionInformation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
