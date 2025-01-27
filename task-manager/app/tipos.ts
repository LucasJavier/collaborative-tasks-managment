import { DateTime } from "next-auth/providers/kakao";

export interface Rol {
    id: number;
    nombre: string;
    descripcion: string;
}

export interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    nombreUsuario: string;
    email: string;
    password: string;
    rolID?: number;
}

export interface Equipo {
    id: number;
    nombre: string;
    creadoEn: DateTime; 
    idJefe: number;
    codigoInvitacion?: string | null
    codigoExpiracion?: DateTime | null
    usuarioJefe: Usuario
}

export enum Prioridad {
    baja = "baja",
    media = "media",
    alta = "alta"
}

export interface Tarea {
    id?: number;
    titulo: string;
    descripcion?: string; 
    completada?: boolean | false;
    equipoId: number;
    prioridad: Prioridad;
    fechaLimite: DateTime;
    usuarioIdCreo: number;
    usuario?: Usuario;
    equipo?: Equipo;
}

export interface UsuarioEquipo {
    id: number;
    usuarioId: number;
    equipoId: number;
}

export interface Comentario{
    id: number;
    usuarioId?: number;
    tareaId?: number;
    comentario: string;
    fechaComentario?: DateTime;
    usuario?: Usuario;
}