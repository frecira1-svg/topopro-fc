export type TipoPublicacion = 'NOTICIA' | 'COMUNIDAD';

export interface UsuarioPublicacion {

    id: number;

    nombre: string;

    apellido?: string;

    foto?: string | null;

}

export interface Comentario {

    id: number;

    contenido: string;

    usuarioId: number;

    publicacionId: number;

    createdAt: string;

    usuario: UsuarioPublicacion;

}

export interface Publicacion {

    id: number;

    titulo: string;

    contenido: string;

    tipo: TipoPublicacion;

    imagen?: string;

    usuarioId: number;

    createdAt: string;

    updatedAt: string;

    usuario: UsuarioPublicacion;

    comentarios?: Comentario[];

    _count?: {

        comentarios: number;

    };

}

export interface PublicacionRequest {

    titulo: string;

    contenido: string;

    tipo?: TipoPublicacion;

    imagen?: string;

}

export interface ComentarioRequest {

    contenido: string;

}
