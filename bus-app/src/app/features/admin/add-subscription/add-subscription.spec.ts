import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubscription } from './add-subscription';

describe('AddSubscription', () => {
  let component: AddSubscription;
  let fixture: ComponentFixture<AddSubscription>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSubscription]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSubscription);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
