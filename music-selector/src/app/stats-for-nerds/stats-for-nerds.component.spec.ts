import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsForNerdsComponent } from './stats-for-nerds.component';

describe('StatsForNerdsComponent', () => {
  let component: StatsForNerdsComponent;
  let fixture: ComponentFixture<StatsForNerdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsForNerdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsForNerdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
