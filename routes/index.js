var express = require('express');
var router = express.Router();
var pjson = require('../package.json');
var svgCaptcha = require('svg-captcha');
var nodemailer = require('nodemailer');

const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send({ version: pjson.version });
});

router.get('/captcha', function (req, res, next) {
  var captcha = svgCaptcha.create();
  var session = req.session;
  session.captcha = captcha.text;

  res.type('svg');
  res.status(200).send(captcha.data);
});

router.post('/contact', (req, res, next) => {
  var captcha = req.body.captcha;

  
  if (captcha == req.session.captcha && emailRegexp.test(req.body.email)) {
    const smtpTrans = nodemailer.createTransport({
      host: process.env.smtp_host,
      port: process.env.smtp_port,
      secure: true,
      auth: {
        user: process.env.smtp_user,
        pass: process.env.smtp_password
      }
    })

    const mailOpts = {
      from: process.env.target_mail,
      to: process.env.target_mail,
      subject: 'Neue Kontaktanfrage via karmakurier Website',
      text: `
  Name: ${req.body.name}
  E-Mail: (${req.body.email})
  
  ${req.body.message}`
    }

    smtpTrans.sendMail(mailOpts, (error, response) => {
      //always destroy the session!
      req.session.destroy();
      if (error) {
        res.status(500).send();
      }
      else {
        res.status(204).send();
      }
    })
  } else {
    // destroy session so no bruteforce is possible.
    req.session.destroy();
    res.status(400).send({message: 'wrong captcha or invalid body'});
  }

});

module.exports = router;
