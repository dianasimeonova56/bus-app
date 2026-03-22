import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNews } from './add-news';

describe('AddNews', () => {
  let component: AddNews;
  let fixture: ComponentFixture<AddNews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNews]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNews);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
