

class Usuarios {

    constructor() {
        this.personas = [];
    }

    agregarPersona( id, nombre )  {

        let persona = { id, nombre };

        this.personas.push( persona );

        return this.personas;
    }

    getPersona( id ) {
        let persona = this.personas.filter( persona => persona.id === id)[0];

        return persona;
    }

    gerPersonas() {
        return this.personas;
    }

    getPersonasporSala( sala ) {
        // TODO
    }

    borrarPersona( id ) {

        let personaBorrada = this.getPersona(id);

        this.personas = this.personas.filter( persona.id != id);

        return personaBorrada;
    }

}

module.exports = {
    Usuarios
}

