import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutesTabs } from './routes-tabs';

describe('RoutesTabs', () => {
  let component: RoutesTabs;
  let fixture: ComponentFixture<RoutesTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutesTabs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutesTabs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
