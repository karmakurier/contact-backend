var express = require('express');
var router = express.Router();
var pjson = require('../package.json');
var svgCaptcha = require('svg-captcha');
var session = require('express-session')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send({ version: pjson.version });
});

router.get('/captcha', function (req, res, next) {
  var captcha = svgCaptcha.create();
  req.session.captcha = captcha.text;

  res.type('svg');
  res.status(200).send(captcha.data);
});

router.post('/contact', (req, res, next) => {

  var captcha = req.body.captcha;
  if (captcha == req.session.captcha) {
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
      subject: 'Neue Kontaktanfrage via Landingpage!',
      text: `
  Name: ${req.body.name}
  E-Mail: (${req.body.email})
  
  ${req.body.message}`
    }

    smtpTrans.sendMail(mailOpts, (error, response) => {
      if (error) {
        res.statusCode(500).send();
      }
      else {
        res.statusCode(204).send();
      }
    })
  } else {
    // destroy session so no bruteforce is possible.
    req.session.destroy();
    res.statusCode(400).send({message: 'wrong captcha'});
  }

});

module.exports = router;
