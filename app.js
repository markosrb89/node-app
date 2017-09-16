const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (request, response) => {
    //response.send("Hello World!");
    response.render('contact');
});

app.post('/send', (request, response) => {
    const output = `
        <p>You have new contact request</p>
        <h3>Contact Details</h3>
        <ul>
            <li>Name: ${request.body.name}</li>
            <li>Company: ${request.body.company}</li>
            <li>Email: ${request.body.email}</li>
            <li>Phone: ${request.body.phone}</li>
        </ul>
        <h3>Message</h3>
        <p>${request.body.message}</p>
    `;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'krtolica89@gmail.com', // generated ethereal user
            pass: 'koliko89'  // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Nodemailer Application" <krtolica89@gmail.com>', // sender address
        to: 'markokrtolica1989@gmail.com', // list of receivers
        subject: 'Node contact request ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        response.render('contact', { msg: 'Email has been sent.' });
    });
});

app.listen(3000, () => {
    console.log("Server started, port 3000");
});