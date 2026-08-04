/**
 * Email Templates for Sholash Life Science
 * Established Premium Aquatic Aesthetic: Aqua Blue, Deep Green, Soft Backgrounds.
 */

const SHARED_STYLE = `
    body { font-family: 'Outfit', 'Segoe UI', sans-serif; margin: 0; padding: 0; background-color: #f8fafc; color: #0f172a; line-height: 1.6; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(14, 165, 233, 0.08); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #eef7f2 0%, #e0f2fe 100%); padding: 40px 20px; text-align: center; border-bottom: 1px solid #e2e8f0; }
    .logo { width: 80px; height: auto; margin-bottom: 15px; }
    .content { padding: 40px 30px; }
    .hero-text { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 500; color: #065f46; margin-bottom: 20px; text-align: center; }
    .text { color: #475569; font-size: 16px; margin-bottom: 25px; }
    .order-box { background: #f0fdf4; border: 1px solid #dcfce7; border-radius: 12px; padding: 20px; margin-bottom: 30px; }
    .order-id { font-weight: 700; color: #047857; margin-bottom: 10px; }
    .button-container { text-align: center; margin: 35px 0; }
    .button { background-color: #0ea5e9; color: #ffffff !important; padding: 14px 32px; border-radius: 12px; font-weight: 600; text-decoration: none; display: inline-block; box-shadow: 0 4px 12px rgba(14, 165, 233, 0.2); }
    .footer { padding: 30px; text-align: center; font-size: 13px; color: #94a3b8; background-color: #f1f5f9; border-top: 1px solid #e2e8f0; }
    .social-links { margin-bottom: 15px; }
    .hr { border: none; border-top: 1px solid #e2e8f0; margin: 30px 0; }
`;

const baseLayout = (heroText, bodyHtml, buttonText, buttonUrl) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${SHARED_STYLE}</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="cid:logo_symbol" alt="Sholash" class="logo">
            <div class="hero-text">${heroText}</div>
        </div>
        <div class="content">
            ${bodyHtml}
            ${buttonText ? `
            <div class="button-container">
                <a href="${buttonUrl}" class="button">${buttonText}</a>
            </div>` : ''}
            <div class="hr"></div>
            <p class="text" style="font-size: 14px; text-align: center;">
                Need help with your order? Reply to this email or visit our <a href="https://sholash.com/support" style="color:#0ea5e9;">Help Center</a>.
            </p>
        </div>
        <div class="footer">
            <div class="social-links">
                Follow us: <a href="#" style="color:#64748b; margin:0 5px;">Instagram</a> | <a href="#" style="color:#64748b; margin:0 5px;">Facebook</a>
            </div>
            © 2025 Sholash Life Science. All rights reserved.<br>
            Nature's secret for your skin and soul.
        </div>
    </div>
</body>
</html>
`;

const orderPlacedTemplate = (customerName, orderId, orderDetailsUrl) => {
    const body = `
        <p class="text">Hi <strong>${customerName}</strong>,</p>
        <p class="text">We've received your order and we're just as excited as you are! Our team is currently reviewing your details to ensure everything is perfect before we begin processing.</p>
        <div class="order-box">
            <div class="order-id">Order ID: #${orderId}</div>
            <p class="text" style="margin: 0; font-size: 14px;">You'll receive another update once your package moves to the processing stage.</p>
        </div>
        <p class="text">Thank you for choosing Sholash Life Science for your skin and wellness journey.</p>
    `;
    return baseLayout("Order Confirmed! 🎉", body, "View Order Details", orderDetailsUrl);
};

const orderProcessingTemplate = (customerName, orderId, orderDetailsUrl) => {
    const body = `
        <p class="text">Hi ${customerName},</p>
        <p class="text">Your wellness essentials are being carefully prepared! We are currently picking, packing, and making sure your products are ready for their journey to you.</p>
        <div class="order-box">
            <div class="order-id">Order ID: #${orderId}</div>
            <p class="text" style="margin: 0; font-size: 14px;">Status: <strong>Processing 🌿</strong></p>
        </div>
        <p class="text">We appreciate your patience while we ensure everything is crafted with care.</p>
    `;
    return baseLayout("Processing Your Order...", body, "Track Progress", orderDetailsUrl);
};

const orderShippedTemplate = (customerName, orderId, trackingNumber, trackingUrl) => {
    const body = `
        <p class="text">Hi ${customerName},</p>
        <p class="text">Great news! Your Sholash package has officially left our facility and is now on its way to your doorstep.</p>
        <div class="order-box">
            <div class="order-id">Order ID: #${orderId}</div>
            <p class="text" style="margin: 0; font-size: 15px;">Tracking Number: <strong>${trackingNumber}</strong></p>
        </div>
        <p class="text">Use the tracking link below to follow your package's journey in real-time.</p>
    `;
    return baseLayout("Your Order Shipped! 🚀", body, "Track Package", trackingUrl);
};

const orderDeliveredTemplate = (customerName, orderId) => {
    const body = `
        <p class="text">Hi ${customerName},</p>
        <p class="text">Your Sholash order has been delivered! We hope your new products bring a touch of nature and wellness to your daily routine.</p>
        <div class="order-box">
            <div class="order-id">Order ID: #${orderId}</div>
            <p class="text" style="margin: 0; font-size: 14px;">Enjoying your purchase? We'd love to hear your thoughts!</p>
        </div>
        <p class="text">Thank you for being a valued part of the Sholash Life Science family.</p>
    `;
    return baseLayout("Delivered! Enjoy 💚", body, "Leave a Review", "https://sholash.com/my-account/orders");
};

module.exports = {
    orderPlacedTemplate,
    orderProcessingTemplate,
    orderShippedTemplate,
    orderDeliveredTemplate
};
