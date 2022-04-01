import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import { SendEmailDto } from '../dto/request/send-email.dto';

@Injectable()
export class SendgridService {
  constructor(private readonly configService: ConfigService) {
    SendGrid.setApiKey(process.env.SENDGRID_API_KEY as string);
  }
  async sendEmail(sendEmailDto: SendEmailDto): Promise<void> {
    const { email, userUuid, objective, diskImage, securityQuestion } =
      sendEmailDto;

    const buyItNow = {
      subject: '3 Units Or Less',
      html: `<h2>The product you liked it only has 3 units or less. Hurry up and purchase it as soon as possible</h2><img src='${
        diskImage ?? ''
      }' width: 250 />`,
    };
    const recoverIt = {
      subject: 'Disk API Password Recovery',
      html: `<h2>We know you want to recover your password</h2><br><br><h4>Please follow the next steps:</h4><ol><li>Copy this URL on Postman, Insomnia or any other API client: http://localhost:3000/api/v1/auth/${userUuid}/change-password</li>
      <li>Add the following keys at POST request body: </li>
      <ul>
        <li>"securityQuestion": "${securityQuestion}"</li>
        <li>"securityAnswer": YOUR_VALUE_HERE</li>
        <li>"newPassword": YOUR_VALUE_HERE</li>
        <li>"confirmPassword": YOUR_VALUE_HERE</li>
      </ul>
      <li>Select a POST method and send it!</li><li>If you receive a successfully message, your password has been changed and you'll receive an email</li></ol>`,
    };
    const successfulChange = {
      subject: 'Successfully Password Change',
      html: `<h2>Your password has been updated successfully</h2><h4>You can try your new password at Disk API following the next URL: http://localhost:3000/api/v1/auth/login</h4>`,
    };

    let subject = 'Ignore this email';
    let html = 'Ignore this email';

    if (objective === 'buy') {
      subject = buyItNow.subject;
      html = buyItNow.html;
    } else if (objective === 'recover') {
      subject = recoverIt.subject;
      html = recoverIt.html;
    } else if (objective === 'success') {
      subject = successfulChange.subject;
      html = successfulChange.html;
    }

    SendGrid.send({
      to: email,
      subject,
      html,
      from: {
        name: 'Ravn Development Team',
        email: process.env.SENDGRID_SENDER_EMAIL as string,
      },
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error);
    });
  }
}
