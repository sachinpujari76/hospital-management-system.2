import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI on the server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint 1: AI Clinical Symptom Triage & Doctor Recommendation
app.post('/api/ai/symptom-triage', async (req, res) => {
  try {
    const { symptoms, age, gender } = req.body;

    if (!symptoms) {
      return res.status(400).json({ error: 'Symptoms are required' });
    }

    const prompt = `You are a clinical decision support assistant for a hospital management system.
A patient has provided the following symptoms:
- Symptoms: "${symptoms}"
- Age: ${age || 'Not specified'}
- Gender: ${gender || 'Not specified'}

Analyze the symptoms and provide a structured JSON response with the following format:
{
  "triageLevel": "Routine" | "Urgent" | "Emergency",
  "suggestedDepartment": "Cardiology" | "Neurology" | "Pediatrics" | "Orthopedics" | "Pulmonology" | "Internal Medicine" | "Emergency & Trauma",
  "recommendedDoctorSpecialty": "e.g. Interventional Cardiologist",
  "reasoning": "Clear 2-sentence clinical reasoning explaining the likely etiology and why this specialist is appropriate.",
  "recommendedTests": ["Test 1", "Test 2"],
  "firstAidTips": ["Tip 1", "Tip 2"],
  "plainSummary": "A simplified, friendly 1-2 sentence explanation for the patient or student evaluator."
}

Return strictly valid JSON only. Do not wrap in markdown quotes if possible or return raw JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in symptom-triage:', error);
    return res.status(500).json({ 
      error: 'Failed to generate AI triage', 
      details: error?.message || 'Server error' 
    });
  }
});

// Endpoint 2: AI Medical Report Explainer (Simplifies lab values into plain English)
app.post('/api/ai/explain-report', async (req, res) => {
  try {
    const { testName, parameters, patientName } = req.body;

    const prompt = `You are an expert clinical pathologist simplifying a medical lab report for a patient or college student presentation.
Test Name: ${testName}
Patient: ${patientName || 'Inpatient'}
Biomarkers & Results:
${JSON.stringify(parameters, null, 2)}

Provide a structured JSON response:
{
  "summaryTitle": "Concise headline of the report status (e.g., 'Mild Post-Surgical Anemia Detected' or 'Elevated Cardiac Biomarkers')",
  "overallStatus": "Normal" | "Attention Required" | "Critical Alert",
  "simplifiedExplanation": "3-4 bullet-friendly sentences explaining what each elevated or abnormal value actually means in everyday plain English (avoiding confusing medical jargon).",
  "clinicalAction": "What the doctor or healthcare team will likely do next (e.g. continue monitoring, adjust medication, repeat test in 4 hours).",
  "questionsForDoctor": [
    "Question 1 patient should ask",
    "Question 2 patient should ask"
  ]
}

Return strictly valid JSON only.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in explain-report:', error);
    return res.status(500).json({ 
      error: 'Failed to explain report', 
      details: error?.message || 'Server error' 
    });
  }
});

// Endpoint 3: AI Quick Clinical Care Plan Generator
app.post('/api/ai/care-plan', async (req, res) => {
  try {
    const { diagnosis, patientAge, condition } = req.body;

    const prompt = `You are a hospital care coordinator.
Generate a concise patient care and recovery guide for:
- Diagnosis: ${diagnosis}
- Age: ${patientAge}
- Current Condition: ${condition}

Provide structured JSON:
{
  "dietaryAdvice": ["Diet tip 1", "Diet tip 2"],
  "activityGuidelines": "Activity restriction or mobilization instructions",
  "warningSigns": ["Call nurse/doctor if symptom 1", "Call if symptom 2"],
  "followUpTiming": "Recommended follow-up window (e.g. 5 days)"
}

Return strictly valid JSON only.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in care-plan:', error);
    return res.status(500).json({ 
      error: 'Failed to generate care plan', 
      details: error?.message || 'Server error' 
    });
  }
});

// Mount Vite middleware in development
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Hospital Management Server running on port ${PORT}`);
  });
}

startServer();
