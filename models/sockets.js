const BandList = require("./band-list");

class Sockets {
  constructor(io) {
    this.io = io;
    this.bandList = new BandList();
    this.socketEvents();
  }

  socketEvents() {
    // On connection
    this.io.on("connection", (socket) => {
      console.log("Cliente conectado");

      // Emitir al cliente conectado las bandas actuales
      socket.emit('current-bands', this.bandList.getBands() );

      // Votar por la banda
      socket.on('votar-banda', (id) => {
        this.bandList.increaseVotes(id);        
        this.io.emit('current-bands', this.bandList.getBands() );// se vuelve a emitir debido a que si no secoloca esta instruccion hay que recargar el navegador para que se pueda interpretar
      })

      // Borrar bandas
      socket.on('borrar-banda', (id) => {
        this.bandList.removeBand(id)
        this.io.emit('current-bands', this.bandList.getBands() );
      })

      //Cambiar nombre
      socket.on('cambiar-nombre-banda', band => {    
        this.bandList.changeName(band.id, band.nombre);
        this.io.emit('current-bands', this.bandList.getBands() );
      })

      //Agregar Banda
      socket.on('nueva-banda', ({nombre}) => {
        this.bandList.addband(nombre);
        this.io.emit('current-bands', this.bandList.getBands());
      })
    });
  }
}

module.exports = Sockets;
