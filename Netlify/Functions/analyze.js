const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const apiKey = process.env.TEXT_RAZOR_API_KEY; // Puedes almacenar la clave en variables de entorno en Netlify
    const text = event.queryStringParameters.text; // Obtenemos el texto de la query string

    if (!text) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Por favor, ingresa un texto para analizar.' })
        };
    }

    try {
        const response = await fetch('https://api.textrazor.com/', {
            method: 'POST',
            headers: {
                'x-textrazor-key': apiKey,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `text=${encodeURIComponent(text)}&extractors=topics`,
        });

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error al procesar la solicitud.' })
        };
    }
};
