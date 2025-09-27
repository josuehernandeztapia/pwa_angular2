import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IntegracionesService, IntegrationLog, IntegrationStatusMetrics } from '../../../services/integraciones.service';

@Component({
  selector: 'app-integraciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './integraciones.component.html',
  styleUrls: ['./integraciones.component.scss']
})
export class IntegracionesComponent {
  integraciones: any[] = [];
  metrics?: IntegrationStatusMetrics;
  recentLogs: IntegrationLog[] = [];
  logsLimit = 20;

  constructor(private integracionesService: IntegracionesService) {}

  ngOnInit() {
    this.integracionesService.getIntegraciones().subscribe((data: any[]) => {
      this.integraciones = data;
    });
    this.integracionesService.getStatus().subscribe((m: IntegrationStatusMetrics) => {
      this.metrics = m;
    });
    this.integracionesService.getRecentLogs(this.logsLimit).subscribe((logs: IntegrationLog[]) => {
      this.recentLogs = logs;
    });
  }

  toggle(integracion: any) {
    this.integracionesService.toggleIntegracion(integracion.id).subscribe();
  }
}

