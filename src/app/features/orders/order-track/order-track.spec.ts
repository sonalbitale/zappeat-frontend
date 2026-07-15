import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTrack } from './order-track';

describe('OrderTrack', () => {
  let component: OrderTrack;
  let fixture: ComponentFixture<OrderTrack>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderTrack],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderTrack);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
