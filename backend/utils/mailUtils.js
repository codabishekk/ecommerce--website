const nodemailer = require('nodemailer');
const path = require('path');
const {
    orderPlacedTemplate,
    orderProcessingTemplate,
    orderShippedTemplate,
    orderDeliveredTemplate
} = require('./emailTemplates');

/**
 * Configure Transporter
 */
const createTransporter = () => nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

/**
 * Send Order Email
 */
const sendOrderEmail = async (userEmail, userName, orderId, status, extraData = {}) => {
    // Check if Gmail is configured
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn(`[Mail] Gmail not configured. Skipping email to ${userEmail} for order #${orderId} (Status: ${status})`);
        return;
    }

    const transporter = createTransporter();
    let subject = '';
    let html = '';
    const orderDetailsUrl = `${process.env.FRONTEND_URL || 'https://sholash.com'}/my-account/order/${orderId}`;

    switch (status) {
        case 'placed':
            subject = `Order Confirmed: #${orderId}`;
            html = orderPlacedTemplate(userName, orderId, orderDetailsUrl);
            break;
        case 'processing':
            subject = `Your Sholash order #${orderId} is being prepared`;
            html = orderProcessingTemplate(userName, orderId, orderDetailsUrl);
            break;
        case 'shipped':
            subject = `Great News! Your order #${orderId} has shipped 🚀`;
            html = orderShippedTemplate(userName, orderId, extraData.trackingNumber || 'Tracking Info Soon', extraData.trackingUrl || orderDetailsUrl);
            break;
        case 'delivered':
            subject = `Delivered: Your Sholash order #${orderId} has arrived 💚`;
            html = orderDeliveredTemplate(userName, orderId);
            break;
        default:
            return;
    }

    try {
        await transporter.sendMail({
            from: `"Sholash Life Science" <${process.env.GMAIL_USER}>`,
            to: userEmail,
            subject: subject,
            html: html,
            attachments: [
                {
                    filename: 'logo_symbol.png',
                    path: path.join(__dirname, '../../FrontEnd/src/assets/logo/logo_symbol.png'),
                    cid: 'logo_symbol'
                }
            ]
        });
        console.log(`[Mail] Success: Sent "${status}" email to ${userEmail} for order #${orderId}`);
    } catch (err) {
        console.error(`[Mail] Error sending "${status}" email:`, err.message);
    }
};

module.exports = { sendOrderEmail };
