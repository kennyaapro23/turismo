import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ReservaService } from '../../../core/services/reserva.service';
import { CommonModule } from '@angular/common';


import Swal from 'sweetalert2';
import {CrearReservaRequest} from '../../../core/models/reserva.model';

@Component({
  standalone: true,
  selector: 'app-reserva-form',
  templateUrl: './reserva-form.component.html',
  styleUrls: ['./reserva-form.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
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
    });
  }

  reservar(): void {
    if (this.form.invalid) return;

    const data: CrearReservaRequest = {
      ...this.form.value,
      emprendimientoId: this.emprendimientoId,
    };

    this.reservaService.crearReserva(data).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Reserva exitosa',
          text: `Reservaste en: ${res.nombreEmprendimiento}`,
          confirmButtonText: 'OK',
        }).then(() => {
          this.router.navigate(['/reservas']); // o donde desees redirigir
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo completar la reserva.',
        });
      },
    });
  }
}
