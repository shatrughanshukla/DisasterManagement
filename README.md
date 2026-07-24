# 🌍 SafeEd – Disaster Management E-Learning Platform [SIH25008]

SafeEd is a **gamified e-learning platform** designed to make disaster preparedness engaging and interactive for students.  
It combines **real-time alerts, AI-powered guidance, gamified drills, and school analytics** to help institutions stay prepared 🚨.

---

## ✨ Features

- 🔐 **Secure Auth:** Student/Teacher login with JWT, bcrypt, OAuth, Firebase Auth  
- 🎮 **Interactive Drills:** Earthquake, Fire, Flood modules with Phaser.js 2D games  
- 📊 **Preparedness Dashboard:** Scores, badges, leaderboards, and certificates  
- 🌐 **Live Alerts:** Real-time data from USGS Earthquake API & OpenWeatherMap  
- 🤖 **AI Chatbot:** Gemini LLM-based chatbot for FAQs & disaster guidance  
- 👥 **Analytics:** YOLO + MediaPipe crowd detection for school drill reports  

---

## ⚙️ Tech Stack

- **Frontend/UI:** React, Vite, Tailwind CSS, shadcn  
- **Games:** Phaser.js (2D disaster simulations)  
- **Backend/Auth:** Firebase Auth, Firestore, JWT, bcrypt, OAuth  
- **APIs:** USGS Earthquake API, OpenWeatherMap  
- **AI/ML:** Gemini LLM (chatbot), YOLO + MediaPipe (crowd detection)  

---

## 🚀 Installation

1. Clone the repo  
```bash
git clone https://github.com/yourusername/SafeEd.git
cd SafeEd
```
2. Install frontend dependencies
```bash
cd frontend
npm install && npm run dev
```
3. Install backend dependencies
```bash
cd backend
npm install && nodemon server.js
```
4. Run backend functions / Firestore for persistence.
5. Run Gemini Chatbot
```bash
pip install -r requirements.txt
python app.py
``` 
6. Project will run on:
```bash
Frontend -> http://localhost/3000
Backend -> http://localhost/5000
Gemini LLM Chatbot -> http://localhost/5001
```
---
# 🎯 Use Cases

- 🏫 Students: Learn disaster safety via games & tasks  
- 👩‍🏫 Teachers: Monitor preparedness and drill reports  
- 🛠️ Institutions: Get analytics for drills & compliance  
- 📚 Education: Make disaster awareness interactive  

---

# 🤝 Contributions

Contributions are welcome!  

- Found a bug? 🐞  
- Want to add a new drill/game? 🎮  
- Have an optimization? ⚡  

Feel free to Submit a **Pull Request**, open a **Discussion** or connect with me at **[LinkedIn](https://www.linkedin.com/in/shivanshranadtu/)**


<p align="center"> ✨ *Preparedness Saves Lives* ✨ </p>
