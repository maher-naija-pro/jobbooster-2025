# Contact Email Template

## Subject
Contact from user

## HTML Template

```html
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
      <h1>{{SITE_URL}}</h1>
      from : {{USER_NAME}} {{USER_EMAIL}}
    </div>
    <div class="content">
      {{USER_MESSAGE}}
    </div>
  </div>
</body>
</html>
```

## Template Variables
- `{{SITE_URL}}` - The site name/URL
- `{{USER_NAME}}` - Name of the user who sent the contact message
- `{{USER_EMAIL}}` - Email address of the user who sent the contact message
- `{{USER_MESSAGE}}` - The message content from the user

## Usage
This template is used for sending contact form submissions to the site administrator. It forwards user messages from the contact form.
