import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Controls } from './controls';

describe('Controls', () => {
  let component: Controls;
  let fixture: ComponentFixture<Controls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Controls]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Controls);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
