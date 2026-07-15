import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSignupComponent } from './vendor-signup-component';

describe('VendorSignupComponent', () => {
  let component: VendorSignupComponent;
  let fixture: ComponentFixture<VendorSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorSignupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorSignupComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
