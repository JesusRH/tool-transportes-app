import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro-usuarios.component.html',
  styleUrls: ['./registro-usuarios.component.css']
})
export default class RegistroUsuariosComponent {
  usuarioForm: FormGroup;
  folioActual = 1; // Ejemplo de folio para usuarios
  posting = false;
  mostrarModal = false;

  constructor(private fb: FormBuilder) {
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['', Validators.required]
    });
  }

  isPosting() {
    return this.posting;
  }

  guardarUsuario() {
    if (this.usuarioForm.valid) {
      this.posting = true;
      console.log('Usuario registrado:', this.usuarioForm.value);

      setTimeout(() => {
        this.posting = false;
        this.mostrarModal = true;
      }, 2000);
    } else {
      this.usuarioForm.markAllAsTouched();
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
  }
}
