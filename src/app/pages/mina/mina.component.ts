import { Component, OnInit, inject, signal, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner'; // Importar Escáner
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ViajeService } from '../../services/viaje.service'; // Ajusta la ruta

@Component({
  selector: 'app-mina',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ZXingScannerModule],
  templateUrl: './mina.component.html',
})
export default class MinaComponent implements OnInit {

  constructor(private cd: ChangeDetectorRef) {}
  private fb = inject(FormBuilder);
  private platformId = inject(PLATFORM_ID);

  private viajeService = inject(ViajeService); // <--- Inyectamos el servicio

  public minaForm!: FormGroup;
  public isPosting = signal(false);
  public escaneadoExitoso = signal(false); // Controla si se muestra el formulario
  public mostrarEscaner = signal(false);   // Controla si la cámara está encendida

  public nombreDespachador = 'Usuario Test';
  public horaActual = '';
  public fechaActual = '';
  public ultimoFolio: any = 0;
  mostrarModal = signal(false);
  mostrarColumnaOculta: boolean = false;
  // 👇 nuevo: arreglo para almacenar las unidades registradas
  // 👇 Reemplazamos los datos en duro por un signal vacío
  public unidadesRegistradas = signal<any[]>([]);

  // Creamos una variable de estado para guardar los IDs del QR
  public datosQrIds: any = {};

  ngOnInit(): void {
    this.initForm();
    if (isPlatformBrowser(this.platformId)) {
      this.obtenerDatosSesion();
      this.actualizarReloj();
      this.cargarViajes(); // <--- Llamamos a la API al iniciar
    }
    this.obtenerFolio();
  }

  // Nueva función para traer los datos reales
  cargarViajes() {
    this.viajeService.getViajes().subscribe({
      next: (data) => {
        this.unidadesRegistradas.set(data);
      },
      error: (err) => console.error('Error al cargar viajes', err)
    });
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
      const data = JSON.parse(resultString);
      console.log("Información del QR:", data);

      // Guardamos los IDs que se van a mandar a la base de datos
      this.datosQrIds = {
        empresa_id: data.id_empresa,
        tracto_id: data.id_tracto,
        operador_id: data.id_operador,
        mina_id: data.id_mina
      };
      console.log("datosQrIds:", this.datosQrIds);

      // Rellenamos el formulario con los nombres legibles
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
    // 1. Si el formulario es inválido, no hacemos nada y aseguramos que isPosting sea falso
    if (this.minaForm.invalid) {
      this.isPosting.set(false);
      alert('Por favor, llena todos los campos obligatorios.');
      return;
    }

    // 2. BLOQUEAMOS EL BOTÓN DE INMEDIATO
    this.isPosting.set(true);
    this.cd.detectChanges();

    const formValues = this.minaForm.getRawValue();

    // Armando el paquete final con IDs del QR + info manual de Angular
    const payload = {
      empresa_id: this.datosQrIds.empresa_id,
      tracto_id: this.datosQrIds.tracto_id,
      operador_id: this.datosQrIds.operador_id,
      mina_id: this.datosQrIds.mina_id,
      producto: formValues.producto,
      cantidad_m3: formValues.cantidadM3,
      observaciones_mina: formValues.observaciones
    };
    console.log("Objeto a insertar", payload);
    // Invocamos al servicio de Angular
    this.viajeService.crearViaje(payload).subscribe({
      next: (response) => {
        // 1. Apagamos el estado de carga y guardamos el folio
        this.isPosting.set(false);
        this.ultimoFolio = response.folio;

        // 2. DISPARAMOS EL MODAL PRIMERO (Prioridad máxima)
        this.mostrarModal.set(true);

        // 3. MANDAMOS AL FINAL DE LA COLA LO QUE "PESA"
        // Usamos un tiempo corto, pero suficiente para que el navegador pinte el modal
        setTimeout(() => {
          // Estas funciones suelen reconstruir el DOM de la tabla y resetear validaciones,
          // por eso "traban" la aparición del modal si se ejecutan al mismo tiempo.
          this.cargarViajes();
          this.minaForm.reset();
        }, 300);
      },
      error: (err) => {
        this.isPosting.set(false);
        console.error('Error al guardar viaje', err);
        alert('No se pudo guardar el viaje en la base de datos.');
        // ESTO ES LO QUE VERÁS EN EL CELULAR:
        console.error('Error completo:', err);

        // Mostramos un resumen del error en pantalla
        const mensajeError = err.error?.message || err.message || 'Error desconocido';
        const statusError = err.status || 'Sin Status';

        alert(`❌ FALLÓ EL INSERT:\nStatus: ${statusError}\nDetalle: ${mensajeError}`);

        if (statusError === 0) {
          alert("CONSEJO: El Status 0 significa que el celular no llega al servidor. Revisa que la IP no sea 'localhost'.");
        }
      }
    });

  }

  // Método auxiliar para limpiar el formulario después del éxito
  reiniciarFormulario() {
    this.minaForm.patchValue({
      cantidadM3: '',
      observaciones: ''
    });
    this.datosQrIds = {};
  }
  cerrarModal() {

    this.mostrarModal.set(false);
     this.reiniciarFormulario(); // Limpiamos campos
    // Si usas un booleano para el escáner exitoso, regrésalo a false aquí
  this.escaneadoExitoso.set(false);
  this.mostrarEscaner.set(true); // Listo para el siguiente QR
  }

  // Actualiza el generador de PDF para usar el valor del signal
  generarPDF() {
    const doc = new jsPDF();
    doc.text('Reporte de Unidades Registradas', 14, 15);

    autoTable(doc, {
      head: [['Folio', 'Empresa', 'Placa', 'M³', 'Operador', 'Fecha']],
      // Usamos .unidadesRegistradas() con paréntesis porque es un signal
      body: this.unidadesRegistradas().map(u => [
        u.folio_viaje,
        u.nombre_empresa,
        u.placa_tracto,
        u.cantidad_m3,
        u.nombre_operador,
        u.fecha_viaje
      ]),
      startY: 20,
    });

    doc.save('viajes.pdf');
  }
}
