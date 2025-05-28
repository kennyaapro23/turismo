import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import {ReservaService} from '../../../core/services/reserva.service';
import {CrearReservaRequest} from '../../../core/models/reserva.model';

@Component({
  selector: 'app-reserva-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reserva-list.component.html',
  styleUrls: ['./reserva-list.component.scss']
})
export class ReservaListComponent implements OnInit {
  form!: FormGroup;
  emprendimientoId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private reservaService: ReservaService
  ) {}

  ngOnInit(): void {
    this.emprendimientoId = +this.route.snapshot.paramMap.get('id')!;
    this.form = this.fb.group({
      fecha: ['', Validators.required],
      cantidadPersonas: [1, [Validators.required, Validators.min(1)]]
    });
  }

  reservar(): void {
    if (this.form.invalid) return;

    const dto: CrearReservaRequest = {
      emprendimientoId: this.emprendimientoId,
      ...this.form.value
    };

    this.reservaService.crearReserva(dto).subscribe({
      next: res => alert(`✅ Reserva realizada para ${res.nombreEmprendimiento}`),
      error: err => alert('❌ Error al reservar')
    });
  }
}
