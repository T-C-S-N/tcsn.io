// Simple test server
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => {
  res.json({ status: 'OK', message: 'Test server working' });
});

app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
});
