const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@adiwajshing/baileys');
const express = require('express');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { promisify } = require('util');

const writeFileAsync = promisify(fs.writeFile);

const app = express();
app.use(express.json());

let sock;

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    
    sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if(connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
            if(shouldReconnect) {
                connectToWhatsApp();
            }
        } else if(connection === 'open') {
            console.log('opened connection');
        }
    });

    sock.ev.on('creds.update', saveCreds);
}

app.post('/send-message', async (req, res) => {
    const { phone, message } = req.body;
    try {
        await sock.sendMessage(`${phone}@s.whatsapp.net`, { text: message });
        res.status(200).json({ success: true, message: 'Mensaje enviado' });
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        res.status(500).json({ success: false, message: 'Error al enviar mensaje' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`APIWhatsAppV2 corriendo en puerto ${PORT}`));

connectToWhatsApp();
