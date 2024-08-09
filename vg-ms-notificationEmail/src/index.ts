import express from 'express';
import { generatePDF } from './controller/googleDocsController';

const app = express();
app.use(express.json());

app.post('/generate-pdf', generatePDF);

const PORT = 9000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
