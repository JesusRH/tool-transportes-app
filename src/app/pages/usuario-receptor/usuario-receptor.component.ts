import { Component, OnInit, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-usuario-receptor',
  standalone: true,
  imports: [CommonModule, ZXingScannerModule],
  templateUrl: './usuario-receptor.component.html'
})
export default class UsuarioReceptorComponent implements OnInit {
  // Inyectamos el ID de la plataforma para saber si es navegador o servidor (build)
  private platformId = inject(PLATFORM_ID);

  public registroEncontrado = signal(true);
  public mostrarEscaner = signal(false);
  public cargando = signal(false);

  public nombreReceptor = 'JUAN PÉREZ (RECEPTOR)';
  public fechaRecepcion = '';
  public horaRecepcion = '';

  public datosDB: any = {
    folio: 'M-998234',
    transportista: 'LOGÍSTICA INTEGRAL S.A.',
    modelo: 'FREIGHTLINER CASCADIA',
    color: 'ROJO ÓXIDO',
    placaTracto: 'ABC-123-X',
    gondola1: 'G-700',
    placaG1: 'NX-99-10',
    gondola2: 'G-701',
    placaG2: 'NX-99-11',
    fechaSalida: '07/03/2026 09:15 AM',
    observaciones: 'Carga verificada en báscula de salida. Lona colocada.',
    operador: 'MARCO ANTONIO SOLÍS',
    telefono: '555-987-6543',
    mina: 'MINA "LA ESPERANZA"',
    producto: 'ARENA SÍLICA',
    cantidadM3: 30.00
  };

  ngOnInit() {
    this.iniciarReloj();
  }

  iniciarReloj() {
    const actualizar = () => {
      const ahora = new Date();
      this.fechaRecepcion = ahora.toLocaleDateString('es-MX');
      this.horaRecepcion = ahora.toLocaleTimeString('es-MX');
    };

    // Esto se ejecuta siempre (servidor y navegador) para que la página no nazca vacía
    actualizar();

    // El setInterval SOLO se activa en el navegador para no trabar el 'ng build'
    if (isPlatformBrowser(this.platformId)) {
      setInterval(actualizar, 1000);
    }
  }

  finalizarRecepcion() {
    // Protección extra por si se llama desde el HTML en un entorno no-navegador
    if (isPlatformBrowser(this.platformId)) {
      alert('Simulación de guardado exitosa');
    }
  }
}
