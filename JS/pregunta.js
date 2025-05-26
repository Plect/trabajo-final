let preguntas = [];
let preguntasAleatorias = [];
let preguntaActual = 0;
let puntuacion = 0;

window.onload = function () {
    cargarPreguntas();
};

function cargarPreguntas() {
    fetch("pregunta.xml")
        .then(response => response.text())
        .then(data => {
            let parser = new DOMParser();
            let xml = parser.parseFromString(data, "application/xml");
            let items = xml.getElementsByTagName("pregunta");

            for (let i = 0; i < items.length; i++) {
                let enunciado = items[i].getElementsByTagName("enunciado")[0].textContent;
                let respuestas = [];
                for (let j = 0; j < 4; j++) {
                    respuestas.push({
                        texto: items[i].getElementsByTagName("respuesta")[j].textContent,
                        // Aquí es donde cambiamos 'si' por 'sí' para que coincida con tu XML
                        correcta: items[i].getElementsByTagName("respuesta")[j].getAttribute("correcta") === "sí" 
                    });
                }

                preguntas.push({ enunciado, respuestas });
            }

            // Mezclar y elegir 10 preguntas aleatorias
            preguntasAleatorias = preguntas.sort(() => 0.5 - Math.random()).slice(0, 10);
            mostrarPregunta();
        });
}

function mostrarPregunta() {
    let pregunta = preguntasAleatorias[preguntaActual];
    document.getElementById("enunciado").textContent = pregunta.enunciado;

    const contenedor = document.getElementById("respuestas");
    contenedor.innerHTML = "";

    pregunta.respuestas.forEach((resp) => {
        let boton = document.createElement("button");
        boton.textContent = resp.texto;
        boton.className = "respuesta";
        boton.dataset.correcta = resp.correcta ? "true" : "false";
        boton.onclick = () => seleccionarRespuesta(resp.correcta, boton);
        contenedor.appendChild(boton);
    });

    actualizarBotones();
    actualizarPuntaje();
}

function seleccionarRespuesta(correcta, botonSeleccionado) {
    const botones = document.querySelectorAll(".respuesta");

    botones.forEach(btn => {
        btn.disabled = true;
        const esCorrecta = btn.dataset.correcta === "true";

        if (btn === botonSeleccionado) {
            if (correcta) {
                btn.style.backgroundColor = "#4CAF50"; // Verde
                puntuacion++;
            } else {
                btn.style.backgroundColor = "#F44336"; // Rojo
            }
        }

        if (!correcta && esCorrecta) {
            btn.style.backgroundColor = "#4CAF50";
        }
    });

    actualizarPuntaje();
}

function siguientePregunta() {
    if (preguntaActual < 9) {
        preguntaActual++;
        mostrarPregunta();
    } else {
        // Mostrar mensaje final con puntuación
        document.body.innerHTML = `
            <h1>¡Has completado el juego!</h1>
            <h2>Tu puntuación final es: ${puntuacion} / ${preguntasAleatorias.length}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nota</th>
                        <th>Mensaje</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>0</td>
                        <td>¡Has fallado todas!</td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>¡Mucho ánimo! Hay mucho por mejorar.</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>No te rindas, con esfuerzo puedes superarlo.</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>Sigue trabajando, la mejora está cerca.</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>Estás cerca de la meta, ¡un último empujón!</td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td>Aprobado justo. Revisa y refuerza los puntos débiles.</td>
                    </tr>
                    <tr>
                        <td>6</td>
                        <td>Bien hecho, ¡sigue así!</td>
                    </tr>
                    <tr>
                        <td>7</td>
                        <td>Buen resultado, estás en el camino correcto.</td>
                    </tr>
                    <tr>
                        <td>8</td>
                        <td>¡Excelente trabajo! Un rendimiento muy bueno.</td>
                    </tr>
                    <tr>
                        <td>9</td>
                        <td>¡Casi perfecto! Un esfuerzo sobresaliente.</td>
                    </tr>
                    <tr>
                        <td>10</td>
                        <td>¡Felicidades! Un resultado impecable.</td>
                    </tr>
                </tbody>
            </table>
            <button onclick="location.href='Index.html'">Volver al inicio</button>
        `;
    }
}

function preguntaAnterior() {
    if (preguntaActual > 0) {
        preguntaActual--;
        mostrarPregunta();
    }
}

function actualizarBotones() {
    document.getElementById("anterior").disabled = preguntaActual === 0;

    let siguienteBtn = document.getElementById("siguiente");
    siguienteBtn.textContent = (preguntaActual === 9) ? "Finalizar" : "Siguiente pregunta";
}

function actualizarPuntaje() {
    document.getElementById("puntaje").textContent = `Puntuación: ${puntuacion} / ${preguntasAleatorias.length}`;
}