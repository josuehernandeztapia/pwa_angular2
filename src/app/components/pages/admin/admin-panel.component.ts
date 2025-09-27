import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserActivityLog, UserMetrics, UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent {
  usuarios: any[] = [];
  metrics?: UserMetrics;
  activityLogs: UserActivityLog[] = [];
  logsLimit = 20;
  // Simple role handling for demo purposes
  Role: Record<string, string> = { admin: 'admin', supervisor: 'supervisor', asesor: 'asesor', viewer: 'viewer' };
  currentUserRole: 'admin' | 'supervisor' | 'asesor' | 'viewer' = 'asesor';

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit() {
    this.usuariosService.getUsuarios().subscribe((data: any[]) => {
      this.usuarios = data;
    });
    this.usuariosService.getMetrics().subscribe((m: UserMetrics) => (this.metrics = m));
    this.usuariosService.getActivityLogs(this.logsLimit).subscribe((logs: UserActivityLog[]) => (this.activityLogs = logs));
    // Load current user role from localStorage if present
    try {
      const userRaw = localStorage.getItem('current_user');
      if (userRaw) {
        const user = JSON.parse(userRaw);
        if (user?.role && ['admin', 'supervisor', 'asesor', 'viewer'].includes(user.role)) {
          this.currentUserRole = user.role;
        }
      }
    } catch {}
  }

  crearUsuario() {
    if (this.isReadOnly()) return;
  }

  editarUsuario(usuario: any) {
    if (this.isReadOnly()) return;
  }

  bloquearUsuario(usuario: any) {
    if (this.isReadOnly()) return;
    this.usuariosService.toggleUsuario(usuario.id, !usuario.activo).subscribe();
  }

  isReadOnly(): boolean {
    return this.currentUserRole === 'supervisor' || this.currentUserRole === 'viewer';
  }
}

