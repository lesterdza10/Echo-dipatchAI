import nodeMailer from 'nodemailer';

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
    await transporter.sendMail({
        from:"Echo Dispatch <${process.env.EMAIL_USER}>",
        to,
        subject,
        html
    });
}
