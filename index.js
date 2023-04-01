const { Client, MessageMedia } = require('whatsapp-web.js');

function sendWhatsAppMessage(mobileNumbers, base64Image, Message) {
    const client = new Client({
        puppeteer: { headless: false }
    });

    client.initialize();
    console.log("step-1 Initialize");

    client.on('qr', (qr) => {
        console.log(qr);
        console.log("Step-2 QR-code Scan");
    });

    client.on('ready', () => {
        console.log("Step-3 Logged In");
        SendMsg();
    });

    async function SendMsg() {
        console.log("Step-4 Gone in Loop of numbers");
        mobileNumbers.forEach(async (number) => {
            try {
                await sendMessage(number.toString().replace(/\s/g, ''), Message);
                await sendImage(number.toString().replace(/\s/g, ''), base64Image);
            } catch (err) {
                console.error(`Failed to send message to ${number}:`, err);
            }
        });
        console.log(await client.getBlockedContacts());
        setTimeout(() => {
            console.log("Step-7 Logout time");
            client.destroy();
        }, 10000);

    }

    async function sendMessage(number, message) {
        const chat = await client.getChatById(number + '@c.us');
        await chat.sendMessage(message);
        console.log("step-5 Message sended to => " + number);
    }

    async function sendImage(number, base64Image) {
        const chat = await client.getChatById(number + '@c.us');
        const media = await MessageMedia.fromUrl(base64Image, { unsafeMime: true });
        await chat.sendMessage(media);
        console.log("step-6 Image sended to => " + number);
    }
}

module.exports = sendWhatsAppMessage