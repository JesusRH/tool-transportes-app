import { HttpClient } from '@angular/common/http'; // Importante
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Esta es la dirección de tu servidor de Node.js
  private API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Método para el Login
  login(credenciales: any) {
    return this.http.post(`${this.API_URL}/login`, credenciales);
  }

  // Método para listar una tabla de MySQL (ejemplo: productos)
  /*obtenerTablas() {
    return this.http.get(`${this.API_URL}/productos`);
  }*/
}
