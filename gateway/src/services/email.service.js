const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class EmailService {
  constructor() {}

  static sendEmail(params) {
    const { email, subject, text, content } = params;
    const msg = {
      to: email,
      from: "identicon.dao@gmail.com",
      subject: subject,
      text: text,
      html: content,
    };

    return sgMail.send(msg);
  }
}

module.exports = EmailService;
