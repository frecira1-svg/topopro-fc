import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { Cliente } from '../../models/cliente';
import { ClientesService } from '../../services/clientes';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class Clientes implements OnInit {

  private clientesService = inject(ClientesService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  clientes: Cliente[] = [];

  cargando = true;

  mostrarFormulario = false;

  editando = false;

  clienteId: number | null = null;

  formulario: FormGroup = this.fb.group({

    nombre: ['', Validators.required],

    nit: [''],

    telefono: [''],

    correo: ['', Validators.email],

    direccion: [''],

    ciudad: [''],

    contacto: ['']

   });

  get ciudadesUnicas(): number {
    return new Set(this.clientes.map(c => c.ciudad).filter(c => !!c)).size;
  }

  get contactosRegistrados(): number {
    return this.clientes.filter(c => !!c.contacto).length;
  }

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {

    this.cargando = true;

    this.clientesService.obtenerClientes().subscribe({

      next: (respuesta: Cliente[]) => {

        this.clientes = respuesta;
        this.cargando = false;

      },

      error: (error: any) => {

        console.error(error);
        this.cargando = false;

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.error || 'No se pudieron cargar los clientes.'
        });

      }

    });

  }

  nuevoCliente(): void {

    this.editando = false;

    this.clienteId = null;

    this.formulario.reset();

    this.mostrarFormulario = true;

  }

  editarCliente(cliente: Cliente): void {

    this.editando = true;

    this.clienteId = cliente.id ?? null;

    this.formulario.patchValue(cliente);

    this.mostrarFormulario = true;

  }

  guardarCliente(): void {

    if (this.formulario.invalid) {

      this.formulario.markAllAsTouched();

      this.messageService.add({
        severity: 'warn',
        summary: 'Datos incompletos',
        detail: 'Revisa los campos obligatorios del formulario.'
      });

      return;

    }

    const datos: Cliente = this.formulario.value;

    if (this.editando && this.clienteId) {

      this.clientesService.actualizarCliente(this.clienteId, datos).subscribe({

        next: () => {

          this.mostrarFormulario = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cliente actualizado correctamente.'
          });

          this.cargarClientes();

        },

        error: (error: any) => {

          console.error(error);

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.error || 'No se pudo actualizar el cliente.'
          });

        }

      });

    } else {

      this.clientesService.crearCliente(datos).subscribe({

        next: () => {

          this.mostrarFormulario = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cliente creado correctamente.'
          });

          this.cargarClientes();

        },

        error: (error: any) => {

          console.error(error);

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.error || 'No se pudo crear el cliente.'
          });

        }

      });

    }

  }

  eliminarCliente(cliente: Cliente): void {

    if (!cliente.id) return;

    if (!confirm(`¿Eliminar el cliente "${cliente.nombre}"?`)) return;

    this.clientesService.eliminarCliente(cliente.id).subscribe({

      next: () => {

        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Cliente eliminado correctamente.'
        });

        this.cargarClientes();

      },

      error: (error: any) => {

        console.error(error);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.error || 'No se pudo eliminar el cliente.'
        });

      }

    });

  }

  cancelar(): void {

    this.mostrarFormulario = false;

    this.formulario.reset();

  }

}
