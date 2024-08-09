export interface EmailData {
  to: string;
  subject: string;
  text: string;
  attachment: Buffer;
  filename: string;
}
