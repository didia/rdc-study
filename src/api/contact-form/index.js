const mailgun = require('mailgun-js')
const nodemailer = require('nodemailer')
const nodemailerTransport = require('nodemailer-mailgun-transport')

const auth = {
  auth: {
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
};

const nodemailerMailgun = nodemailer.createTransport(nodemailerTransport(auth));


export default function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const data = {
      name: req.body.name,
      email: req.body.email,
      msg: req.body.message,
    };

    nodemailerMailgun.sendMail(
      {
        from: "philippembambi413@gmail.com",
        // to: "salut@rdcetudes.com",
        to: "philippembambi413@gmail.com",
        subject: req.body.message,
        html: `<p>${req.body.message}</p>`,
        text: "Mailgun rocks, pow pow!",
      },
      function (err, info) {
        if (err) {
          console.log("Error: " + err);
          res.status(500).json({ message: err });
        } else {
          console.log("Response: " + info);
          res.status(200).json({ message: info });
        }
      }
    );
}
