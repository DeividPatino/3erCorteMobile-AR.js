import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArPage } from './ar.page';

describe('ArPage', () => {
  let component: ArPage;
  let fixture: ComponentFixture<ArPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ArPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
