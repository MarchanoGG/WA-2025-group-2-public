"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAppointmentConfirmation = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Create a transporter using Gmail SMTP
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'edu.planner.hhs@gmail.com',
        pass: 'cxdnkimclonupfao'
    }
});
const sendAppointmentConfirmation = async (to, appointmentDetails) => {
    const { studentName, startTime, endTime, teacherName } = appointmentDetails;
    console.log(to);
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
    }
    catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};
exports.sendAppointmentConfirmation = sendAppointmentConfirmation;
exports.default = transporter;
