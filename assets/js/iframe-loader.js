// Variable global para almacenar los loaders asociados a cada player ID
var playerLoaders = {};

// 1. Cargar la API de YouTube IFrame Player de forma asíncrona.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 2. Esta función se llamará automáticamente cuando la API esté lista.
function onYouTubeIframeAPIReady() {
    // Seleccionar todos los placeholders para los videos
    const videoPlaceholders = document.querySelectorAll('.youtube-player');

    videoPlaceholders.forEach(placeholder => {
        const videoId = placeholder.dataset.videoId;
        const playerId = placeholder.id; // Usaremos el ID del div como ID del player

        // Crear el div del loader
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading'; // Reutilizamos la clase CSS existente
        loadingDiv.innerHTML = '<div class="spinner"></div>'; // Reutilizamos el spinner
        placeholder.parentNode.insertBefore(loadingDiv, placeholder); // Insertar antes del placeholder

        // Guardar referencia al loader
        playerLoaders[playerId] = loadingDiv;

        // Crear la instancia del reproductor
        new YT.Player(playerId, {
            height: '315', // Puedes ajustar esto o hacerlo responsivo con CSS
            width: '560',  // Puedes ajustar esto o hacerlo responsivo con CSS
            videoId: videoId,
            playerVars: {
                'rel': 0 // Añadir esto para limitar los videos relacionados
            },
            events: {
                'onReady': onPlayerReady,
                'onError': onPlayerError
                // Podrías añadir más eventos como 'onStateChange' si es necesario
            }
        });
    });
}

// 3. La API llamará a esta función cuando el reproductor esté listo.
function onPlayerReady(event) {
    // console.log('Player ready:', event.target.getIframe().id); // Eliminado
    const playerId = event.target.getIframe().id;
    if (playerLoaders[playerId]) {
        playerLoaders[playerId].style.display = 'none'; // Ocultar el loader
    }
}

// 4. La API llamará a esta función si ocurre un error.
function onPlayerError(event) {
    // console.error('Player error:', event.data, 'Player ID:', event.target.getIframe().id); // Eliminado
    const playerId = event.target.getIframe().id;
    if (playerLoaders[playerId]) {
        playerLoaders[playerId].style.display = 'none'; // Ocultar el loader también en caso de error
        // Opcional: Mantener comentado
        // playerLoaders[playerId].innerHTML = 'Error al cargar el video.'; // Opcional: Mantener comentado
    }
} 