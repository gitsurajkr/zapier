import nodemailer from "nodemailer"


 const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

export async function sendEmail(to: string, body: string): Promise<void> {
    // send out the user some sol
    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            sender: process.env.EMAIL,
            to,
            subject: "Hello from zapier",
            text: body
        });
    } catch (error) {
        console.error("Failed to send email:", error);
        throw error;
    }
}