export class Venta {
    constructor(
        public idVenta: number,
        public fecha: Date,
        public idCliente: number,
        public idUsuario: number,
        public detalle: any[]
    ){}
}