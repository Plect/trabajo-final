document.addEventListener('DOMContentLoaded', function() {
    // === FUNCIONALIDAD EXISTENTE: EXPLORAR CONTENIDO (REDIRIGE A JUEGO) Y CAMBIO DE TEMA ===
    // Obtiene el botón para explorar contenido
    const exploreBtn = document.getElementById('contenidoExtenso');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function(event) {
            event.preventDefault(); // Evita el comportamiento por defecto si es un enlace
            // Redirige a la página del juego, como se indica en tu HTML más reciente
            window.location.href = 'pregunta.xml';
        });
    }

    // Obtiene el botón para cambiar el tema
    const toggleThemeBtn = document.getElementById('toggle-theme');
    if (toggleThemeBtn) {
        toggleThemeBtn.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            toggleThemeBtn.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
        });
    }

    // === NUEVA FUNCIONALIDAD: PEDIR NOMBRE Y EDAD ===
    const pedirDatosBtn = document.getElementById('pedirDatosBtn');
    if (pedirDatosBtn) {
        pedirDatosBtn.addEventListener('click', pedirDatosUsuario);
    }

    function pedirDatosUsuario() {
        let nombre = prompt("Por favor, introduce tu nombre:");
        if (nombre === null || nombre.trim() === '') {
            nombre = "Invitado";
        } else {
            nombre = nombre.trim();
        }
        alert(`¡Hola, ${nombre}! Bienvenido/a.`);

        let edad;
        do {
            edad = prompt("Por favor, introduce tu edad:");
        } while (edad === null || isNaN(edad) || parseInt(edad) <= 0);

        edad = parseInt(edad);

        if (edad >= 18) {
            alert("Eres mayor de edad. Puedes acceder a todo el contenido.");
        } else {
            alert("Eres menor de edad. Parte del contenido puede estar restringido para ti.");
        }
    }

    const sumatorioBtn = document.getElementById('sumatorioBtn');
    if (sumatorioBtn) {
        sumatorioBtn.addEventListener('click', realizarSumatorio);
    }

    function realizarSumatorio() {
        let suma = 0;
        let input;
        let continuar = true;

        alert("Vamos a realizar un sumatorio. Introduce números y pulsa 'Cancelar' o deja en blanco para finalizar.");

        while (continuar) {
            input = prompt("Introduce un número para sumar:");

            if (input === null || input.trim() === '') {
                continuar = false;
            } else {
                let numero = parseFloat(input);
                if (!isNaN(numero)) {
                    suma += numero;
                    alert(`Número añadido. Suma actual: ${suma}`);
                } else {
                    alert("Entrada inválida. Por favor, introduce un número.");
                }
            }
        }
        alert(`El sumatorio final es: ${suma}`);
    }

    const gestorPassBtn = document.getElementById('gestorPassBtn');
    if (gestorPassBtn) {
        gestorPassBtn.addEventListener('click', gestorContrasenas);
    }

    let contrasenasGuardadas = {}; // Objeto para "guardar" contraseñas (en memoria de sesión)

    function generarContrasenaFuerte() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
        let password = "";
        const length = 12;

        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    function gestorContrasenas() {
        let opcion = prompt("Gestor de Contraseñas:\n1. Generar nueva contraseña\n2. Guardar contraseña\n3. Ver contraseñas guardadas\n4. Salir");

        switch (opcion) {
            case '1':
                let nuevaPass = generarContrasenaFuerte();
                alert(`Contraseña generada: ${nuevaPass}\n¡Recuerda guardarla de forma segura!`);
                break;
            case '2':
                let sitio = prompt("¿Para qué sitio es esta contraseña?");
                let pass = prompt("Introduce la contraseña a guardar:");
                if (sitio && pass) {
                    contrasenasGuardadas[sitio] = pass;
                    alert(`Contraseña para ${sitio} guardada (¡solo en esta sesión!).`);
                } else {
                    alert("Sitio y contraseña no pueden estar vacíos.");
                }
                break;
            case '3':
                let lista = "Contraseñas Guardadas:\n";
                for (let s in contrasenasGuardadas) {
                    lista += `${s}: ${contrasenasGuardadas[s]}\n`;
                }
                alert(lista || "No hay contraseñas guardadas.");
                break;
            case '4':
                alert("Saliendo del gestor de contraseñas.");
                break;
            default:
                alert("Opción no válida.");
        }
    }

    let carrito = []; // Array para almacenar los ítems del carrito

    function actualizarCarritoUI() {
        const listaCarrito = document.getElementById('lista-carrito');
        const totalCarrito = document.getElementById('total-carrito');

        if (listaCarrito && totalCarrito) {
            listaCarrito.innerHTML = ''; // Limpiar lista actual
            let total = 0;

            carrito.forEach((item, index) => {
                const li = document.createElement('li');
                li.textContent = `${item.nombre} - ${item.precio.toFixed(2)}€`;

                const btnEliminar = document.createElement('button');
                btnEliminar.textContent = 'X';
                btnEliminar.style.marginLeft = '10px';
                btnEliminar.style.backgroundColor = '#dc3545';
                btnEliminar.style.color = 'white';
                btnEliminar.style.border = 'none';
                btnEliminar.style.borderRadius = '3px';
                btnEliminar.style.padding = '3px 8px';
                btnEliminar.style.fontSize = '0.8em';
                btnEliminar.style.cursor = 'pointer';
                btnEliminar.onclick = () => eliminarDelCarrito(index);
                li.appendChild(btnEliminar);

                listaCarrito.appendChild(li);
                total += item.precio;
            });
            totalCarrito.textContent = total.toFixed(2);
        }
    }

    function añadirAlCarrito(nombre, precio) {
        carrito.push({ nombre, precio });
        actualizarCarritoUI();
        alert(`${nombre} añadido al carrito.`);
    }

    function eliminarDelCarrito(index) {
        if (index > -1) {
            const nombreItem = carrito[index].nombre;
            carrito.splice(index, 1);
            actualizarCarritoUI();
            alert(`${nombreItem} eliminado del carrito.`);
        }
    }

    function vaciarCarrito() {
        if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
            carrito = [];
            actualizarCarritoUI();
            alert("Carrito vaciado.");
        }
    }

    // Event listeners para los botones de "añadir al carrito"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productoDiv = this.closest('.producto-item');
            const nombre = productoDiv.dataset.nombre;
            const precio = parseFloat(productoDiv.dataset.precio);
            añadirAlCarrito(nombre, precio);
        });
    });

    // Event listener para el botón "Vaciar Carrito"
    const vaciarBtn = document.getElementById('vaciar-carrito');
    if (vaciarBtn) {
        vaciarBtn.addEventListener('click', vaciarCarrito);
    }

    const registroForm = document.getElementById('registroForm');
    if (registroForm) {
        registroForm.addEventListener('submit', validarFormulario);
    }

    function validarFormulario(event) {
        event.preventDefault(); // Evita el envío por defecto del formulario

        let isValid = true;

        // Obtener elementos
        const nombre = document.getElementById('nombreForm');
        const apellidos = document.getElementById('apellidos');
        const email = document.getElementById('email');
        const telefono = document.getElementById('telefono');
        const password = document.getElementById('password');
        const verificarPassword = document.getElementById('verificarPassword');

        // Obtener elementos de error
        const errorNombre = document.getElementById('errorNombre');
        const errorApellidos = document.getElementById('errorApellidos');
        const errorEmail = document.getElementById('errorEmail');
        const errorTelefono = document.getElementById('errorTelefono');
        const errorPassword = document.getElementById('errorPassword');
        const errorVerificarPassword = document.getElementById('errorVerificarPassword');

        // Resetear mensajes de error
        errorNombre.textContent = '';
        errorApellidos.textContent = '';
        errorEmail.textContent = '';
        errorTelefono.textContent = '';
        errorPassword.textContent = '';
        errorVerificarPassword.textContent = '';

        // Validación de Nombre y Apellidos (no vacíos)
        if (nombre.value.trim() === '') {
            errorNombre.textContent = 'El nombre es obligatorio.';
            isValid = false;
        }
        if (apellidos.value.trim() === '') {
            errorApellidos.textContent = 'Los apellidos son obligatorios.';
            isValid = false;
        }

        // Validación de Email (formato básico)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value.trim() === '') {
            errorEmail.textContent = 'El email es obligatorio.';
            isValid = false;
        } else if (!emailRegex.test(email.value)) {
            errorEmail.textContent = 'El formato del email no es válido.';
            isValid = false;
        }

        // Validación de Teléfono (solo números, opcionalmente con longitud)
        const telefonoRegex = /^\d{9}$/; // Ejemplo: 9 dígitos
        if (telefono.value.trim() !== '' && !telefonoRegex.test(telefono.value)) {
            errorTelefono.textContent = 'El teléfono debe contener 9 dígitos numéricos.';
            isValid = false;
        }

        // Validación de Contraseña (fuerte)
        const passwordValue = password.value;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
        // Mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial
        if (passwordValue.trim() === '') {
            errorPassword.textContent = 'La contraseña es obligatoria.';
            isValid = false;
        } else if (!passwordRegex.test(passwordValue)) {
            errorPassword.textContent = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.';
            isValid = false;
        }

        // Validación de Verificar Contraseña
        if (verificarPassword.value.trim() === '') {
            errorVerificarPassword.textContent = 'Debes verificar la contraseña.';
            isValid = false;
        } else if (passwordValue !== verificarPassword.value) {
            errorVerificarPassword.textContent = 'Las contraseñas no coinciden.';
            isValid = false;
        }

        if (isValid) {
            alert('Formulario enviado con éxito!');
            registroForm.reset(); // Limpiar el formulario después del envío exitoso
        } else {
            alert('Por favor, corrige los errores en el formulario.');
        }
    }
});