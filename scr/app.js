const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode-terminal');
const qr = require('qr-image');

const app = express();
app.use(express.json());

let qrCode = null;

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrCode = qr;
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
    qrCode = null;
});

client.initialize();

app.get('/qr', (req, res) => {
    if (qrCode) {
        const qr_svg = qr.image(qrCode, { type: 'svg' });
        res.type('svg');
        qr_svg.pipe(res);
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
        const formattedPhone = phone.replace(/\D/g, '');
        const chatId = `${formattedPhone}@c.us`;
        await client.sendMessage(chatId, message);
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