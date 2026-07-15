import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vendororders } from './vendororders';

describe('Vendororders', () => {
  let component: Vendororders;
  let fixture: ComponentFixture<Vendororders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vendororders],
    }).compileComponents();

    fixture = TestBed.createComponent(Vendororders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
