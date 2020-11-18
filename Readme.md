# Contact Form Backend for Karmakurier
Microservice for Contact Form used at karmakurier website.

## Local Development
You can start the solution locally by executing the following commands.
First, make sure to set the environment variables needed to run the application.

```bash
export smtp_host=your.host
export smtp_port=465
export smtp_user=your.user
export smtp_password=your.pw
export session_secret=verysecretsessionkey
```
When this is done, you can run the application like so:

```bash
npm install 
npm start
```

## Usage
To use the contact form, the frontend page has to implement the following.

* import a svg-captcha at the contact-form. Use the `/captcha` endpoint to get a generated svg and embed it in the form.
* the enpoint `/contact` expects the following json payload:

```json
{
    "name":"Username",
    "email":"Email address of the user sending the mail",
    "message":"The body of the contact message",
    "captcha":"solved captcha, to be checked by the backend"
}
```

* after submission, the server will check the provided captcha for validity. If the captcha is wrong, the frontend must receive a new image as the session will be destroyed!

### Example React-JS

For a react example, please have a look at the examples directory.
TBD