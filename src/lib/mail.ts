import { Resend } from "resend";
import { Site_name } from "@/texts-and-menues/site-name"

const resend = new Resend(process.env.RESEND_API_KEY);


export const sendPasswordResetEmail = async (
  email: string,
  token: string,
) => {
  console.log("🚀 ~ sendResetEmail sent to:", email);
  const resetLink = `${Site_name.domain}/new-password?token=${token}`;

  const htmlTemplate = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
      }
      .email-container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        border: 1px solid #eaeaea;
      }
      .header {
        background-color: #0f172a; /* Tailwind bg-slate-900 */
        color: #ffffff;
        padding: 20px;
        text-align: center;
      }
      .header img {
        max-width: 50px;
        margin-bottom: 10px;
      }
      .content {
        padding: 20px;
        color: #333;
      }
      .content h1 {
        font-size: 20px;
        margin-bottom: 20px;
      }
      .content p {
        line-height: 1.6;
      }
      .content a.button {
        display: inline-block;
        margin: 20px 0;
        padding: 10px 20px;
        background-color: #0f172a; /* Tailwind bg-slate-900 */
        color: #ffffff;
        text-decoration: none;
        font-weight: bold;
        border-radius: 5px;
      }
      .footer {
        text-align: center;
        padding: 10px 20px;
        font-size: 12px;
        color: #777;
        border-top: 1px solid #eaeaea;
        background-color: #f9f9f9;
      }
      .footer a {
        color: #007bff;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <img src="${Site_name.domain}/logo.png" alt="Logo">
        <h1>${Site_name.siteUrl}</h1>
        <h1>Password Reset Request</h1>
      </div>
      <div class="content">
        <p>Hi there,</p>
        <p>We received a request to reset your password. If you made this request, click the button below to reset your password:</p>
        <a href="${resetLink}" class="button">Reset Password</a>
        <p>If you didn’t request a password reset, you can safely ignore this message.</p>
        <p>@ ${new Date().getFullYear()} ${Site_name.siteUrl}. All rights reserved.</p>
        <p>
          If you have any questions, feel free to <a href="mailto:${Site_name.supporMail}">contact support</a>.
        </p>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;

  try {
    await resend.emails.send({
      from: Site_name.mailfrom,
      to: email,
      subject: "Reset Your Password",
      html: htmlTemplate,
    });
    console.log("🚀 ~ Password reset email sent successfully!");
  } catch (error) {
    console.error("❌ ~ Error sending password reset email:", error);
  }
};


export const sendVerificationEmail = async (
  email: string,
  token: string
) => {
  console.log("🚀 ~ VerificationEmail sent to:", email);
  const confirmLink = `${Site_name.domain}/new-verification?token=${token}`;

  const htmlTemplate = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
      }
      .email-container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        border: 1px solid #eaeaea;
      }
      .header {
        background-color: #0f172a; /* Tailwind bg-slate-900 */
        color: #ffffff;
        padding: 20px;
        text-align: center;
      }
      .header img {
        max-width: 50px;
        margin-bottom: 10px;
      }
      .content {
        padding: 20px;
        color: #333;
      }
      .content h1 {
        font-size: 20px;
        margin-bottom: 20px;
      }
      .content p {
        line-height: 1.6;
      }
      .content a.button {
        display: inline-block;
        margin: 20px 0;
        padding: 10px 20px;
        background-color: #0f172a; /* Tailwind bg-slate-900 */
        color: #ffffff;
        text-decoration: none;
        font-weight: bold;
        border-radius: 5px;
      }
      .footer {
        text-align: center;
        padding: 10px 20px;
        font-size: 12px;
        color: #777;
        border-top: 1px solid #eaeaea;
        background-color: #f9f9f9;
      }
      .footer a {
        color: #007bff;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <img src="${Site_name.domain}/logo.png" alt="Logo">
        <h1>${Site_name.siteUrl}</h1>
        <h1>Action Required: Confirm Your Email</h1>
      </div>
      <div class="content">
        <p>Hi there,</p>
        <p>We noticed you signed up for ${Site_name.siteUrl}. To complete the process, please confirm your email address by clicking the button below: </p>
        <a href="${confirmLink}" class="button" > Confirm Email </a>
      <p> 
      If you didn’t sign up for this account, please ignore this message.</p>
      <p>@ ${new Date().getFullYear()} ${Site_name.siteUrl}. All rights reserved.</p>
            <p>
       If you have any questions, feel free to <a href="mailto:${Site_name.supporMail}" > contact support </a>.
       </div>
    </div>
    </div>
    </body>
    </html>
      `;

  try {
    await resend.emails.send({
      from: Site_name.mailfrom,
      to: email,
      subject: "Confirm Your Email",
      html: htmlTemplate,
    });
    console.log("🚀 ~ Email sent successfully!");
  } catch (error) {
    console.error("❌ ~ Error sending email:", error);
  }
};

export const sendcontactEmail = async (
  name: string,
  email: string,
  message: string
) => {
  console.log("🚀 ~ contactEmail sent to:");


  const htmlTemplate = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
      }
      .email-container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        border: 1px solid #eaeaea;
      }
      .header {
        background-color: #0f172a; /* Tailwind bg-slate-900 */
        color: #ffffff;
        padding: 20px;
        text-align: center;
      }
      .header img {
        max-width: 50px;
        margin-bottom: 10px;
      }
      .content {
        padding: 20px;
        color: #333;
      }
      .content h1 {
        font-size: 20px;
        margin-bottom: 20px;
      }
      .content p {
        line-height: 1.6;
      }
      .content a.button {
        display: inline-block;
        margin: 20px 0;
        padding: 10px 20px;
        background-color: #0f172a; /* Tailwind bg-slate-900 */
        color: #ffffff;
        text-decoration: none;
        font-weight: bold;
        border-radius: 5px;
      }
      .footer {
        text-align: center;
        padding: 10px 20px;
        font-size: 12px;
        color: #777;
        border-top: 1px solid #eaeaea;
        background-color: #f9f9f9;
      }
      .footer a {
        color: #007bff;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <h1>${Site_name.siteUrl}</h1>
        from :   ${name} ${email}
      </div>
      <div class="content">
      ${message}
      </div>
    </div>
    </div>
    </body>
    </html>
      `;

  try {
    await resend.emails.send({
      from: Site_name.mailfrom,
      to: "maher.naija@gmail.com",
      subject: "Contact from user",
      html: htmlTemplate,
    });
    console.log("🚀 ~ Email sent successfully!");
  } catch (error) {
    console.error("❌ ~ Error sending email:", error);
  }
};









