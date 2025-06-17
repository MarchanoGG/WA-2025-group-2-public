import nodemailer from 'nodemailer';

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'edu.planner.hhs@gmail.com',
        pass: 'cxdnkimclonupfao'
    }
});

export const sendAppointmentConfirmation = async (
    to: string,
    appointmentDetails: {
        studentName: string;
        startTime: Date;
        endTime: Date;
        teacherName: string;
    }
) => {
    const { studentName, startTime, endTime, teacherName } = appointmentDetails;
    console.log(to)
    const mailOptions = {
        from: 'edu.planner.hhs@gmail.com',
        to,
        subject: 'Bevestiging afspraak EduPlanner',
        html: `
            <h2>Bevestiging afspraak EduPlanner</h2>
            <p>Beste ouder,</p>
            <p>Uw afspraak voor ${studentName} is succesvol ingepland:</p>
            <ul>
                <li>Datum: ${startTime.toLocaleDateString('nl-NL')}</li>
                <li>Tijd: ${startTime.toLocaleTimeString('nl-NL')} - ${endTime.toLocaleTimeString('nl-NL')}</li>
                <li>Docent: ${teacherName}</li>
            </ul>
            <p>Met vriendelijke groet,<br>Het EduPlanner Team</p>
        `,
    };

    try {
        console.log("Sending email");
        console.log(mailOptions);
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

export default transporter; 