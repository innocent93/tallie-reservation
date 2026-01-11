export const sendSMS = (phone: string, message: string) => {
  console.log(`📱 SMS to ${phone}: ${message}`);
};

export const sendEmail = (email: string, message: string) => {
  console.log(`📧 Email to ${email}: ${message}`);
};
