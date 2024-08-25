 APIWhatsAppV2

Esta es una API de WhatsApp que utiliza la librería whatsapp-web.js y puede enviar mensajes a través de solicitudes HTTP.

## Requisitos

- Node.js (v14 o superior)
- npm

## Instalación

1. Clona este repositorio:
git clone https://github.com/manuelgarcialopez/APIWhatsAppV2.git
cd APIWhatsAppV2
Copy
2. Instala las dependencias:
npm install
Copy
3. Inicia la API:
npm start
Copy
4. Escanea el código QR para autenticar la API. Tienes dos opciones:
- Escanea el QR que aparece en la consola directamente.
- Accede a `http://tu-servidor:3000/qr` desde un navegador para obtener el QR como una imagen SVG.

## Uso

Para enviar un mensaje, realiza una solicitud POST a `http://tu-servidor:3000/send-message` con el siguiente cuerpo JSON:

```json
{
"phone": "1234567890",
"message": "Hola, este es un mensaje de prueba"
}
Ejecución en segundo plano (con PM2)

Instala PM2 globalmente:
Copynpm install -g pm2

Inicia la API con PM2:
Copypm2 start ecosystem.config.js

Configura PM2 para que inicie automáticamente en el arranque:
Copypm2 startup systemd
pm2 save

Para ver los logs y el QR si es necesario:
Copypm2 logs APIWhatsAppV2