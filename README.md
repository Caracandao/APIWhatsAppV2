# WhatsApp Chatbot

Este es un chatbot de WhatsApp que utiliza la librería Baileys y permite enviar mensajes a través de una API HTTP.

## Instalación

1. Clona este repositorio
2. Ejecuta `npm install` para instalar las dependencias
3. Ejecuta `node index.js` para iniciar el servidor

## Uso

Envía una solicitud POST a `http://localhost:3000/send-message` con el siguiente formato JSON:

{
  "phone": "1234567890",
  "message": "Hola, este es un mensaje de prueba"
}

El número de teléfono debe incluir el código de país sin el signo '+'.