import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro-unidades',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro-unidades.component.html',
  styleUrls: ['./registro-unidades.component.css']
})
export default class RegistroUnidadesComponent {
  unidadForm: FormGroup;
  folioActual = 101;
  posting = false;
  mostrarModal = false;

  // 👇 nuevo: arreglo para almacenar las unidades registradas
  unidadesRegistradas: any[] = [];

  constructor(private fb: FormBuilder) {
    this.unidadForm = this.fb.group({
      modelo: ['', Validators.required],
      color: ['', Validators.required],
      placaTracto: ['', Validators.required],

      placaGondola1: [''],
      placaGondola2: [''],

      mina: [''],
      producto: [''],

      operador: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],

      cantidadM3: [0, [Validators.required, Validators.min(1)]],
      observaciones: ['']
    });
  }

  isPosting() {
    return this.posting;
  }

  guardarUnidad() {
    if (this.unidadForm.valid) {
      this.posting = true;
      const nuevaUnidad = { ...this.unidadForm.value, folio: this.folioActual };

      setTimeout(() => {
        this.posting = false;
        this.mostrarModal = true;

        // 👇 guardar en el arreglo
        this.unidadesRegistradas.push(nuevaUnidad);

        // 👇 incrementar folio
        this.folioActual++;
        this.unidadForm.reset();
      }, 2000);
    } else {
      this.unidadForm.markAllAsTouched();
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
  }
}
