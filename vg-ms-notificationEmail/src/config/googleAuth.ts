import { google } from 'googleapis';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const CREDENTIALS_PATH = path.resolve(__dirname, '..', '..', process.env.GOOGLE_APPLICATION_CREDENTIALS || '');

const SCOPES = ['https://www.googleapis.com/auth/drive'];

async function authenticate() {
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: SCOPES,
  });
  return auth.getClient();
}

export { authenticate };
