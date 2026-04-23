import { VerificationMailData } from '@/types/mailer.types';

export const compileVerificationMailTemplate = (data: VerificationMailData) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        /* Base reset for email clients */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; }
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
        a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    </style>
</head>
<body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">

    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="padding: 40px 10px 40px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    
                    <tr>
                        <td align="center" style="padding: 40px 20px 20px 20px; font-family: Arial, sans-serif; color: #333333;">
                            <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Welcome to EasyBus!</h1>
                        </td>
                    </tr>

                    <tr>
                        <td align="left" style="padding: 20px 40px 20px 40px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #555555;">
                            <p style="margin: 0;">Hi ${data.name},</p>
                            <p style="margin: 20px 0 0 0;">Thank you for registering. To get started, we just need to verify your email address. Please click the button below to confirm your account.</p>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="padding: 20px 40px 40px 40px;">
                            <table border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="border-radius: 4px;" bgcolor="#007bff">
                                        <a href="${data.url}" target="_blank" style="font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; padding: 12px 24px; border: 1px solid #007bff; border-radius: 4px; display: inline-block;">Verify Email Address</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td align="left" style="padding: 0px 40px 30px 40px; font-family: Arial, sans-serif; font-size: 14px; line-height: 20px; color: #777777;">
                            <p style="margin: 0;">If the button doesn't work, copy and paste this link into your browser:</p>
                            <p style="margin: 5px 0 0 0;"><a href="${data.url}" target="_blank" style="color: #007bff; word-break: break-all;">${data.url}</a></p>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="padding: 20px; font-family: Arial, sans-serif; font-size: 12px; color: #aaaaaa; background-color: #f9f9f9; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                            <p style="margin: 0;">If you didn't create an account, you can safely ignore this email.</p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>
</html>`;
  return html;
};
