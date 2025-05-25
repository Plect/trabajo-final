document.addEventListener('DOMContentLoaded', function() {
    // Obtiene el botón para explorar contenido
    const exploreBtn = document.getElementById('contenidoExtenso');
    // Verifica si el botón existe antes de añadir el event listener
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function() {
            // Redirige a la página pregunta.xml
            window.location.href = 'pregunta.xml';
        });
    }

    // Obtiene el botón para cambiar el tema
    const toggleThemeBtn = document.getElementById('toggle-theme');
    // Verifica si el botón existe antes de añadir el event listener
    if (toggleThemeBtn) {
        toggleThemeBtn.addEventListener('click', function() {
            // Alterna la clase 'dark-theme' en el cuerpo del documento
            document.body.classList.toggle('dark-theme');
            // Cambia el texto del botón basado en si el tema oscuro está activo
            toggleThemeBtn.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
        });
    }
});
