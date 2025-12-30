import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTransportOperator } from './add-transport-operator';

describe('AddTransportOperator', () => {
  let component: AddTransportOperator;
  let fixture: ComponentFixture<AddTransportOperator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTransportOperator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTransportOperator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
