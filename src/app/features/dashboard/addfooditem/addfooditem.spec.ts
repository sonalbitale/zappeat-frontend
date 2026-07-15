import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addfooditem } from './addfooditem';

describe('Addfooditem', () => {
  let component: Addfooditem;
  let fixture: ComponentFixture<Addfooditem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Addfooditem],
    }).compileComponents();

    fixture = TestBed.createComponent(Addfooditem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
