import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'app-registro-unidades',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro-unidades.component.html',
  styleUrls: ['./registro-unidades.component.css']
})
export default class RegistroUnidadesComponent {
  unidadForm: FormGroup;
  folioActual:any = "0001";
  posting = false;
  mostrarModal = false;
   mostrarColumnaOculta: boolean = false;

  // 👇 nuevo: arreglo para almacenar las unidades registradas
  unidadesRegistradas = [
    { folio: 'F001', modelo: 'Volvo', color: 'Rojo', placaTracto: 'ABC123', placaGondola1: 'XYZ789', placaGondola2: 'LMN456', cantidadM3: 20, operador: 'Juan Pérez', telefono: '555-1234', observaciones: 'Buen estado' },
    { folio: 'F002', modelo: 'Kenworth', color: 'Azul', placaTracto: 'DEF456', placaGondola1: 'UVW111', placaGondola2: 'OPQ222', cantidadM3: 25, operador: 'Carlos López', telefono: '555-5678', observaciones: 'Revisión pendiente' }
  ];


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

  generarPDF() {
    const doc = new jsPDF();

    doc.text('Reporte de Unidades Registradas', 14, 15);

    autoTable(doc, {
      head: [['Folio', 'Modelo', 'Color', 'Placa Tracto', 'Góndola 1', 'Góndola 2', 'M³', 'Operador', 'Teléfono', 'Notas']],
      body: this.unidadesRegistradas.map(u => [
        u.folio, u.modelo, u.color, u.placaTracto, u.placaGondola1, u.placaGondola2,
        u.cantidadM3, u.operador, u.telefono, u.observaciones
      ]),
      startY: 20,
    });

    doc.save('unidades.pdf');
  }



}
