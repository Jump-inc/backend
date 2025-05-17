const WaitList = require("../models/waitList");
const nodemail = require("nodemailer");
const { Parser } = require("json2csv");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const joinWaitList = async (req, res) => {
  const { email } = req.body;

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
    });

    const msg = {
      to: email,
      from: {
        email: "no-reply@streamjump.info",
        name: "Jump",
      },
      subject: `Thanks for joining our Waitlist`,
      html: `
        <div style="background: #fefefe; padding: 20px; font-family: 'Segoe UI', sans-serif; color: #333;">
    <div style="max-width: 600px; margin: auto; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <div style="background: linear-gradient(to right, #ff6a00, #ee0979); color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Welcome to Jump 🚀</h1>
        <p style="margin: 10px 0 0;">You're officially on the waitlist!</p>
      </div>
      <div style="padding: 30px; background: white;">
        <p>Hi there,</p>
        <p>Thanks for signing up! We’re super excited to have you on board. Here’s what you’ll get access to:</p>
        <ul style="padding-left: 20px; line-height: 1.6;">
          <li>✅ Early access to new features</li>
          <li>🎁 Exclusive discounts and insider perks</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://streamjump.info" style="background: #ee0979; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">Visit Our Website</a>
        </div>
        <p>If you'd rather not hear from us, you can <a href="https://streamjump.info/unsubscribe" style="color: #ee0979;">unsubscribe</a>.</p>
      </div>
      <div style="background: #f7f7f7; padding: 15px; text-align: center; font-size: 12px; color: #999;">
        © 2025 Jump, All rights reserved.<br>
      </div>
    </div>
  </div>
  `,
    };
    try {
      await sgMail.send(msg);
      console.log("message sent");
    } catch (error) {
      console.error(
        "Failed to send email:",
        error.response?.body || error.message
      );
    }

    // 3. Save to database
    await entry.save();

    // 4. Return success response
    res.status(201).json({
      success: true,
      data: entry,
      message: "Successfully joined waitlist and mail sent",
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
    const deletedEntry = await WaitList.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "successfully deleted", data: deletedEntry });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
const exportWaitlist = async (req, res) => {
  try {
    const entries = await WaitList.find({}, "name email -_id");

    const fields = ["name", "email"];
    const parser = new Parser({ fields });
    const csv = parser.parse(entries);

    res.header("content-type", "text/csv");
    res.attachment("waitlist_export.csv");
    res.send(csv);
  } catch (error) {
    console.log("export failed", error);
    res.status(500).json({ message: error });
  }
};

module.exports = { joinWaitList, getWaitList, deleteWaitList, exportWaitlist }; // Export the function
