import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'iCloud',
  auth: {
    user: 'princeokenna@icloud.com',
    pass: 'qbev-qaxg-nkts-ofql',
  },
});

export interface JobApplication {
  jobTitle: string;
  company: string;
  location: string;
  applicationDate: string;
  status: 'applied' | 'pending' | 'rejected' | 'interview';
}

export const sendApplicationNotification = async (application: JobApplication) => {
  const mailOptions = {
    from: 'princeokenna@icloud.com',
    to: 'princeokenna@icloud.com',
    subject: `Job Application Confirmation: ${application.jobTitle} at ${application.company}`,
    html: `
      <h2>Job Application Confirmation</h2>
      <p>Your application has been submitted successfully!</p>
      
      <h3>Application Details:</h3>
      <ul>
        <li><strong>Position:</strong> ${application.jobTitle}</li>
        <li><strong>Company:</strong> ${application.company}</li>
        <li><strong>Location:</strong> ${application.location}</li>
        <li><strong>Application Date:</strong> ${application.applicationDate}</li>
        <li><strong>Status:</strong> ${application.status}</li>
      </ul>

      <p>We'll keep you updated on the status of your application.</p>
      
      <p>Best regards,<br>Job Search Automation</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Application notification email sent successfully');
  } catch (error) {
    console.error('Error sending application notification email:', error);
    throw error;
  }
}; 