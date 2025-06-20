exports.bookingConfirmationTemplate = (
    userName,
    propertyDetails,
    checkInDate,
    checkOutDate
) => {
    return `
    <h2>Hello ${userName},</h2>
    <p>Thank you for your booking!</p>
    <h3>Booking Details:</h3>
    <ul>
        <li><strong>Property:</strong> ${propertyDetails}</li>
        <li><strong>Check-in:</strong> ${checkInDate}</li>
        <li><strong>Check-out:</strong> ${checkOutDate}</li>
    </ul>
    <p>If you have any questions, feel free to reach out to our support team.</p>
    <p>We hope you have a great stay!</p>
    `;
};

exports.paymentConfirmationTemplate = (userName, amount, propertyDetails) => {
    return `
    <h2>Hello ${userName},</h2>
    <p>Your payment has been successfully processed!</p>
    <h3>Payment Details:</h3>
    <ul>
        <li><strong>Amount:</strong> ₹${amount}</li>
        <li><strong>Property:</strong> ${propertyDetails}</li>
    </ul>
    <p>Thank you for choosing us!</p>
    <p>We look forward to hosting you soon.</p>
    `;
};
