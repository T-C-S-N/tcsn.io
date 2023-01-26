import clientPromise from '@/lib/mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer')

const usersCollection: string = process.env.MONGO_USERS_COLLECTION || ''

// create a new user, set nextjs user session
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { firstname, lastname, email, password, passwordConfirm }: { firstname: string, lastname: string, email: string, password: string, passwordConfirm: string } = req.body;
  const client = await clientPromise;
  const db = client.db(usersCollection);

  // if email is not provided
  if (!firstname) return res.status(401).json({ message: 'Firstname is required' });
  if (!lastname) return res.status(401).json({ message: 'Lastname is required' });
  if (!email) return res.status(401).json({ message: 'Email is required' });
  if (email.search(/@/) === -1 || email.search(/\./) === -1) return res.status(401).json({ message: 'Email incorrect' });
  if (!password) return res.status(401).json({ message: 'Password is required' });
  if (!passwordConfirm) return res.status(401).json({ message: 'Password confirmation is required' });
  if (password !== passwordConfirm) return res.status(401).json({ message: 'Passwords do not match' });
  if (password.length < 6) return res.status(401).json({ message: 'Password must be at least 6 characters long' });
  if (password.length > 20) return res.status(401).json({ message: 'Password must be less than 20 characters long' });
  if (password.search(/[a-zA-Z]/) === -1) return res.status(401).json({ message: 'Password must contain at least one letter' });
  if (password.search(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/) === -1) return res.status(401).json({ message: 'Password must contain at least one special character' });
  if (password.search(/[A-Z]/) === -1) return res.status(401).json({ message: 'Password must contain at least one uppercase letter' });
  if (password.search(/[a-z]/) === -1) return res.status(401).json({ message: 'Password must contain at least one lowercase letter' });
  if (password.search(/[0-9]/) === -1) return res.status(401).json({ message: 'Password must contain at least one digit' });
  if (password.search(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/) === -1) return res.status(401).json({ message: 'Password must contain at least one special character' });

  const user = await db.collection(usersCollection).findOne({ email: email });
  // if user exists
  if (user) return res.status(401).json({ message: 'User already exists' });

  // if user does not exist
  const hashedPassword = await bcrypt.hash(password, 10);
  const emailToken = await bcrypt.hash(email, 10);
  const newUser = {
    email,
    password: hashedPassword,
    firstname: '',
    lastname: '',
    role: 'user',
    accessToken: null,
    accessTokenExpiry: null,
    verified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    emailToken,
    emailVerified: false,
    emailVerifiedAt: null,
  }
  const post = await db.collection(usersCollection).insertOne(newUser);

  // send email to user with verification link using nodemailer
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const verificationUrl = process.env.EMAIL_WEBSITE_URL + '/email-verify?token=' + emailToken + '&email=' + email;
  const emailTemplate = `
  <div style="padding:5px">
  <table class="" border="0" cellspacing="0" cellpadding="0">
   <tbody style="border-radius:10px;background-color:white;width: 380px;box-shadow: 0px 0px 5px rgb(56,86,117,0.8);">
      <tr>
         <td class="" style="font-size:0pt;line-height:0pt;padding-top:59px">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
               <tbody>
                  <tr>
                     <td style="font-size:0pt;line-height:0pt;text-align:center;padding-bottom:33px">
                        <img src="${process.env.EMAIL_LOGO_IMAGE}" alt="" border="0" style="margin:0!important;padding:0;width:100px" class="CToWUd" data-bit="iit">
                     </td>
                  </tr>
               </tbody>
            </table>
         </td>
      </tr>
      <tr>
         <td style="font-weight:bold;letter-spacing:-0.03em;font-family:Arial,sans-serif;min-width:auto!important;font-size:40px;line-height:54px;text-align:center;color:black;padding-bottom:18px;padding-left:30px;padding-right:30px">
            <div style="background:transparent!important">
               Hello!
            </div>
         </td>
      </tr>

      <tr>
         <td align="center" style="padding-bottom:22px">
            <table border="0" cellspacing="0" cellpadding="0" style="background-color:#fffffe;border-radius:9px">
               <tbody>
                  <tr>
                     <td style="font-family:Arial,sans-serif;text-align:center;min-width:auto!important;font-size:12px;line-height:16px;color:#075ff0">
                        <div style="background:transparent!important">
                     <p style="display:block;color:black;font-weight:100!important">You requested the creation of an account on <a href="${process.env.EMAIL_WEBSITE_URL}" style="text-decoration:none;color:rgb(0, 152, 215)"><strong>${process.env.EMAIL_WEBSITE_NAME}</strong></a></p>
                           <p style="display:block;color:black;font-weight:100!important">In order to verify your email please click on the following link:</p>
                        </div>
                     </td>
                  </tr>
               </tbody>
            </table>
         </td>
      </tr>

      <tr>
         <td align="center" style="padding-bottom:22px">
            <table border="0" cellspacing="0" cellpadding="0" style="background-color:#fffffe;border-radius:9px">
               <tbody>
                  <tr>
                     <td style="font-family:Arial,sans-serif;text-align:center;min-width:auto!important;font-size:12px;line-height:16px;color:#075ff0">
                        <div style="background:transparent!important">
                           <a href="${verificationUrl}" style="display:block;padding:8px 22px;text-decoration:none;color:rgb(0, 152, 215)"><strong style="font-weight:700!important">Verify your email</strong>
                           </a>
                        </div>
                     </td>
                  </tr>
               </tbody>
            </table>
         </td>
      </tr>
   </tbody>
</table>
</div>
`

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Tocausan | Email confirmation',
    text: 'Dear, ' + email + ' please click on the link to verify your email address: ' + verificationUrl,
    html: emailTemplate
  };

  transporter.sendMail(mailOptions, function (error: any, info: any) {
    if (error) console.error(error);
    else console.log('Email sent to' + email + ': ' + info.response);
  });

  res.json(post);
}

