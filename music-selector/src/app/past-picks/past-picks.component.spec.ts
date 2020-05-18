import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastPicksComponent } from './past-picks.component';

describe('PastPicksComponent', () => {
  let component: PastPicksComponent;
  let fixture: ComponentFixture<PastPicksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PastPicksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PastPicksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
