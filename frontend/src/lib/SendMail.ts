import nodeMailer from 'nodemailer';

const emailUser = process.env.EMAIL_USER?.trim();
const emailPass = process.env.EMAIL_PASS?.replace(/\s/g, '');

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailUser,
        pass: emailPass,
    },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
    await transporter.sendMail({
        from: `Echo Dispatch <${emailUser}>`,
        to,
        subject,
        html
    });
}
