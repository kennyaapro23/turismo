import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ReservaService } from '../../../core/services/reserva.service';
import { CrearReservaRequest } from '../../../core/models/reserva.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reserva-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reserva-form.component.html',
  styleUrls: ['./reserva-form.component.scss']
})
export class ReservaFormComponent implements OnInit {
  form!: FormGroup;
  emprendimientoId!: number;

  constructor(
    private fb: FormBuilder,
    private reservaService: ReservaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.emprendimientoId = +this.route.snapshot.paramMap.get('id')!;
    this.form = this.fb.group({
      fecha: ['', Validators.required],
      cantidadPersonas: [1, [Validators.required, Validators.min(1)]],
      observaciones: ['']
    });
  }

  reservar(): void {
    if (this.form.invalid) {
      console.warn('Formulario inválido');
      return;
    }

    const fecha = this.form.value.fecha;
    const payload: CrearReservaRequest = {
      idEmprendimiento: this.emprendimientoId,
      fechaHoraInicio: `${fecha}T14:00:00`,
      fechaHoraFin: `${fecha}T11:00:00`,
      detalles: [
        {
          idServicioTuristico: 1,
          cantidad: this.form.value.cantidadPersonas,
          observaciones: this.form.value.observaciones || ''
        }
      ]
    };

    this.reservaService.crearReserva(payload).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Reserva exitosa',
          text: `Reservaste en: ${res.nombreEmprendimiento}`,
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/reservas']);
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo completar la reserva.'
        });
      }
    });
  }
}
