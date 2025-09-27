import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IntegracionesService } from '../../../services/integraciones.service';

@Component({
  selector: 'app-integraciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './integraciones.component.html',
  styleUrls: ['./integraciones.component.scss']
})
export class IntegracionesComponent {
  integraciones: any[] = [];

  constructor(private integracionesService: IntegracionesService) {}

  ngOnInit() {
    this.integracionesService.getIntegraciones().subscribe((data: any[]) => {
      this.integraciones = data;
    });
  }

  toggle(integracion: any) {
    this.integracionesService.toggleIntegracion(integracion.id).subscribe();
  }
}

