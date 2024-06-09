const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

app.post('/book', (req, res) => {
  const data = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'siddiquea725@gmail.com',
      pass: 'jttl myvk sxed ttkg'  // Replace this with your app password
    }
  });

  const userMailOptions = {
    from: 'siddiquea725@gmail.com',
    to: data.email,
    subject: 'Booking Confirmation',
    text: `Thank you for booking an EV charging point at ${data.chargingPoint}. Here are your details:\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nCar Number: ${data.carNumber}\nCar Model: ${data.carModel}\nCar Company: ${data.carCompany}\nPayment Method: ${data.payment}`
  };

  const ownerMailOptions = {
    from: 'siddiquea725@gmail.com',
    to: 'siddiquea725@gmail.com',
    subject: 'New Booking Received',
    text: `A new booking has been made at ${data.chargingPoint}. Details:\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nCar Number: ${data.carNumber}\nCar Model: ${data.carModel}\nCar Company: ${data.carCompany}\nPayment Method: ${data.payment}`
  };

  transporter.sendMail(userMailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email to user:', error);
      return res.status(500).json({ error: error.toString() });
    }
    console.log('Email sent to user:', info.response);
    transporter.sendMail(ownerMailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email to owner:', error);
        return res.status(500).json({ error: error.toString() });
      }
      console.log('Email sent to owner:', info.response);
      res.status(200).json({ message: 'Booking confirmation sent' });
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
