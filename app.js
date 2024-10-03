document.getElementById('analyze-btn').addEventListener('click', async function () {
    const text = document.getElementById('text-input').value.trim();

    // Verifica si el campo de texto no está vacío
    if (text.length === 0) {
        alert("Por favor, ingrese texto para analizar.");
        return;
    }

    try {
        // Hacemos una solicitud GET a la función serverless de Netlify
        const response = await fetch(`/.netlify/functions/analyze?text=${encodeURIComponent(text)}`);

        // Verifica si la solicitud fue exitosa
        if (!response.ok) {
            throw new Error('Error en la solicitud al servidor.');
        }

        const data = await response.json();

        // Lógica para procesar los temas principales extraídos
        if (data.response && data.response.topics) {
            const topics = data.response.topics.map(topic => topic.label);
            displayTopics(topics);
        } else {
            displayTopics(['No se encontraron temas principales.']);
        }

    } catch (error) {
        console.error("Error al analizar el texto:", error);
        alert("Ocurrió un error al procesar el texto. Inténtalo de nuevo.");
    }
});

// Función para mostrar los temas principales en el frontend
function displayTopics(topics) {
    const topicsList = document.getElementById('topics-list');
    topicsList.innerHTML = '';

    topics.forEach(topic => {
        const listItem = document.createElement('li');
        listItem.textContent = topic;
        topicsList.appendChild(listItem);
    });
}
