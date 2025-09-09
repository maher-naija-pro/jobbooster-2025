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
      <img src="{{ .SiteURL }}/logo.png" alt="Logo">
      <h1>Action Required: Confirm Your Email</h1>
    </div>
    <div class="content">
      <p>Hi there,</p>
      <p>We noticed you signed up for our service. To complete the process, please confirm your email address by clicking the button below:</p>
      <a href="{{ .ConfirmationURL }}" class="button">Confirm Email</a>
      <p>If you didn't sign up for this account, please ignore this message.</p>
      <p>If you have any questions, feel free to contact support.</p>
    </div>
    <div class="footer">
      <p>© {{ .SiteURL }}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>