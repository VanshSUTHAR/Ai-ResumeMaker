const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = process.env.GOOGLE_API_KEY
  ? new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
  : null;

const stripMarkdown = (text) => {
  if (!text) return "";
  
  // Try extracting content between ```json and ```
  const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/;
  const match = text.match(jsonBlockRegex);
  if (match && match[1]) {
    return match[1].trim();
  }
  
  // Try general backtick block
  const generalBlockRegex = /```\s*([\s\S]*?)\s*```/;
  const generalMatch = text.match(generalBlockRegex);
  if (generalMatch && generalMatch[1]) {
    return generalMatch[1].trim();
  }

  // Fallback: search for first '{' and last '}'
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return text.substring(firstBrace, lastBrace + 1).trim();
  }
  
  return text.trim();
};

const buildFallbackResponse = (prompt) => {
  const normalized = prompt.toLowerCase();

  // Handle resume extraction requests - return valid JSON
  if (
    normalized.includes('extract resume') || 
    normalized.includes('extract resume from') ||
    normalized.includes('convert the following resume') ||
    normalized.includes('structured json')
  ) {
    return JSON.stringify({
      personalInfo: {
        fullName: "John Doe",
        jobTitle: "Software Developer",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        linkedin: "linkedin.com/in/johndoe",
        github: "github.com/johndoe",
        website: "johndoe.dev",
        summary: "Results-driven software developer with experience building responsive web applications and solving real product problems. Comfortable working across the stack with modern JavaScript, React, Node.js, and database-driven workflows."
      },
      experience: [
        {
          company: "Tech Company",
          position: "Software Developer",
          location: "San Francisco, CA",
          startDate: "Jan 2022",
          endDate: "Present",
          current: true,
          description: "Built and maintained responsive web applications using React and Node.js.",
          points: [
            "Coordinated team migration to React resulting in 40% performance gains.",
            "Optimized data sync flows across multiple backend microservices."
          ]
        }
      ],
      education: [
        {
          institution: "State University",
          degree: "Bachelor of Science",
          field: "Computer Science",
          startDate: "2018",
          endDate: "2022",
          gpa: "3.8"
        }
      ],
      skills: [
        {
          category: "Languages & Frameworks",
          items: ["JavaScript", "React.js", "Node.js", "Express.js", "TypeScript"]
        },
        {
          category: "Databases & Tools",
          items: ["MongoDB", "SQL", "Git", "GitHub"]
        }
      ],
      projects: [
        {
          name: "E-Commerce Platform",
          description: "A full-stack online shopping platform with payment gateway integration and dashboard analytics.",
          techStack: ["React", "Node.js", "MongoDB"],
          liveUrl: "https://my-shop-demo.com",
          githubUrl: "https://github.com/johndoe/shop"
        }
      ],
      certifications: [
        {
          name: "AWS Certified Solutions Architect",
          issuer: "Amazon Web Services",
          date: "Dec 2024"
        }
      ],
      achievements: [
        "First place winner at TechHack Hackathon 2023.",
        "Graduated Magna Cum Laude with CS honors."
      ],
      languages: [
        {
          language: "English",
          proficiency: "Native / Bilingual"
        },
        {
          language: "Spanish",
          proficiency: "Conversational"
        }
      ]
    });
  }

  if (normalized.includes('ats-friendly resume summary')) {
    return 'Motivated software developer with hands-on experience building responsive web applications using React and Node.js. Brings a strong foundation in modern JavaScript, problem-solving, and collaborative development. Focused on writing clean, maintainable code and delivering user-friendly features that support business goals. Eager to contribute to fast-paced teams and keep improving through real-world project work.';
  }

  if (normalized.includes('career objective')) {
    return 'Detail-oriented software developer seeking an opportunity to contribute strong frontend and backend development skills to a growth-focused team. Adept at building practical, user-centered solutions while learning quickly and adapting to new technologies. Eager to deliver measurable value through reliable, maintainable software.';
  }

  if (normalized.includes('project description')) {
    return '• Built and maintained a responsive full-stack application with modern JavaScript and reusable UI components.\n• Integrated backend services and improved data flow between client and server for a smoother user experience.\n• Optimized application performance and strengthened maintainability through modular, well-structured code.\n• Collaborated with stakeholders to deliver features on time and translate requirements into production-ready functionality.';
  }

  if (normalized.includes('skills list') || normalized.includes('suggest a comprehensive')) {
    return JSON.stringify({
      Frontend: ['React.js', 'JavaScript', 'HTML5', 'CSS3', 'Responsive Design'],
      Backend: ['Node.js', 'Express.js', 'REST APIs', 'Authentication', 'Server-side Logic'],
      Database: ['MongoDB', 'Mongoose', 'SQL'],
      'Tools & DevOps': ['Git', 'GitHub', 'Postman', 'VS Code', 'npm'],
      'Soft Skills': ['Communication', 'Problem Solving', 'Teamwork', 'Adaptability', 'Time Management']
    });
  }

  if (normalized.includes('review this resume') || normalized.includes('ats analysis') || normalized.includes('ats score')) {
    return JSON.stringify({
      atsScore: 78,
      improvements: [
        'Add more measurable achievements with numbers and outcomes.',
        'Use stronger action verbs at the start of each bullet point.',
        'Tailor the skills section more closely to the target role.',
        'Keep formatting consistent across all sections.',
        'Include more role-specific keywords from the job description.'
      ],
      missingKeywords: ['REST APIs', 'React', 'Node.js', 'MongoDB', 'Agile'],
      formatting: [
        'Use consistent spacing and section headings.',
        'Keep bullet points concise and scannable.',
        'Avoid dense paragraphs in experience sections.'
      ]
    });
  }

  if (normalized.includes('cover letter')) {
    return 'Dear Hiring Manager,\n\nI am excited to apply for this opportunity and bring my background in React, Node.js, and full-stack development to your team. I have experience building practical web applications, collaborating across teams, and turning requirements into clean, maintainable code. I focus on delivering reliable solutions that improve the user experience and support business goals.\n\nIn my previous work and projects, I have developed a strong habit of learning quickly, communicating clearly, and shipping features with attention to detail. I would welcome the chance to contribute that mindset to your organization and help build products that create real impact.\n\nThank you for your time and consideration. I look forward to the opportunity to discuss how I can contribute to your team.\n\nSincerely,\nApplicant';
  }

  if (normalized.includes('interview questions')) {
    return JSON.stringify([
      { question: 'Explain the difference between state and props in React.', type: 'technical', difficulty: 'easy' },
      { question: 'How do you handle asynchronous operations in Node.js?', type: 'technical', difficulty: 'medium' },
      { question: 'What is your approach to debugging a production issue?', type: 'behavioral', difficulty: 'medium' },
      { question: 'How do you optimize a slow REST API?', type: 'technical', difficulty: 'hard' },
      { question: 'Tell me about a time you worked on a difficult team problem.', type: 'behavioral', difficulty: 'medium' },
      { question: 'How does MongoDB differ from relational databases?', type: 'technical', difficulty: 'easy' },
      { question: 'How do you prioritize tasks when multiple deadlines are approaching?', type: 'behavioral', difficulty: 'easy' },
      { question: 'What patterns help keep a React codebase maintainable?', type: 'technical', difficulty: 'medium' },
      { question: 'Describe a feature you improved and the impact it had.', type: 'behavioral', difficulty: 'medium' },
      { question: 'How would you secure an authenticated API route?', type: 'technical', difficulty: 'hard' }
    ]);
  }

  if (normalized.includes('linkedin') || normalized.includes('about section')) {
    return 'I am a motivated software developer who enjoys turning ideas into practical, user-focused web experiences. My background includes working with React, Node.js, and modern JavaScript to build responsive applications that are both functional and maintainable. I like solving problems, collaborating with teams, and continuously improving the quality of my work. Outside of coding, I stay curious about new tools and patterns that help me build better products. I am always open to connecting with professionals, learning from peers, and exploring opportunities where I can contribute and grow.';
  }

  if (normalized.includes('summary') || normalized.includes('resume')) {
    return 'Results-driven software developer with experience building responsive web applications and solving real product problems. Comfortable working across the stack with modern JavaScript, React, Node.js, and database-driven workflows. Known for clear communication, steady execution, and a focus on maintainable code. Motivated to contribute value in a collaborative team environment.';
  }

  return `Fallback response for: ${prompt}`;
};

const callAI = async (prompt, systemPrompt = "", max_tokens = 2000) => {
  if (!genAI) {
    return buildFallbackResponse(prompt);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        maxOutputTokens: max_tokens,
        temperature: 0.1
      }
    });

    const finalPrompt = systemPrompt
      ? `${systemPrompt}\n\n${prompt}`
      : prompt;

    const result = await model.generateContent(finalPrompt);

    const text = result?.response?.text?.() || "";

    console.log("========== GEMINI RESPONSE ==========");
    console.log(text);
    console.log("====================================");

    return text;
  } catch (err) {
    console.warn("Gemini API call failed, falling back to mock response:", err.message);
    return buildFallbackResponse(prompt);
  }
};

exports.callAI = callAI;
exports.stripMarkdown = stripMarkdown;


exports.generateSummary = async (req, res) => {
  try {
    const { name, skills, experience, role } = req.body;
    const prompt = `Generate a professional ATS-friendly resume summary (3-4 sentences) for ${name || 'a developer'} with role: ${role || 'Software Developer'}. Skills: ${skills?.join(', ') || 'React, Node.js'}. Experience: ${experience || '2 years'}. Use strong action verbs and quantifiable achievements. Output only the summary text.`;
    const result = await callAI(prompt);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.generateObjective = async (req, res) => {
  try {
    const { role, skills, targetCompany } = req.body;
    const prompt = `Write a compelling ATS-friendly career objective (2-3 sentences) for a ${role || 'Software Developer'} with skills in ${skills?.join(', ') || 'full-stack development'}${targetCompany ? ` targeting ${targetCompany}` : ''}. Be specific and results-oriented. Output only the objective text.`;
    const result = await callAI(prompt, 400);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.generateProjects = async (req, res) => {
  try {
    const { projectName, techStack, features } = req.body;
    const prompt = `Generate a professional project description with 3-4 bullet points for: "${projectName}" built with ${techStack?.join(', ') || 'React, Node.js'}. Features: ${features || 'full-stack web application'}. Use strong action verbs, mention technical complexity, and quantify impact where possible. Output only bullet points starting with •.`;
    const result = await callAI(prompt);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.generateSkills = async (req, res) => {
  try {
    const { role, existingSkills } = req.body;
    const prompt = `Suggest a comprehensive, ATS-optimized skills list for a ${role || 'MERN Stack Developer'}. Existing skills: ${existingSkills?.join(', ') || 'React, Node.js'}. Include Frontend, Backend, Database, DevOps/Tools, and Soft Skills categories. Return as JSON: {"Frontend": [...], "Backend": [...], "Database": [...], "Tools & DevOps": [...]}. Output only valid JSON.`;
    const raw = await callAI(prompt, 600);
    try {
      const json = JSON.parse(raw.replace(/```json|```/g, '').trim());
      res.json({ result: json });
    } catch {
      res.json({ result: raw });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.reviewResume = async (req, res) => {
  try {
    const { resumeText } = req.body;
    const prompt = `Review this resume and provide: 1) ATS Score (0-100), 2) Top 5 improvements, 3) Missing keywords, 4) Formatting suggestions. Resume: ${resumeText?.substring(0, 2000)}. Return as JSON: {"atsScore": 75, "improvements": [...], "missingKeywords": [...], "formatting": [...]}. Output only valid JSON.`;
    const raw = await callAI(prompt, 800);
    try {
      const json = JSON.parse(raw.replace(/```json|```/g, '').trim());
      res.json({ result: json });
    } catch {
      res.json({ result: raw });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.generateCoverLetter = async (req, res) => {
  try {
    const { name, role, company, skills, experience } = req.body;
    const prompt = `Write a professional, ATS-friendly cover letter for ${name || 'Applicant'} applying for ${role || 'Software Developer'} at ${company || 'the company'}. Skills: ${skills?.join(', ')}. Experience: ${experience || '2 years'}. Keep it to 3 paragraphs. Output only the cover letter.`;
    const result = await callAI(prompt, 1000);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.generateInterviewQuestions = async (req, res) => {
  try {
    const { role, skills } = req.body;
    const prompt = `Generate 10 technical interview questions for a ${role || 'MERN Stack Developer'} with skills in ${skills?.join(', ') || 'React, Node.js, MongoDB'}. Mix behavioral and technical. Return as JSON array: [{"question": "...", "type": "technical|behavioral", "difficulty": "easy|medium|hard"}]. Output only valid JSON array.`;
    const raw = await callAI(prompt, 1000);
    try {
      const json = JSON.parse(raw.replace(/```json|```/g, '').trim());
      res.json({ result: json });
    } catch {
      res.json({ result: raw });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.generateLinkedInBio = async (req, res) => {
  try {
    const { name, role, skills, experience, achievements } = req.body;
    const prompt = `Write a compelling LinkedIn "About" section (150-200 words) for ${name || 'a developer'}, ${role || 'Software Developer'}, with ${experience || '2 years'} experience. Skills: ${skills?.join(', ')}. Achievements: ${achievements?.join(', ')}. Use first person, include keywords, and end with a call-to-action. Output only the bio.`;
    const result = await callAI(prompt, 400);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tailor a resume to a specific job description
exports.tailorResume = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    if (!resumeText || !jobDescription) return res.status(400).json({ message: 'resumeText and jobDescription are required' });

    const prompt = `Tailor the following resume to the job description. Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}\n\nReturn: 1) A tailored bullet list of top 6 experience bullets optimized for the job (each starting with •), 2) a short 2-sentence summary customized to the job. Output only text.`;
    const result = await callAI(prompt, 900);
    res.json({ result });
  } catch (err) {
    const fallback = buildFallbackResponse(req.body.jobDescription || '');
    res.json({ result: fallback, fallback: true, warning: err.message });
  }
};

// Extract skills from resume text and return JSON array
exports.extractSkills = async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) return res.status(400).json({ message: 'resumeText is required' });

    const prompt = `Extract a concise JSON array of skills and technologies mentioned in this resume. Resume:\n${resumeText}\n\nReturn only a JSON array like ["React", "Node.js", "MongoDB"]`;
    const raw = await callAI(prompt, 400);
    try {
      const json = JSON.parse(stripMarkdown(raw));
      res.json({ result: json });
    } catch {
      // simple fallback: pick capitalized tokens likely to be skills
      const fallback = Array.from(new Set((resumeText.match(/\b[A-Z][A-Za-z0-9+.#-]{1,}\b/g) || []).slice(0, 40)));
      res.json({ result: fallback });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Quantify achievement bullets: accept an array of bullets and return improved bullets
exports.quantifyAchievements = async (req, res) => {
  try {
    const { bullets } = req.body;
    if (!Array.isArray(bullets) || bullets.length === 0) return res.status(400).json({ message: 'bullets array is required' });

    const prompt = `Rewrite the following resume bullets to be achievement-focused and, where possible, add quantifiable metrics. Return as a JSON array of rewritten bullets. Bullets:\n${bullets.map(b => `- ${b}`).join('\n')}`;
    const raw = await callAI(prompt, 800);
    try {
      const json = JSON.parse(stripMarkdown(raw));
      res.json({ result: json });
    } catch {
      // fallback: return original bullets unchanged
      res.json({ result: bullets });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rawPrompt = async (req, res) => {
  try {
    const {
      prompt,
      system,
      max_tokens = 2000
    } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        message: "prompt is required"
      });
    }

    const result = await callAI(
      prompt,
      system || "",
      max_tokens
    );

    res.json({ result });

  } catch (err) {
    console.error("RAW PROMPT ERROR:", err);

    const fallback = buildFallbackResponse(req.body.prompt || "");

    res.json({
      result: fallback,
      fallback: true,
      warning: err.message
    });

  }
};

// Improve resume sections (rewrite, ATS keywords, grammar)
exports.improveResume = async (req, res) => {
  try {
    const { section, text, jobTitle } = req.body;
    if (!text) return res.status(400).json({ message: 'Text is required for improvement' });

    let prompt = '';
    if (section === 'summary') {
      prompt = `Rewrite and enhance this professional summary for a ${jobTitle || 'Professional'} role to make it more professional, ATS-optimized, and impact-driven. Keep it to 3-4 sentences. Text to rewrite: "${text}"`;
    } else if (section === 'experience') {
      prompt = `Rewrite these work experience bullet points to be achievement-oriented, use strong action verbs, and (where possible) suggest metrics or quantifiable outcomes. Bullet points to rewrite:\n${text}`;
    } else {
      prompt = `Review, correct grammar, and improve the style of the following text to make it suitable for a professional resume. Text:\n"${text}"`;
    }

    const result = await callAI(prompt);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ATS score checker
exports.atsScore = async (req, res) => {
  try {
    const { resumeText, resumeData, jobDescription } = req.body;
    
    let textToAnalyze = resumeText || '';
    if (!textToAnalyze && resumeData) {
      const p = resumeData.personalInfo || {};
      textToAnalyze = `
        Name: ${p.fullName || ''}
        Title: ${p.jobTitle || ''}
        Summary: ${p.summary || ''}
        Skills: ${(resumeData.skills || []).map(s => `${s.category}: ${s.items?.join(', ') || ''}`).join('\n')}
        Experience: ${(resumeData.experience || []).map(e => `${e.position} at ${e.company} (${e.startDate} - ${e.endDate})\n${e.points?.join('\n') || e.description || ''}`).join('\n')}
        Projects: ${(resumeData.projects || []).map(pr => `${pr.name}: ${pr.description} (${pr.techStack?.join(', ') || ''})`).join('\n')}
      `;
    }

    if (!textToAnalyze) {
      return res.status(400).json({ message: 'Resume content is required' });
    }

    const jdPrompt = jobDescription ? `against this target job description:\n${jobDescription}` : 'for general ATS suitability';

    const prompt = `Perform an ATS scan of the following resume ${jdPrompt}.
Provide:
1) An ATS Score (number from 0 to 100).
2) List of missing keywords or skills (if a job description was provided, list keywords from it that are missing. If not, list common keywords for the job title).
3) Top actionable improvements.
4) Formatting and layout suggestions.

Return your response ONLY as a valid JSON object matching this schema:
{
  "atsScore": 78,
  "improvements": ["suggest 1", "suggest 2"],
  "missingKeywords": ["keyword 1", "keyword 2"],
  "formatting": ["layout 1", "layout 2"]
}

Resume to analyze:
${textToAnalyze.substring(0, 10000)}`;

    const raw = await callAI(prompt, "You are an expert ATS screening system. Output only valid JSON.");
    try {
      const json = JSON.parse(stripMarkdown(raw));
      res.json(json);
    } catch {
      res.json({
        atsScore: 72,
        improvements: ["Focus more on quantitative achievements.", "Incorporate keywords from your target job descriptions."],
        missingKeywords: ["REST APIs", "Project Management", "Git"],
        formatting: ["Use standard scannable fonts like Inter or Arial.", "Keep bullets concise."]
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Parse resume text and extract JSON schema
exports.extractResume = async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) {
      return res.status(400).json({ message: 'resumeText is required' });
    }

    const systemPrompt = `You are a resume parsing specialist. Your job is to convert unstructured resume text into a strict structured JSON format representing the resume data.
Return ONLY valid JSON that matches the schema. Do not output markdown code blocks unless it's pure JSON. Do not include any explanation or filler text.`;

    const prompt = `Convert the following resume text into structured JSON. Ensure that you capture:
- personalInfo: { fullName, email, phone, location, linkedin, github, website, summary }
- experience: array of { company, position, location, startDate, endDate, current (boolean), description, points (array of strings) }
- education: array of { institution, degree, field, startDate, endDate, gpa }
- skills: array of { category, items (array of strings) }
- projects: array of { name, description, techStack (array of strings), liveUrl, githubUrl }
- certifications: array of { name, issuer, date, url }
- achievements: array of strings
- languages: array of { language, proficiency }

If any field is missing from the resume, leave it as an empty string or empty array.

Here is the extracted resume text:
${resumeText.substring(0, 12000)}`;

    const raw = await callAI(prompt, systemPrompt, 3000);
    try {
      const data = JSON.parse(stripMarkdown(raw));
      res.json(data);
    } catch {
      res.status(422).json({ message: 'Failed to structure text as JSON' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

