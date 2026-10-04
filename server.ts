import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Initialize Google GenAI with telemetry header
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

function getSampleFallback(hint = '') {
  const h = hint.toLowerCase();
  if (h.includes('garbage') || h.includes('waste') || h.includes('trash')) {
    return {
      is_civic_issue: true,
      issue_type: 'Overflowing Solid Waste Vat (Demo Analysis)',
      category: 'garbage',
      severity: 'High',
      severity_reason: 'Accumulated decomposing municipal solid waste encroaching onto public walkway.',
      description: 'An overflowing community waste vat is spilling onto the pedestrian sidewalk and roadway. The decomposing waste creates a severe health hazard, foul odor, and attracts stray animals. Immediate clearance by municipal compactor is requested.',
      suggested_department: 'Kolkata Municipal Corporation – Solid Waste Management (SWM)',
      risk_to_public: 'Vector-borne disease transmission, pedestrian forced into moving traffic',
      confidence: 0.93,
      is_sample_fallback: true,
    };
  }
  if (h.includes('water') || h.includes('flood') || h.includes('drain')) {
    return {
      is_civic_issue: true,
      issue_type: 'Severe Street Waterlogging & Blocked Drain (Demo Analysis)',
      category: 'waterlogging',
      severity: 'Critical',
      severity_reason: 'Stagnant rainwater reaching 20cm depth due to silted roadside gully pits.',
      description: 'The street corridor is severely waterlogged following showers due to choked underground drains. Commuters and two-wheelers are experiencing extreme disruption, with hidden open kerbs creating fatal accident hazards. Immediate deployment of high-capacity suction pumps is solicited.',
      suggested_department: 'Kolkata Municipal Corporation – Drainage & Sewerage Department',
      risk_to_public: 'Submerged road hazard, vehicle stalling, vector breeding, electrocution risk',
      confidence: 0.95,
      is_sample_fallback: true,
    };
  }
  if (h.includes('light') || h.includes('lamp')) {
    return {
      is_civic_issue: true,
      issue_type: 'Inoperative Streetlight Luminaire (Demo Analysis)',
      category: 'streetlight',
      severity: 'Medium',
      severity_reason: 'Non-functional overhead street luminaire creating a dark pocket on a public street.',
      description: 'The street luminaire on this utility pole is inoperative, causing darkness across this road stretch at night. Absence of road lighting increases pedestrian vulnerability and collision risk. Timely bulb replacement is requested.',
      suggested_department: 'Kolkata Municipal Corporation – Lighting & Electrical Department',
      risk_to_public: 'Night-time collision hazard, reduced pedestrian visibility and safety',
      confidence: 0.92,
      is_sample_fallback: true,
    };
  }

  // Default pothole fallback
  return {
    is_civic_issue: true,
    issue_type: 'Deep Carriageway Pothole with Standing Water (Demo Analysis)',
    category: 'pothole',
    severity: 'Critical',
    severity_reason: 'A deep road crater exceeding 12cm depth in active vehicle carriage lane with standing water.',
    description: 'A dangerous pothole has developed along the primary traffic corridor, measuring approximately 1.2 meters across. Water accumulation conceals depth, creating an immediate rollover hazard for two-wheelers and buses. Urgent mastic asphalt patch repair is solicited.',
    suggested_department: 'Kolkata Municipal Corporation – Roads & Engineering Department',
    risk_to_public: 'Two-wheeler rollover risk, vehicle axle shock, pedestrian injury in dark hours',
    confidence: 0.96,
    is_sample_fallback: true,
  };
}

// POST endpoint: /api/analyze-issue
app.post('/api/analyze-issue', async (req, res) => {
  const { image, mimeType, sampleHint, city = 'Kolkata' } = req.body;

  if (!image) {
    return res.status(400).json({
      success: false,
      error: 'An image is required for civic issue analysis.',
    });
  }

  // If Gemini AI is not configured, return realistic demo analysis immediately
  if (!ai) {
    return res.json({
      success: true,
      analysis: getSampleFallback(sampleHint || image),
      source: 'sample_demo_mode',
    });
  }

  try {
    let base64Data = '';
    let resolvedMimeType = mimeType || 'image/jpeg';

    if (image.startsWith('data:')) {
      const parts = image.split(';base64,');
      if (parts.length === 2) {
        resolvedMimeType = parts[0].replace('data:', '') || resolvedMimeType;
        base64Data = parts[1];
      } else {
        base64Data = image;
      }
    } else if (image.startsWith('http://') || image.startsWith('https://')) {
      // Remote image URL: fetch on server side
      const fetchRes = await fetch(image);
      if (!fetchRes.ok) {
        return res.json({
          success: true,
          analysis: getSampleFallback(sampleHint || image),
          source: 'sample_fallback_url_fetch_failed',
        });
      }
      const arrayBuf = await fetchRes.arrayBuffer();
      base64Data = Buffer.from(arrayBuf).toString('base64');
      const ct = fetchRes.headers.get('content-type');
      if (ct) resolvedMimeType = ct.split(';')[0];
    } else {
      base64Data = image;
    }

    const systemPrompt = `You are a strict, objective civic infrastructure inspector for Indian municipal corporations (specifically ${city} / Kolkata Municipal Corporation).
Inspect the submitted photograph with high civic rigor.

DETERMINE:
1. Is this genuinely a public civic/municipal infrastructure failure?
   - If it is a person/selfie, animal/pet, indoor room, food, private property interior, clean car, or blurry unrecognizable photo:
     Set "is_civic_issue" to false. Set "issue_type" to "No civic issue detected". Set "category" to "other". Set "severity" to "Low". Set "severity_reason" to "No public road, drain, waste, or lighting hazard detected in photo.". Set "description" to "No civic or municipal infrastructure failure detected in this photograph.". Set "risk_to_public" to "None". Set "confidence" to 0.95.
     DO NOT INVENT OR HALLUCINATE A PROBLEM IF NONE IS VISIBLE.

2. If and only if a real civic hazard is visibly present on a road, street, sidewalk, drain, utility pole, or public area:
   - "is_civic_issue": true
   - "issue_type": Concise, official title (e.g. "Deep Road Pothole with Standing Water", "Overflowing Solid Waste Vat", "Inoperative Streetlight Luminaire", "Choked Surface Storm Drain", "Monsoon Road Waterlogging", "Broken Concrete Footpath Slabs")
   - "category": MUST be one of ["pothole", "garbage", "streetlight", "drain", "waterlogging", "footpath", "other"]
   - "severity": EXACTLY one of ["Low", "Medium", "High", "Critical"]
     * "Critical": Immediate risk of fatal accident, deep concealed pothole in motor lane, open deep manhole, sparking live wire, waterlogging trapping vehicles.
     * "High": Major road obstruction, large decomposing garbage heap near public market/school, complete dark stretch on busy road.
     * "Medium": Noticeable pavement depression, overflowing roadside dustbin, broken footpath slab.
     * "Low": Minor surface crack, light litter.
   - "severity_reason": 1-2 factual sentences citing the exact physical danger.
   - "description": A formal, administrative 3-4 sentence complaint petition text suitable for submission to the Municipal Commissioner or Borough Executive Engineer under the Right to Public Services Act.
   - "suggested_department": Responsible department in ${city} (e.g. "Kolkata Municipal Corporation – Roads & Engineering Department", "Kolkata Municipal Corporation – Solid Waste Management (SWM)", "Kolkata Municipal Corporation – Drainage & Sewerage Department", "Kolkata Municipal Corporation – Lighting & Electrical Department").
   - "risk_to_public": Specific public safety hazards (e.g. "Two-wheeler rollover risk, vehicle axle damage, pedestrian tripping in darkness, vector-borne disease breeding").
   - "confidence": A decimal number between 0 and 1 representing confidence in the detection.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: resolvedMimeType,
            },
          },
          {
            text: `Analyze this image taken in ${city}, India. Determine if it is a civic issue and return the structured JSON evaluation.`,
          },
        ],
      },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            is_civic_issue: { type: Type.BOOLEAN },
            issue_type: { type: Type.STRING },
            category: {
              type: Type.STRING,
              enum: ['pothole', 'garbage', 'streetlight', 'drain', 'waterlogging', 'footpath', 'other'],
            },
            severity: {
              type: Type.STRING,
              enum: ['Low', 'Medium', 'High', 'Critical'],
            },
            severity_reason: { type: Type.STRING },
            description: { type: Type.STRING },
            suggested_department: { type: Type.STRING },
            risk_to_public: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
          },
          required: [
            'is_civic_issue',
            'issue_type',
            'category',
            'severity',
            'severity_reason',
            'description',
            'suggested_department',
            'risk_to_public',
            'confidence',
          ],
        },
      },
    });

    const rawText = response.text || '';
    if (!rawText.trim()) {
      return res.json({
        success: true,
        analysis: getSampleFallback(sampleHint || image),
        source: 'sample_fallback_empty_ai_response',
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(rawText.trim());
    } catch {
      const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    }

    return res.json({
      success: true,
      analysis: parsed,
      source: 'gemini_vision',
    });
  } catch (error: any) {
    console.warn('Gemini vision API error, falling back to labelled sample result:', error?.message);
    return res.json({
      success: true,
      analysis: getSampleFallback(sampleHint || image),
      source: 'sample_demo_fallback',
      notice: 'Gemini vision fell back to sample inspection result.',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`CivicLens server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
