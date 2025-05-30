import { Component, OnInit } from '@angular/core';
import { ReservaService } from '../../../core/services/reserva.service';
import { ReservaResponseDTO } from '../../../core/models/reserva.model';
import Swal from 'sweetalert2';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';


@Component({
  standalone: true,
  selector: 'app-reserva-list',
  templateUrl: './reserva-list.component.html',
  styleUrls: ['./reserva-list.component.scss'],
  imports: [CommonModule, RouterModule]

})
export class ReservaListComponent implements OnInit {
  reservas: ReservaResponseDTO[] = [];
  cargando = true;

  constructor(private reservaService: ReservaService) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.cargando = true;
    this.reservaService.getReservasPorUsuario().subscribe({
      next: (res) => {
        console.log('Reservas cargadas:', this.reservas);
        this.reservas = res;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar reservas:', err);
        this.cargando = false;
        Swal.fire('Error', 'No se pudieron cargar las reservas', 'error');
      }
    });
  }

  cancelarReserva(id: number): void {
    Swal.fire({
      title: '¿Cancelar esta reserva?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservaService.cancelarReserva(id).subscribe({
          next: () => {
            Swal.fire('Cancelado', 'Tu reserva fue cancelada.', 'success');
            this.cargarReservas(); // Recargar lista
          },
          error: () => {
            Swal.fire('Error', 'No se pudo cancelar la reserva', 'error');
          }
        });
      }
    });
  }
}
