// ===============================
// SCROLL FRAME ANIMATION
// ===============================

const canvas = document.getElementById("frameCanvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const frameCount = 240;
const currentFrame = index =>
    `frames/ezgif-frame-${String(index).padStart(3, '0')}.jpg`;

const images = [];
const img = new Image();

for (let i = 1; i <= frameCount; i++) {
    const image = new Image();
    image.src = currentFrame(i);
    images.push(image);
}

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
}

window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const frameIndex = Math.min(
        frameCount - 1,
        Math.floor((scrollTop / maxScroll) * frameCount)
    );

    img.src = images[frameIndex].src;
    render();
});

// ===============================
// CHATBOT USING GEMINI 2.5 FLASH
// ===============================

const API_KEY = "YOUR_GEMINI_API_KEY";

const RESUME_CONTENT = `
Name: Jegadheesh M
Role: AI Development
Phone: 9360185287
Email: jegadheeshjega492@gmail.com
Address: 8/6 New Colony, Vasudevanallur, Tenkasi District
Education: BE-ECE, Government College of Engineering, Tirunelveli (2024 - Pursuing)
Skills: Supervision, Team Management, Training
Profile: AI systems trained using ML and DL, applications in healthcare, finance, etc.
`;

async function sendMessage() {
    const input = document.getElementById("userInput");
    const message = input.value.trim();
    if (!message) return;

    addMessage("You", message);
    input.value = "";

    const systemPrompt = `
You are a strict resume assistant.

You MUST answer only using the information provided below.
If the question is not related to this resume or information is missing,
respond exactly with:
"I can only answer questions related to the uploaded resume."

Resume Content:
${RESUME_CONTENT}
`;

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: systemPrompt + "\nUser Question: " + message }]
                    }
                ]
            })
        }
    );

    const data = await response.json();
    const botReply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Error retrieving response.";

    addMessage("Bot", botReply);
}

function addMessage(sender, text) {
    const chat = document.getElementById("chatMessages");
    const msg = document.createElement("div");
    msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
}
