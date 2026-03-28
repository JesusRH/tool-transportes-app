import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { Router } from '@angular/router'; // Importa el Router
import { AuthService } from '../../services/auth.service'; // Asegúrate de que la ruta sea correcta
import { CommonModule } from '@angular/common'; // Necesario para *ngIf

@Component({
  selector: 'app-loggin',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './loggin.component.html',
  styleUrl: './loggin.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LogginComponent  implements OnInit {
  private title = inject(Title);
  private meta = inject(Meta);
  private fb = inject(FormBuilder);
  private router = inject(Router); // Inyectamos Router
  private authService = inject(AuthService); // Inyectamos tu nuevo servicio
  mostrarPassword = signal(false);

  hasError = signal(false);
  isPosting = signal(false); // Este nos servirá para deshabilitar el botón mientras carga

  loggingForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
  // 1. Si el formulario tiene errores visuales (ej. email mal escrito), no hace nada
  if (this.loggingForm.invalid) {
    this.hasError.set(true);
    setTimeout(() => this.hasError.set(false), 3000);
    return;
  }

  this.isPosting.set(true);

  // 2. Intentamos conectar con Node.js
  this.authService.login(this.loggingForm.value).subscribe({
    next: (res: any) => {
      this.isPosting.set(false);

    // 1. Guardamos el token y el rol (útil para guardias de seguridad)
      localStorage.setItem('token', res.token);
      localStorage.setItem('rol', res.user.rol);

      console.log("Usuario logueado:", res.user.nombre);
      console.log("Rol del usuario:", res.user.rol);
      // 2. Lógica de redirección por ROL
      // Supongamos: 1 = Administrador, 2 = Despachador Mina, 3 = Receptor
      const rol = res.user.rol;

      if (rol === 1) {
        this.router.navigate(['/resgistro_unidades']);
      } else if (rol === 2) {
        this.router.navigate(['/mina']); // Tu página actual
      } else if (rol === 3) {
        this.router.navigate(['/usuario_receptor']); // Otra página
      }
      /*else {
        // Por si acaso tiene un rol no definido
        this.router.navigate(['/mina']);
      }*/
    },
    error: (err) => {
      // SI HAY ERROR (Datos incorrectos en MySQL):
      this.isPosting.set(false); // Quitamos el estado de carga
      this.hasError.set(true);    // Activamos el Alert de error en el HTML

      console.error('Login fallido:', err);

      // Limpiamos el error después de unos segundos para que pueda reintentar
      setTimeout(() => this.hasError.set(false), 4000);

      // IMPORTANTE: Aquí NO hay router.navigate, por lo tanto se queda en login
    }
  });
}

  ngOnInit(): void {
    this.title.setTitle('Loggin Page');
    this.meta.updateTag({ name: 'description', content: 'Este es mi Loggin Page' });
    this.meta.updateTag({ name: 'og:title', content: 'Loggin Page' });
    this.meta.updateTag({ name: 'keywords', content: 'Pagina de incio de sesion' });
  }



togglePassword() {
  this.mostrarPassword.update(val => !val);
}
}

