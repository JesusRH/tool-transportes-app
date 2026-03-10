import { Component, OnInit, inject, signal, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner'; // Importar Escáner
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-mina',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ZXingScannerModule],
  templateUrl: './mina.component.html',
})
export default class MinaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private platformId = inject(PLATFORM_ID);

  public minaForm!: FormGroup;
  public isPosting = signal(false);
  public escaneadoExitoso = signal(false); // Controla si se muestra el formulario
  public mostrarEscaner = signal(false);   // Controla si la cámara está encendida

  public nombreDespachador = 'Usuario Test';
  public horaActual = '';
  public fechaActual = '';
  public ultimoFolio:any = 0;
  mostrarModal = false;
  mostrarColumnaOculta: boolean = false;
   // 👇 nuevo: arreglo para almacenar las unidades registradas
  unidadesRegistradas = [
    { folio: 'F001', modelo: 'Volvo', color: 'Rojo', placaTracto: 'ABC123', placaGondola1: 'XYZ789', placaGondola2: 'LMN456', cantidadM3: 20, operador: 'Juan Pérez', telefono: '555-1234', observaciones: 'Buen estado' },
    { folio: 'F002', modelo: 'Kenworth', color: 'Azul', placaTracto: 'DEF456', placaGondola1: 'UVW111', placaGondola2: 'OPQ222', cantidadM3: 25, operador: 'Carlos López', telefono: '555-5678', observaciones: 'Revisión pendiente' }
  ];

  ngOnInit(): void {
    this.initForm();
    if (isPlatformBrowser(this.platformId)) {
      this.obtenerDatosSesion();
      this.actualizarReloj();
    }
    this.obtenerFolio();
  }

  initForm() {
    this.minaForm = this.fb.group({
      mina: [{ value: '', disabled: true }],
      producto: [{ value: 'Material Pétreo', disabled: true }],
      transportista: [{ value: '', disabled: true }],
      modelo: [{ value: '', disabled: true }],
      color: [{ value: '', disabled: true }],
      placaTracto: [{ value: '', disabled: true }],
      gondola1: [{ value: '', disabled: true }],
      placaG1: [{ value: '', disabled: true }],
      gondola2: [{ value: '', disabled: true }],
      placaG2: [{ value: '', disabled: true }],
      operador: [{ value: '', disabled: true }],
      telefono: [{ value: '', disabled: true }],
      cantidadM3: ['', [Validators.required, Validators.min(0.1)]],
      observaciones: [''],
      folio: [{ value: '', disabled: true }]
    });
  }

  // Esta función se ejecuta cuando el QR es detectado
  onCodeResult(resultString: string) {
    try {
      // Suponemos que el QR contiene un JSON con la info
      const data = JSON.parse(resultString);

      // Rellenamos el formulario con la info del QR
      this.minaForm.patchValue({
        transportista: data.transportista,
        modelo: data.modelo,
        color: data.color,
        placaTracto: data.placaTracto,
        gondola1: data.gondola1,
        placaG1: data.placaG1,
        gondola2: data.gondola2,
        placaG2: data.placaG2,
        operador: data.operador,
        telefono: data.telefono,
        mina: data.mina
      });

      this.escaneadoExitoso.set(true);
      this.mostrarEscaner.set(false);
    } catch (e) {
      alert("El código QR no tiene el formato correcto");
    }
  }

  obtenerDatosSesion() {
    const data = localStorage.getItem('user_data');
    if (data) {
      const user = JSON.parse(data);
      this.nombreDespachador = user.nombre || 'Usuario Desconocido';
    }
  }

  actualizarReloj() {
    const ahora = new Date();
    this.fechaActual = ahora.toLocaleDateString();
    this.horaActual = ahora.toLocaleTimeString();
    setInterval(() => {
      this.horaActual = new Date().toLocaleTimeString();
    }, 1000);
  }

  obtenerFolio() {
    this.ultimoFolio = "0001";
    this.minaForm.get('folio')?.setValue(this.ultimoFolio);
  }

  guardarRegistro() {
    if (this.minaForm.valid) {
      this.isPosting.set(true);
      setTimeout(() => {
        this.isPosting.set(false);
         this.mostrarModal = true;
      }, 2000);
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
