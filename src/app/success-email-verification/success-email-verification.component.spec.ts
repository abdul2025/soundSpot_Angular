import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessEmailVerificationComponent } from './success-email-verification.component';

describe('SuccessEmailVerificationComponent', () => {
  let component: SuccessEmailVerificationComponent;
  let fixture: ComponentFixture<SuccessEmailVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessEmailVerificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessEmailVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
