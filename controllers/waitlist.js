const WaitList = require("../models/waitList");
const nodemail = require("nodemailer");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const joinWaitList = async (req, res) => {
  const { email, name } = req.body;

  try {
    // 1. Check if email exists (corrected findOne syntax)
    const existing = await WaitList.findOne({ email }); // Pass query object

    if (existing) {
      return res.status(400).json({
        // Added 'return' to stop execution
        success: false,
        message: "Email already exists, please use a different email",
      });
    }

    // 2. Create new waitlist entry
    const entry = new WaitList({
      email,
      name,
    });

    const msg = {
      to: email,
      from: {
        email: "olafaruqbakare@gmail.com",
        name: "Jump",
      },
      subject: `Thanks for joining our waitlist ${name}`,
      html: `
        <h1>Welcome to the waitlist!</h1>
        <p>Hi ${name},</p>
        <p>We'll notify you when we launch. Here's what to expect:</p>
        <ul>
          <li>Early access to features</li>
          <li>Exclusive discounts</li>
        </ul>
        <p><a href="#">Unsubscribe</a></p>
      `,
    };

    await sgMail.send(msg);
    console.log("message sent");

    // 3. Save to database
    await entry.save();

    // 4. Return success response
    res.status(201).json({
      success: true,
      data: entry,
      message: "Successfully joined waitlist",
    });
  } catch (error) {
    // 5. Handle errors
    res.status(500).json({
      success: false,
      message: error.message || "Server error occurred",
    });
  }
};

const getWaitList = async (req, res) => {
  try {
    const waitlist = await WaitList.find({});
    res.status(200).json({ waitlist });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const deleteWaitList = async (req, res) => {
  const { id } = req.params;
  try {
    await WaitList.findByIdAndDelete(id);
    res.status(200).json({ message: "successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = { joinWaitList, getWaitList, deleteWaitList }; // Export the function
