document.addEventListener('DOMContentLoaded', function () {
    const personaForm = document.getElementById('personaForm');
    const tablaPersonas = document.getElementById('tablaPersonas').getElementsByTagName('tbody')[0];

    if (!personaForm) {
        console.error("Formulario no encontrado");
        return;
    }

    // Cargar la lista de personas al cargar la página
    cargarPersonas();

    // Manejar el envío del formulario
    personaForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const idInput = document.getElementById('id_persona');
        const id_persona = idInput ? idInput.value.trim() : null;
        const nombre = document.getElementById('nombre').value.trim();
        const apellido = document.getElementById('apellido').value.trim();
        const edad = document.getElementById('edad').value.trim();

        const persona = { nombre, apellido, edad };

        if (id_persona) {
            editarPersona(id_persona, persona);
        } else {
            crearPersona(persona);
        }

        // Limpiar formulario después de enviar
        personaForm.reset();
        if (idInput) idInput.value = ""; 
    });

    // Función para cargar la lista de personas
    function cargarPersonas() {
        fetch('http://localhost:8080/personas/traer')
            .then(response => response.json())  
            .then(data => {
                tablaPersonas.innerHTML = '';
                data.forEach(persona => {
                    const row = tablaPersonas.insertRow();
                    row.innerHTML = `
                        <td>${persona.id_persona}</td>
                        <td>${persona.nombre}</td>
                        <td>${persona.apellido}</td>
                        <td>${persona.edad}</td>
                        <td class="acciones">
                            <button class="editar" onclick="editar(${persona.id_persona})">Editar</button>
                            <button class="eliminar" onclick="eliminar(${persona.id_persona})">Eliminar</button>
                        </td>
                    `;
                });
            })
            .catch(error => console.error('Error al cargar personas:', error));
    }
    
    // Función para crear una persona 
    function crearPersona(persona) {
        fetch('http://localhost:8080/personas/crear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(persona)
        })
        .then(response => response.text())
        .then(() => {
            cargarPersonas();
        })
        .catch(error => console.error('Error al crear persona:', error));
    }

    // Función para editar una persona
    function editarPersona(id_persona, persona) {
        fetch(`http://localhost:8080/personas/editar/${id_persona}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(persona)
        })
        .then(response => response.text())
        .then(() => {
            cargarPersonas();
        })
        .catch(error => console.error('Error al editar persona:', error));
    }

    // Función para eliminar una persona
    window.eliminar = function (id_persona) {
        fetch(`http://localhost:8080/personas/borrar/${id_persona}`, {
            method: 'DELETE'
        })
        .then(() => {
            cargarPersonas();
        })
        .catch(error => console.error('Error al eliminar persona:', error));
    };

    // Función para cargar los datos de una persona en el formulario para editar
    window.editar = function (id_persona) {
        fetch(`http://localhost:8080/personas/traer/${id_persona}`)
            .then(response => response.json()) 
            .then(persona => {
                document.getElementById('id_persona').value = persona.id_persona;
                document.getElementById('nombre').value = persona.nombre;
                document.getElementById('apellido').value = persona.apellido;
                document.getElementById('edad').value = persona.edad;
            })
            .catch(error => console.error('Error al cargar persona para editar:', error));
    };
});
