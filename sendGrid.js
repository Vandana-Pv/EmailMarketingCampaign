const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  personalizations: [
    {
      to: "example1@mail.com", // replace this with recipients email address - get from csv file
      subject: "Did somebody say BACON DONUTS?? 🥓🥓🥓",
    },
    {
      to: "example2@mail.com", // replace this with recipients email address - get from csv file
    },
  ],
  from: "Sadie Miller <sadie@thebigdonut.party>", // senders email address and name
  subject: "🍩 Donuts, at the big donut 🍩", // sends the default subject if we do not mention in personalisations
  text: "Fresh donuts are out of the oven. Get them while they’re hot!",
  html:
    '<p>Fresh donuts are out of the oven. Get them while they’re <em>hot!</em> <a href="http://unsubscribe.com">Unsubscribe</a></p>', // Sends the unsubscribe link 
  send_at: `${time}` // UNIX TIMESTAMP - CONVERT DATE AND TIME TO UNIX TIMESTAMP Eg : 1597110000 - 11 Aug 2020 1.40 AM
};

sgMail
  .sendMultiple(msg)
  .then(() => {
    console.log("emails sent successfully!");
  })
  .catch((error) => {
    console.log(error);
  });
