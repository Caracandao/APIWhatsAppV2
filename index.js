const { default: makeWASocket, useSingleFileAuthState, DisconnectReason } = require('@adiwajshing/baileys');
const { Boom } = require('@hapi/boom');
const express = require('express');
const qrcode = require('qrcode-terminal');
const { unlinkSync } = require('fs');
const { makeInMemoryStore } = require('@adiwajshing/baileys');

const app = express();
app.use(express.json());

const { state, saveState } = useSingleFileAuthState('./auth_info.json');
const store = makeInMemoryStore({});

const startSock = () => {
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        browser: ['Baileys', 'Safari', '1.0.0'],
    });

    store.bind(sock.ev);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error = Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
            if (shouldReconnect) {
                startSock();
            } else {
                unlinkSync('./auth_info.json');
            }
        } else if (connection === 'open') {
            console.log('opened connection');
        }
    });

    sock.ev.on('creds.update', saveState);

    sock.ev.on('qr', (qr) => {
        // Guardamos el QR en la variable sock para poder acceder a él más tarde
        sock.qr = qr;
        console.log('QR received', qr);
    });

    return sock;
};

let sock = startSock();

app.get('/qr', (req, res) => {
    if (sock?.qr) {
        res.type('svg');
        qrcode.generate(sock.qr, { small: true }, function (qr) {
            res.send(qr);
        });
    } else {
        res.status(404).send('QR code not available');
    }
});

app.post('/send-message', async (req, res) => {
    const { phone, message } = req.body;

    if (!phone || !message) {
        return res.status(400).json({ error: 'Phone and message are required' });
    }

    try {
        const chatId = phone + '@s.whatsapp.net';
        await sock.sendMessage(chatId, { text: message });
        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
