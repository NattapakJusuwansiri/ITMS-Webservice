var mailer = require('nodemailer');
const { initLogger } = require('../logger');
const logger = initLogger('MailHelper');
require('dotenv').config();

var smtp = {
    host: process.env.IP_MAIL,
    port: 25,
    secure: false,
};

exports.sendMail = (to, subject, text) => {
    const method = 'SendMail';
    var smtpTransport = mailer.createTransport(smtp);
    var mail = {
        from: 'ITIS_NoReply@ap.denso.com',
        to,
        subject,
        text,
    };

    smtpTransport.sendMail(mail, function (error, response) {
        smtpTransport.close();
        if (error) {
            logger.error(`Error ${error.message}`, { method, data: { mail } });
        } else {
            logger.info(`Success`, { method, data: { mail } })
        }
    });

}