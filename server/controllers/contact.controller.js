import asyncHandler from 'express-async-handler';
import nodemailer from 'nodemailer';

// @route   POST /api/contact
export const sendContact = asyncHandler(async (req, res) => {
    const { name, email, phone, message, subject } = req.body;

    if (!name || !email || !message) {
        res.status(400);
        throw new Error('Name, email and message are required');
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,  // Gmail App Password
        },
    });

    const mailOptions = {
        from: `"${name}" <${email}>`,
        to: process.env.CONTACT_EMAIL || 'mananimmathi@gmail.com',
        subject: subject || `New Contact Message from ${name}`,
        html: `
      <h2>New message from nimmathi.com</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Message sent successfully' });
});