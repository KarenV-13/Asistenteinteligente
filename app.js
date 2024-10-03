const analyzeButton = document.getElementById('analyze-btn');
const recordButton = document.getElementById('record-btn');
const topicsList = document.getElementById('topics-list');
const expandedInfo = document.getElementById('expanded-info');
const textInput = document.getElementById('text-input');
const recordStatus = document.getElementById('record-status');

// API Key de TextRazor
const apiKey = 'ef2980dd510e5ddd0078f498a7a8b3f99ccb5d1d61795f924afa9ce6'; // Reemplaza esto con tu API Key real

// Función para analizar el texto con la API de TextRazor
analyzeButton.addEventListener('click', async function () {
    const text = textInput.value.trim();

    if (text.length === 0) {
        alert("Por favor, ingrese texto para analizar.");
        return;
    }

    // Realiza la solicitud a TextRazor
    const topics = await analyzeTextWithTextRazor(text);

    // Muestra los temas principales
    displayTopics(topics);

    // Ampliación de información (simulada)
    displayExpandedInfo(topics);
});

// Función para hacer la solicitud a la API de TextRazor
async function analyzeTextWithTextRazor(text) {
    const response = await fetch('https://api.textrazor.com/', {
        method: 'POST',
        headers: {
            'x-textrazor-key': apiKey,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `text=${encodeURIComponent(text)}&extractors=topics`,
    });

    const data = await response.json();
    
    // Verificar si la API devolvió correctamente los temas
    if (data.response && data.response.topics) {
        const topics = data.response.topics.map(topic => topic.label);
        return topics;
    } else {
        return ['No se encontraron temas principales.'];
    }
}

// Función para mostrar los temas principales
function displayTopics(topics) {
    topicsList.innerHTML = '';

    topics.forEach(topic => {
        const listItem = document.createElement('li');
        listItem.textContent = topic;
        topicsList.appendChild(listItem);
    });
}

// Función para ampliar la información de los temas (simulada)
async function displayExpandedInfo(topics) {
    expandedInfo.innerHTML = '';

    topics.forEach(topic => {
        const paragraph = document.createElement('p');
        paragraph.textContent = `Información ampliada sobre ${topic}: Este es un breve resumen sobre el tema ${topic}, explicando su importancia y aplicación en el contexto actual.`;
        expandedInfo.appendChild(paragraph);
    });
}

// Función para grabar audio y transcribirlo
let recognition;

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'es-ES';

    recognition.onstart = () => {
        recordStatus.textContent = "Grabando...";
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        textInput.value = transcript;
        recordStatus.textContent = "Grabación finalizada";
    };

    recognition.onerror = () => {
        recordStatus.textContent = "Error en la grabación";
    };

    recognition.onend = () => {
        recordStatus.textContent = "Grabación finalizada";
    };
}

recordButton.addEventListener('click', () => {
    if (recognition) {
        recognition.start();
    } else {
        alert("La API de reconocimiento de voz no es compatible con este navegador.");
    }
});
