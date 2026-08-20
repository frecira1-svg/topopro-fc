import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Usuario, AuthResponse, LoginRequest, RegistroRequest } from '../models/usuario.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'topopro_token';
  private readonly USUARIO_KEY = 'topopro_usuario';

  usuarioActual = signal<Usuario | null>(this.obtenerUsuarioGuardado());

  constructor(private http: HttpClient) {}

  registrar(datos: RegistroRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/registro`, datos).pipe(
      tap(respuesta => this.guardarSesion(respuesta))
    );
  }

  login(datos: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, datos).pipe(
      tap(respuesta => this.guardarSesion(respuesta))
    );
  }

  obtenerPerfil(): Observable<{ usuario: Usuario }> {
    return this.http.get<{ usuario: Usuario }>(`${this.API_URL}/perfil`);
  }

  actualizarPerfil(datos: Partial<Usuario>): Observable<{ usuario: Usuario }> {
    return this.http.put<{ usuario: Usuario }>(`${this.API_URL}/perfil`, datos).pipe(
      tap(respuesta => this.actualizarUsuarioLocal(respuesta.usuario))
    );
  }

  subirFoto(archivo: File): Observable<{ usuario: Usuario }> {
    const formData = new FormData();
    formData.append('foto', archivo);
    return this.http.put<{ usuario: Usuario }>(`${this.API_URL}/perfil/foto`, formData).pipe(
      tap(respuesta => this.actualizarUsuarioLocal(respuesta.usuario))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USUARIO_KEY);
    this.usuarioActual.set(null);
  }

  obtenerToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  estaAutenticado(): boolean {
    return !!this.obtenerToken();
  }

  private guardarSesion(respuesta: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, respuesta.token);
    localStorage.setItem(this.USUARIO_KEY, JSON.stringify(respuesta.usuario));
    this.usuarioActual.set(respuesta.usuario);
  }

  private actualizarUsuarioLocal(usuario: Usuario): void {
    localStorage.setItem(this.USUARIO_KEY, JSON.stringify(usuario));
    this.usuarioActual.set(usuario);
  }

  private obtenerUsuarioGuardado(): Usuario | null {
    const data = localStorage.getItem(this.USUARIO_KEY);
    return data ? JSON.parse(data) : null;
  }
}
