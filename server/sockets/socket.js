const { io } = require('../server');

const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utilidades');

const usuarios = new Usuarios();


io.on('connection', (client) => {

    //console.log('Usuario conectado');
    client.on('entrarChat', (data, callback) => {

        if ( !data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario',
            })
        }

        client.join(data.sala);

        usuarios.agregarPersona( client.id, data.nombre, data.sala );

        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonasporSala());

        callback( usuarios.getPersonasporSala( data.sala ) );
    });


    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona( client.id );

        console.log(personaBorrada);

        client.broadcast.to(personaBorrada.sala).emit( 'crearMensaje', { usuario: 'Administrador', mensaje: `${ personaBorrada.nombre } abandonó el chat.`})
        client.broadcast.to(personaBorrada.sala).emit( 'listaPersonas', usuarios.getPersonasporSala());
    })

    client.on( 'crearMensaje', ( data, callback ) => {

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje( persona, data.mensaje );
        client.broadcast.to(persona.sala).emit( 'crearMensaje', mensaje );

        callback( mensaje );
    })

    // Mensajes privados
    client.on('mensajePrivado', data => {

        let persona = usuarios.getPersona( client.id );

        client.broadcast.to(data.para).emit( 'mensajePrivado', crearMensaje( persona.nombre, data.mensaje ));

    })


});