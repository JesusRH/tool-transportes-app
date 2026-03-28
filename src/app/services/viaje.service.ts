import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {
  // En Angular 18 usamos 'inject' en lugar del constructor para que sea más limpio
  private http = inject(HttpClient);

  // URL de tu backend en Node.js
  private apiUrl = 'http://192.168.1.226:3000/api/viajes';

  /**
   * Obtiene la lista completa de viajes con los JOINs de empresas,
   * tractos, operadores y minas.
   */
  getViajes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Ejemplo de cómo podrías guardar un nuevo viaje más adelante
   */
  crearViaje(datosViaje: any): Observable<any> {
    return this.http.post(this.apiUrl, datosViaje);
  }
}
