import nodemailer from "nodemailer";
import CC from "../models/ccModel.js";

export const sendMail = async (req, res) => {
  const { className, department, healthData } = req.body;
  if (!className || !department || !healthData) {
    return res.status(400).send({
      success: false,
      message: "Invalid request. Missing required fields.",
    });
  }

  try {
    const cc = await CC.findOne({
      className: className,
      department: department,
    });

    if (!cc) {
      return res.status(404).send({ success: false, message: "CC not found" });
    }

    const email = cc.email;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "vaibhavibelamkar2004@gmail.com",
        pass: "zspq hqjw sdle ewuo",
      },
    });

    const mailOptions = {
      from: "vaibhavibelamkar2004@gmail.com",
      to: email,
      subject: "Health Report Notification",
      text: `
Dear CC,

Here are your health details:

Symptoms: ${healthData.symptoms || "N/A"}
Diagnosis: ${healthData.diagnosis || "N/A"}
Recommendations: ${healthData.recommendations || "N/A"}
BedRest: ${healthData.bedRest ? "Yes" : "No"}
LeaveRequired: ${healthData.leaveRequired ? "Yes" : "No"}

Date of Record: ${new Date().toLocaleDateString()}

Please consult a healthcare professional if you have any concerns.

Best regards,
Health Department
`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res
          .status(500)
          .send({ success: false, message: "Failed to send email" });
      } else {
        console.log("Email sent: " + info.response);
        return res.send({
          success: true,
          message: "Mail sent successfully",
        });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error" });
  }
};
