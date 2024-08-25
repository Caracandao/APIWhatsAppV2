const { WAConnection, MessageType } = require('@adiwajshing/baileys');
const express = require('express');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(express.json());

const conn = new WAConnection();

conn.on('qr', (qr) => {
    console.log('Escanea el siguiente código QR para iniciar sesión:');
    qrcode.generate(qr, {small: true});
});

conn.on('open', () => {
    console.log('Conexión establecida');
});

app.post('/send-message', async (req, res) => {
    const { phone, message } = req.body;
    try {
        await conn.sendMessage(`${phone}@s.whatsapp.net`, message, MessageType.text);
        res.status(200).json({ success: true, message: 'Mensaje enviado' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al enviar mensaje' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`APIWhatsAppV2 corriendo en puerto ${PORT}`));

conn.connect();