const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const stripMarkdown = (text) => text.replace(/```json|```/g, '').trim();

const extractPromptSection = (prompt, label) => {
  const match = prompt.match(new RegExp(`${label}:\\s*([^\\n]+)`, 'i'));
  return match?.[1]?.trim() || '';
};

const buildFallbackResponse = (prompt) => {
  const normalized = prompt.toLowerCase();

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

const callAI = async (prompt, max_tokens = 800) => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: { maxOutputTokens: max_tokens, temperature: 0.7 }
  });
  const result = await model.generateContent(prompt);
  return result.response.text();
};

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

exports.rawPrompt = async (req, res) => {
  try {
    const { prompt, max_tokens } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ message: 'prompt is required' });
    }

    const result = await callAI(prompt, max_tokens || 800);
    res.json({ result });
  } catch (err) {
    const fallback = buildFallbackResponse(req.body.prompt || '');
    res.json({ result: fallback, fallback: true, warning: err.message });
  }
};