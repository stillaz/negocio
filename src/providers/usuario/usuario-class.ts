export class Usuario {
    constructor(
        public idusuario: number,
        public nombre: string,
        public clave: string,
        public perfil: string,
        public idpersona: number,
        public activo: boolean
    ){}
}