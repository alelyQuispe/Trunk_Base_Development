import { google } from 'googleapis';
import { Readable } from 'stream';
import { authenticate } from '../config/googleAuth';
import { Income } from '../models/Income';
import { sendEmailWithAttachment } from './EmailService';
import { OAuth2Client } from 'google-auth-library';

const TEMPLATE_FOLDER_ID = process.env.TEMPLATE_FOLDER_ID || '';
const PDF_FOLDER_ID = process.env.PDF_FOLDER_ID || '';
const DOCS_INCOME = process.env.DOCS_INCOME || '';

async function copyTemplateDocument(auth: OAuth2Client, data: Income) {
  const drive = google.drive({ version: 'v3', auth });
  const copyResponse = await drive.files.copy({
    fileId: DOCS_INCOME,
    requestBody: {
      name: data.correlative,
      parents: [TEMPLATE_FOLDER_ID],
    },
  });
  return copyResponse.data.id || '';
}

function prepareBatchUpdateRequests(data: Income, copyId: string) {
  const conceptsText = data.categories.map(cat => cat.name).join('\n');
  const amountsText = data.categories.map(cat => cat.amount.toString()).join('\n');
  const totalAmount = data.categories.reduce((sum, cat) => sum + cat.amount, 0);

  return {
    documentId: copyId,
    requests: [
      { replaceAllText: { containsText: { text: '{{correlativo}}', matchCase: true }, replaceText: data.correlative } },
      { replaceAllText: { containsText: { text: '{{nombre_usuario}}', matchCase: true }, replaceText: data.userName } },
      { replaceAllText: { containsText: { text: '{{nombre_administrador}}', matchCase: true }, replaceText: data.adminName } },
      { replaceAllText: { containsText: { text: '{{conceptos}}', matchCase: true }, replaceText: conceptsText } },
      { replaceAllText: { containsText: { text: '{{montos}}', matchCase: true }, replaceText: amountsText } },
      { replaceAllText: { containsText: { text: '{{total}}', matchCase: true }, replaceText: totalAmount.toString() } },
      { replaceAllText: { containsText: { text: '{{comentario}}', matchCase: true }, replaceText: data.comment } },
    ],
  };
}

async function generatePDF(auth: OAuth2Client, copyId: string) {
  const drive = google.drive({ version: 'v3', auth });
  const pdfResponse = await drive.files.export(
    { fileId: copyId, mimeType: 'application/pdf' },
    { responseType: 'arraybuffer' }
  );
  return Buffer.from(pdfResponse.data as ArrayBuffer);
}

async function uploadPDF(auth: OAuth2Client, pdfBuffer: Buffer, data: Income) {
  const drive = google.drive({ version: 'v3', auth });
  await drive.files.create({
    requestBody: {
      name: `${data.correlative}.pdf`,
      parents: [PDF_FOLDER_ID],
      mimeType: 'application/pdf',
    },
    media: {
      mimeType: 'application/pdf',
      body: Readable.from(pdfBuffer),
    },
  });
}

async function handleEmail(data: Income, pdfBuffer?: Buffer) {
  const emailData = {
    to: data.emailUser,
    subject: pdfBuffer ? 'PDF Generado' : 'Notificación',
    text: pdfBuffer ? 'Aquí está el PDF solicitado.' : 'El PDF no ha sido generado.',
    attachment: pdfBuffer || Buffer.from(''),
    filename: pdfBuffer ? `${data.correlative}.pdf` : '',
  };
  sendEmailWithAttachment(emailData); // Send email without waiting
}

async function createDocumentAndGeneratePDF(data: Income): Promise<string> {
  try {
    const auth = await authenticate();
    const docs = google.docs({ version: 'v1', auth: auth as OAuth2Client });
    const copyId = await copyTemplateDocument(auth as OAuth2Client, data);

    if (data.statusPayment === 'A') {
      const batchUpdateRequests = prepareBatchUpdateRequests(data, copyId);
      await docs.documents.batchUpdate(batchUpdateRequests);

      const pdfBuffer = await generatePDF(auth as OAuth2Client, copyId);
      await uploadPDF(auth as OAuth2Client, pdfBuffer, data);
      handleEmail(data, pdfBuffer);

      return JSON.stringify({ success: true, message: 'PDF generado y enviado por correo electrónico.' });
    } else if (data.statusPayment === 'R') {
      handleEmail(data);
      return JSON.stringify({ success: true, message: 'Correo enviado pero el PDF no fue generado.' });
    } else {
      console.error('Estado de pago no válido:', data.statusPayment);
      return JSON.stringify({ success: false, message: 'Estado de pago no válido.' });
    }
  } catch (error) {
    console.error('Error:', error);
    return JSON.stringify({ success: false, message: 'Error al procesar la solicitud.' });
  }
}

export { createDocumentAndGeneratePDF };
