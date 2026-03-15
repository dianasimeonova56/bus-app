import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuySubscription } from './buy-subscription';

describe('BuySubscription', () => {
  let component: BuySubscription;
  let fixture: ComponentFixture<BuySubscription>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuySubscription]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuySubscription);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
