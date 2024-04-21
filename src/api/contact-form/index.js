const mailgun = require('mailgun-js')
const nodemailer = require('nodemailer')
const nodemailerTransport = require('nodemailer-mailgun-transport')

const auth = {
  auth: {
    apiKey: "56b2b66773d045e555e321a8bac7f351-19806d14-5dc65b50",
    domain: "sandbox8fc0aee0eaf349b1a147a77bb3dabc8a.mailgun.org",
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
        to: "philippe@243technologies.com",
        subject: req.body.message,
        html: `<p>${req.body.message}</p>`,
        text: "Mailgun rocks, pow pow!",
      },
      function (err, info) {
        if (err) {
          console.log("Error: " + err);
          res.status(200).json({ message: err });
        } else {
          console.log("Response: " + info);
          res.status(200).json({ message: info });
        }
      }
    );
}
