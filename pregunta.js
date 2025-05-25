document.addEventListener('DOMContentLoaded', function() {
    // Variables globales para el juego
    let questions = []; // Almacena todas las preguntas del XML
    let currentQuestionIndex = 0; // Índice de la pregunta actual
    let score = 0; // Puntuación del jugador
    const maxQuestions = 10; // Número de preguntas a jugar
    let playedQuestions = []; // Almacena las preguntas seleccionadas para esta partida
    let userAnswers = []; // Almacena las respuestas del usuario para cada pregunta jugada

    // Referencias a elementos del DOM
    const questionTextElement = document.getElementById('question-text');
    const answersContainer = document.getElementById('answers-container');
    const feedbackMessage = document.getElementById('feedback-message');
    const prevQuestionBtn = document.getElementById('prev-question-btn');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const scoreArea = document.getElementById('score-area');
    const finalScoreElement = document.getElementById('final-score');
    const scoreMessageElement = document.getElementById('score-message');
    const restartGameBtn = document.getElementById('restart-game-btn');

    /**
     * Carga las preguntas desde el archivo XML.
     */
    async function loadQuestions() {
        try {
            const response = await fetch('./../pregunta.xml');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");

            // Verifica si el XML tiene errores de parseo
            if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
                console.error("Error parsing XML:", xmlDoc.getElementsByTagName("parsererror")[0].textContent);
                feedbackMessage.textContent = "Error al cargar las preguntas. Revisa el formato de tu XML.";
                return;
            }

            const questionNodes = xmlDoc.getElementsByTagName('pregunta');
            questions = Array.from(questionNodes).map(node => {
                const text = node.getElementsByTagName('texto')[0].textContent;
                const answers = Array.from(node.getElementsByTagName('respuesta')).map(ansNode => ({
                    text: ansNode.textContent,
                    isCorrect: ansNode.getAttribute('correcta') === 'true'
                }));
                return { text, answers };
            });

            if (questions.length === 0) {
                feedbackMessage.textContent = "No se encontraron preguntas en el archivo XML.";
                return;
            }

            initializeGame();

        } catch (error) {
            console.error("Error al cargar o procesar el XML:", error);
            feedbackMessage.textContent = "No se pudieron cargar las preguntas. Asegúrate de que 'pregunta.xml' existe y es válido.";
        }
    }

    /**
     * Inicializa el juego seleccionando preguntas aleatorias.
     */
    function initializeGame() {
        score = 0;
        currentQuestionIndex = 0;
        userAnswers = [];
        playedQuestions = [];
        feedbackMessage.textContent = '';
        scoreArea.classList.add('hidden'); // Oculta el área de puntuación final

        // Selecciona 10 preguntas aleatorias sin repetir (si es posible)
        const availableQuestions = [...questions];
        for (let i = 0; i < maxQuestions; i++) {
            if (availableQuestions.length === 0) {
                // Si no hay suficientes preguntas únicas, se pueden repetir
                playedQuestions.push(questions[Math.floor(Math.random() * questions.length)]);
            } else {
                const randomIndex = Math.floor(Math.random() * availableQuestions.length);
                playedQuestions.push(availableQuestions.splice(randomIndex, 1)[0]);
            }
            userAnswers.push(null); // Inicializa las respuestas del usuario
        }

        displayQuestion(currentQuestionIndex);
        updateNavigationButtons();
    }

    /**
     * Muestra la pregunta actual en la interfaz.
     * @param {number} index El índice de la pregunta a mostrar.
     */
    function displayQuestion(index) {
        // Limpia el contenido anterior
        answersContainer.innerHTML = '';
        feedbackMessage.textContent = '';

        const question = playedQuestions[index];
        questionTextElement.textContent = `Pregunta ${index + 1}/${maxQuestions}: ${question.text}`;

        // Desordena las respuestas para cada pregunta
        const shuffledAnswers = [...question.answers].sort(() => Math.random() - 0.5);

        shuffledAnswers.forEach((answer, ansIndex) => {
            const button = document.createElement('button');
            button.textContent = answer.text;
            button.classList.add('answer-button');
            button.dataset.index = ansIndex; // Guarda el índice original de la respuesta desordenada

            // Si el usuario ya respondió esta pregunta, desactiva los botones y muestra su elección
            if (userAnswers[index] !== null) {
                button.disabled = true;
                if (userAnswers[index] === ansIndex) { // Si esta es la respuesta que el usuario eligió
                    if (answer.isCorrect) {
                        button.classList.add('correct-answer');
                    } else {
                        button.classList.add('incorrect-answer');
                    }
                } else if (answer.isCorrect) { // Muestra la respuesta correcta si el usuario se equivocó
                    button.classList.add('correct-answer-hidden'); // Estilo para mostrar la correcta sin ser la elegida
                }
            } else {
                // Si no ha respondido, añade el event listener
                button.addEventListener('click', () => handleAnswerClick(index, ansIndex, answer.isCorrect));
            }
            answersContainer.appendChild(button);
        });

        updateNavigationButtons();
    }

    /**
     * Maneja el clic en una respuesta.
     * @param {number} qIndex El índice de la pregunta actual.
     * @param {number} ansIndex El índice de la respuesta seleccionada (del array desordenado).
     * @param {boolean} isCorrect Si la respuesta seleccionada es correcta.
     */
    function handleAnswerClick(qIndex, ansIndex, isCorrect) {
        // Desactiva todos los botones de respuesta una vez que se ha elegido una
        Array.from(answersContainer.children).forEach(button => {
            button.disabled = true;
        });

        // Almacena la respuesta del usuario
        userAnswers[qIndex] = ansIndex;

        // Aplica estilos visuales y actualiza la puntuación
        const selectedButton = answersContainer.children[ansIndex]; // Obtiene el botón por su índice en el DOM
        if (isCorrect) {
            score++;
            selectedButton.classList.add('correct-answer');
            feedbackMessage.textContent = '¡Correcto!';
            feedbackMessage.style.color = '#4CAF50'; // Verde
        } else {
            score--;
            selectedButton.classList.add('incorrect-answer');
            feedbackMessage.textContent = '¡Incorrecto!';
            feedbackMessage.style.color = '#F44336'; // Rojo
            // Muestra la respuesta correcta si el usuario se equivocó
            Array.from(answersContainer.children).forEach(button => {
                const originalAnswer = playedQuestions[qIndex].answers[button.dataset.index]; // Obtiene la respuesta original usando el dataset.index
                if (originalAnswer && originalAnswer.isCorrect) {
                    button.classList.add('correct-answer-hidden');
                }
            });
        }

        // Habilita el botón "Siguiente Pregunta" si no es la última pregunta
        if (currentQuestionIndex < maxQuestions - 1) {
            nextQuestionBtn.disabled = false;
        } else {
            // Si es la última pregunta, cambia el texto del botón y lo habilita
            nextQuestionBtn.textContent = 'Ver Puntuación Final';
            nextQuestionBtn.disabled = false;
        }
    }

    /**
     * Actualiza el estado de los botones de navegación.
     */
    function updateNavigationButtons() {
        prevQuestionBtn.disabled = currentQuestionIndex === 0;
        // El botón "Siguiente" solo se habilita si la pregunta actual ha sido respondida
        nextQuestionBtn.disabled = userAnswers[currentQuestionIndex] === null && currentQuestionIndex < maxQuestions -1;

        if (currentQuestionIndex === maxQuestions - 1 && userAnswers[currentQuestionIndex] !== null) {
            nextQuestionBtn.textContent = 'Ver Puntuación Final';
        } else if (currentQuestionIndex < maxQuestions - 1) {
            nextQuestionBtn.textContent = 'Siguiente Pregunta';
        }
    }

    /**
     * Muestra la puntuación final y el mensaje correspondiente.
     */
    function showFinalScore() {
        document.getElementById('question-area').classList.add('hidden');
        document.getElementById('game-controls').classList.add('hidden');
        scoreArea.classList.remove('hidden');

        finalScoreElement.textContent = `Tu puntuación es: ${score} / ${maxQuestions}`;

        let message = '';
        if (score === 0) {
            message = "¡No has acertado ni una! ¡Ánimo, a la próxima será mejor!";
        } else if (score >= 1 && score <= 4) {
            message = "Estás suspenso. ¡Pero no te rindas, sigue practicando!";
        } else if (score === 5) {
            message = "¡Por los pelos! Has aprobado justo. ¡Bien hecho!";
        } else if (score >= 6 && score <= 9) {
            message = "¡Has aprobado! ¡Felicidades, buen trabajo!";
        } else if (score === 10) {
            message = "¡Eres un genio! ¡No fallas ni una! ¡Impresionante!";
        }
        scoreMessageElement.textContent = message;

        // Cambia el botón de "Siguiente Pregunta" a "Volver a Inicio"
        nextQuestionBtn.textContent = 'Volver a Inicio';
        nextQuestionBtn.onclick = () => window.location.href = 'index.html';
        nextQuestionBtn.disabled = false; // Asegurarse de que esté habilitado
    }

    // Event Listeners para los botones de navegación
    prevQuestionBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayQuestion(currentQuestionIndex);
        }
    });

    nextQuestionBtn.addEventListener('click', () => {
        if (currentQuestionIndex < maxQuestions - 1) {
            currentQuestionIndex++;
            displayQuestion(currentQuestionIndex);
        } else {
            // Si es la última pregunta y se ha respondido, muestra la puntuación final
            if (userAnswers[currentQuestionIndex] !== null) {
                showFinalScore();
            } else {
                // Si no se ha respondido la última pregunta, no hace nada o muestra un mensaje
                feedbackMessage.textContent = "Por favor, responde la pregunta actual antes de continuar.";
                feedbackMessage.style.color = '#FFA500'; // Naranja
            }
        }
    });

    restartGameBtn.addEventListener('click', initializeGame);

    // Carga las preguntas al iniciar la página
    loadQuestions();
});
