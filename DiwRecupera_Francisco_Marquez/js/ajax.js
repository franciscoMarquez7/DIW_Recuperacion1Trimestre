// Función genérica para realizar peticiones AJAX
function ajaxRequest(url, method = 'GET', data = null, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            callback(JSON.parse(xhr.responseText));
        } else {
            console.error('Error en la petición AJAX:', xhr.statusText);
        }
    };
    xhr.onerror = () => {
        console.error('Error de red o servidor no disponible.');
    };
    xhr.send(data ? JSON.stringify(data) : null);
}
