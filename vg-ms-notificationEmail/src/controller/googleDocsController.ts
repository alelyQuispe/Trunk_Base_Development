import { Request, Response } from 'express';
import { createDocumentAndGeneratePDF } from '../service/IncomeService';
import { Income } from '../models/Income';

export async function generatePDF(req: Request, res: Response) {
  try {
    const data: Income = req.body;
    const result = await createDocumentAndGeneratePDF(data);
    res.status(200).json(JSON.parse(result));
  } catch (error) {
    console.error('Error en generatePDF:', error);
    res.status(500).json({ success: false, message: 'Error al generar el PDF.' });
  }
}
