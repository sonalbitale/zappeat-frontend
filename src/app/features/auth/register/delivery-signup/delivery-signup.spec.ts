import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverySignup } from './delivery-signup';

describe('DeliverySignup', () => {
  let component: DeliverySignup;
  let fixture: ComponentFixture<DeliverySignup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliverySignup],
    }).compileComponents();

    fixture = TestBed.createComponent(DeliverySignup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
