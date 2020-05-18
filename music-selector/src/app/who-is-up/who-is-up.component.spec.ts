import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoIsUpComponent } from './who-is-up.component';

describe('WhoIsUpComponent', () => {
  let component: WhoIsUpComponent;
  let fixture: ComponentFixture<WhoIsUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhoIsUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoIsUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
