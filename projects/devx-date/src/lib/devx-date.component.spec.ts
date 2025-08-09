import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevxDateComponent } from './devx-date.component';

describe('DevxDateComponent', () => {
  let component: DevxDateComponent;
  let fixture: ComponentFixture<DevxDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevxDateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevxDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
