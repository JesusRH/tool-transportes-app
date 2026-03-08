import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro-unidades',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro-unidades.component.html',
  styleUrls: ['./registro-unidades.component.css'] // 👈 corregido: styleUrls (plural)
})
export default class RegistroUnidadesComponent {
  unidadForm: FormGroup;
  folioActual = 101; // Ejemplo de folio
  posting = false;
  mostrarModal = false; // 👈 nuevo: controla la ventana flotante

  constructor(private fb: FormBuilder) {
    this.unidadForm = this.fb.group({
      // Datos del Tracto
      modelo: ['', Validators.required],
      color: ['', Validators.required],
      placaTracto: ['', Validators.required],

      // Góndolas
      placaGondola1: [''],
      placaGondola2: [''],

      // Producto
      mina: [''],
      producto: [''],

      // Operador
      operador: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]], // 👈 validación de teléfono

      // Carga
      cantidadM3: [0, [Validators.required, Validators.min(1)]], // 👈 debe ser mayor a 0
      observaciones: ['']
    });
  }

  isPosting() {
    return this.posting;
  }

  guardarUnidad() {
    if (this.unidadForm.valid) {
      this.posting = true;
      console.log('Datos registrados:', this.unidadForm.value);

      // Simulación de espera
      setTimeout(() => {
        this.posting = false;
        this.mostrarModal = true; // 👈 mostrar modal al terminar
      }, 2000);
    } else {
      // Si el formulario no es válido, marcar todos los campos como tocados
      this.unidadForm.markAllAsTouched();
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
  }
}
