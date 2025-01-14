const express = require('express');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const app = express();
const PORT = 3000;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(bodyParser.json());

// Endpoint to send an email
app.post('/send-email', async (req, res) => {
    const { to, subject, message } = req.body;

    const emailData = {
        to,
        from: 'mokesell4@gmail.com', // Replace with your verified sender email
        subject,
        text: message,
    };

    try {
        await sgMail.send(emailData);
        res.status(200).send({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
