import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { email, senderName } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Create a transporter using Gmail
    // Note: In production, you would use environment variables for these credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Create a beautiful HTML email template
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invitation to Join LearnHub as a Tutor</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f5f7fa;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #4f46e5;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          padding: 20px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #718096;
        }
        .button {
          display: inline-block;
          background-color: #4f46e5;
          color: #ffffff !important; /* Force white color */
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 4px;
          margin: 20px 0;
          font-weight: bold;
          text-align: center;
          font-size: 16px;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .button:hover {
          background-color: #4338ca;
        }
        .highlight {
          color: #4f46e5;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>You're Invited to Join LearnHub!</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>You've been invited by <span class="highlight">${senderName || 'a LearnHub administrator'}</span> to join our platform as a tutor.</p>
          <p>LearnHub is a collaborative learning platform where tutors can share their knowledge and help students achieve their educational goals.</p>
          <p>As a tutor, you'll be able to:</p>
          <ul>
            <li>Create and share educational content</li>
            <li>Engage with students through interactive lessons</li>
            <li>Build your professional teaching portfolio</li>
            <li>Connect with a community of educators and learners</li>
          </ul>
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://learnhub.example.com'}/register?role=tutor" class="button" style="color: #ffffff; display: inline-block; background-color: #4f46e5; text-decoration: none; padding: 12px 24px; border-radius: 4px; margin: 20px 0; font-weight: bold; text-align: center; font-size: 16px;">Accept Invitation</a>
          </div>
          <p>If you have any questions, please don't hesitate to contact us.</p>
          <p>Best regards,<br>The LearnHub Team</p>
        </div>
        <div class="footer">
          <p>This email was sent to you because someone invited you to join LearnHub. If you didn't expect this invitation, you can safely ignore this email.</p>
          <p>&copy; ${new Date().getFullYear()} LearnHub. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Send the email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Invitation to Join LearnHub as a Tutor',
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: 'Invitation sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending invitation:', error);
    return NextResponse.json(
      { error: 'Failed to send invitation' },
      { status: 500 }
    );
  }
}
