
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
      background: linear-gradient(to right, #2563eb, #4f46e5); /* Blue to indigo gradient */
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
      background: linear-gradient(to right, #2563eb, #4f46e5); /* Blue to indigo gradient */
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
      <img src="{{SITE_DOMAIN}}/logo.png" alt="Logo">
      <h1>{{SITE_URL}}</h1>
      <h1>Password Reset Request</h1>
    </div>
    <div class="content">
      <p>Hi there,</p>
      <p>We received a request to reset your password. If you made this request, click the button below to reset your password:</p>
      <a href="{{RESET_LINK}}" class="button">Reset Password</a>
      <p>If you didn't request a password reset, you can safely ignore this message.</p>
      <p>@ {{CURRENT_YEAR}} {{SITE_URL}}. All rights reserved.</p>
      <p>
        If you have any questions, feel free to <a href="mailto:{{SUPPORT_EMAIL}}">contact support</a>.
      </p>
    </div>
  </div>
</body>
</html>
