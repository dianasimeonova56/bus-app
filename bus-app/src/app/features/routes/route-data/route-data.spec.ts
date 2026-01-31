import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteData } from './route-data';

describe('RouteData', () => {
  let component: RouteData;
  let fixture: ComponentFixture<RouteData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouteData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
