import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent {
  usuarios: any[] = [];

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit() {
    this.usuariosService.getUsuarios().subscribe((data: any[]) => {
      this.usuarios = data;
    });
  }

  crearUsuario() {}

  editarUsuario(usuario: any) {}

  bloquearUsuario(usuario: any) {
    this.usuariosService.toggleUsuario(usuario.id, !usuario.activo).subscribe();
  }
}

