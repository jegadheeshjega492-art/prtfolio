const html = document.documentElement;
const canvas = document.getElementById("hero-lightpass");
const context = canvas.getContext("2d");

const frameCount = 240;
const currentFrame = index => (
  `./frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
);

// Preload images
const images = [];
for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

// Draw first frame
const img = new Image();
img.src = currentFrame(1);
canvas.width = 1920;
canvas.height = 1080;
img.onload = function() {
  context.drawImage(img, 0, 0);
}

// Update image on scroll
window.addEventListener('scroll', () => {  
  const scrollTop = html.scrollTop;
  const maxScrollTop = html.scrollHeight - window.innerHeight;
  const scrollFraction = scrollTop / maxScrollTop;
  const frameIndex = Math.min(
    frameCount - 1,
    Math.ceil(scrollFraction * frameCount)
  );
  
  requestAnimationFrame(() => updateImage(frameIndex + 1));
});

const updateImage = index => {
  context.drawImage(images[index - 1], 0, 0);
}

// --- Chatbot Logic ---
const API_KEY = "YOUR_GEMINI_API_KEY"; // Replace with your key
const RESUME_DATA = `
Jegadheesh.M - AI Development
Contact: 9360185287, jegadheeshjega492@gmail.com
Address: 8/6 new colony, vasudevanallur, tenkasi district
Education: BE-ECE, Government College of Engineering, Tirunelveli (2024 - Pursuing)
Skills: Supervision, Training, Team Management.
`;

const SYSTEM_PROMPT = `You are a professional assistant for Jegadheesh.M. 
Answer questions ONLY using the following resume data: ${RESUME_DATA}. 
If a user asks something not in this data, politely say you only have information regarding his professional resume.`;

async function sendMessage() {
    const input = document.getElementById('user-input');
    const body = document.getElementById('chat-body');
    if (!input.value) return;

    body.innerHTML += `<div><b>You:</b> ${input.value}</div>`;
    
    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: `${SYSTEM_PROMPT} \n\n User Question: ${input.value}` }] }]
        })
    });

    const data = await response.json();
    const botText = data.candidates[0].content.parts[0].text;
    
    body.innerHTML += `<div><b>Bot:</b> ${botText}</div>`;
    input.value = '';
    body.scrollTop = body.scrollHeight;
}
