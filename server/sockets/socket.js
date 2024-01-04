const { io } = require('../server');

const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utilidades');

const usuarios = new Usuarios();


io.on('connection', (client) => {

    //console.log('Usuario conectado');
    client.on('entrarChat', (data, callback) => {

        if ( !data.nombre ) {
            return callback({
                error: true,
                mensaje: 'El nombre es necesario',
            })
        }

        let personas = usuarios.agregarPersona( client.id, data.nombre );

        client.broadcast.emit('listaPersonas', usuarios.getPersonasporSala());

        callback( personas );
    });


    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona( client.id );

        console.log(personaBorrada);

        client.broadcast.emit( 'crearMensaje', { usuario: 'Administrador', mensaje: `${ personaBorrada.nombre } abandonó el chat.`})
        client.broadcast.emit( 'listaPersonas', usuarios.getPersonasporSala());
    })

    client.on( 'crearMensaje', ( data ) => {

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje( persona, data.mensaje );
        client.broadcast.emit( 'crearMensaje', mensaje );
    })


});