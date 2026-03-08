import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioReceptorComponent } from './usuario-receptor.component';

describe('UsuarioReceptorComponent', () => {
  let component: UsuarioReceptorComponent;
  let fixture: ComponentFixture<UsuarioReceptorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioReceptorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioReceptorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
