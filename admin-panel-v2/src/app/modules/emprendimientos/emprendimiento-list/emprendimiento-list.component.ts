import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {Emprendimiento} from '../../../core/models/emprendimiento.model';
import {EmprendimientoService} from '../../../core/services/emprendimiento.service';

@Component({
  selector: 'app-emprendimiento-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './emprendimiento-list.component.html',
  styleUrls: ['./emprendimiento-list.component.scss']
})
export class EmprendimientoListComponent implements OnInit {
  emprendimientos: Emprendimiento[] = [];

  constructor(
    private emprendimientoService: EmprendimientoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.emprendimientoService.getAll().subscribe((data) => {
      console.log('DATA Emprendimiento cargado:', data);
      this.emprendimientos = data;
    });
  }

  reservar(id: number): void {
    console.log('ID a reservar:', id);
    this.router.navigate(['/reservas/crear', id]);
  }
}
