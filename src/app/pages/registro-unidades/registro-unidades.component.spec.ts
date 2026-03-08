import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroUnidadesComponent } from './registro-unidades.component';

describe('RegistroUnidadesComponent', () => {
  let component: RegistroUnidadesComponent;
  let fixture: ComponentFixture<RegistroUnidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroUnidadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroUnidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
