/* ==========================================
   AskNemuAI - Interactive Script Logic
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Sticky Navbar & Active Navigation items ---
  const header = document.getElementById('header');
  const navItems = document.querySelectorAll('.nav-item');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- 2. Mobile Menu Toggle ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-links a');

  mobileToggle.addEventListener('click', () => {
    const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
    
    // Toggle icon between hamburger and close
    const icon = mobileToggle.querySelector('i');
    if (navMenu.classList.contains('active')) {
      icon.className = 'fa-solid fa-xmark';
    } else {
      icon.className = 'fa-solid fa-bars';
    }
  });

  // Close mobile nav when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
    });
  });

  // --- 3. Intersection Observer for Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Reveal once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- 4. Counter Animation for Statistics ---
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const countUp = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        clearInterval(timer);
        formatStat(element, target);
      } else {
        formatStat(element, Math.floor(current));
      }
    }, stepTime);
  };

  const formatStat = (el, val) => {
    if (val >= 1000) {
      el.textContent = (val / 1000).toFixed(0) + 'k+';
    } else if (val === 95) {
      el.textContent = val + '%';
    } else if (val === 24) {
      el.textContent = val + '/7';
    } else {
      el.textContent = val + '+';
    }
  };

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  statNumbers.forEach(num => statsObserver.observe(num));

  // --- 5. Interactive Highlight Effect on Feature Cards ---
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    });
  });

  // --- 6. Contact Form Validation & Submission ---
  const inquiryForm = document.getElementById('inquiry-form');
  const formFeedback = document.getElementById('form-feedback');

  inquiryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simple Validation
    const name = document.getElementById('full-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !subject || !message) {
      showFormFeedback('Please fill out all fields.', 'error');
      return;
    }

    if (!validateEmail(email)) {
      showFormFeedback('Please enter a valid email address.', 'error');
      return;
    }

    // Success response simulation
    showFormFeedback('<i class="fa-solid fa-circle-check"></i> Thank you! Your message has been sent successfully.', 'success');
    inquiryForm.reset();
  });

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const showFormFeedback = (msg, type) => {
    formFeedback.innerHTML = msg;
    formFeedback.className = 'form-response-msg'; // Reset
    
    if (type === 'success') {
      formFeedback.classList.add('success');
      formFeedback.style.borderColor = 'rgba(0, 229, 255, 0.3)';
      formFeedback.style.color = 'var(--primary)';
    } else {
      formFeedback.classList.add('error');
      formFeedback.style.background = 'rgba(249, 122, 93, 0.1)';
      formFeedback.style.border = '1px solid rgba(249, 122, 93, 0.3)';
      formFeedback.style.color = 'var(--secondary)';
      formFeedback.style.display = 'block';
    }
  };

  // --- 7. Interactive Floating Chatbot Implementation ---
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotWindow = document.getElementById('chatbot-window');
  const chatClose = document.getElementById('chat-close');
  const chatBody = document.getElementById('chat-body');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const tryNemuBtn = document.getElementById('try-nemu-btn');

  // Toggle chat window open/close
  const toggleChat = () => {
    const isActive = chatbotWindow.classList.contains('active');
    chatbotWindow.classList.toggle('active');
    chatbotToggle.setAttribute('aria-expanded', !isActive);
  };

  chatbotToggle.addEventListener('click', toggleChat);
  chatClose.addEventListener('click', toggleChat);

  // Link CTA to chatbot
  tryNemuBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!chatbotWindow.classList.contains('active')) {
      toggleChat();
    }
    // Scroll or focus chatbot
    chatbotWindow.scrollIntoView({ behavior: 'smooth', block: 'end' });
    chatInput.focus();
  });

  // Handle Form message send
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userMsg = chatInput.value.trim();
    if (!userMsg) return;

    appendMsg(userMsg, 'outgoing');
    chatInput.value = '';

    // Generate responsive feedback
    triggerBotResponse(userMsg);
  });

  // Handle Quick Reply clicks
  chatBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('quick-reply-chip')) {
      const topic = e.target.getAttribute('data-topic');
      const text = e.target.textContent;
      
      appendMsg(text, 'outgoing');
      triggerBotResponse(topic);
    }
  });

  const appendMsg = (text, sender) => {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;
    
    // Add robot avatar for incoming
    let avatarHtml = '';
    if (sender === 'incoming') {
      avatarHtml = `<div class="chat-avatar" style="width:30px; height:30px; font-size:0.8rem;"><i class="fa-solid fa-robot"></i></div>`;
    }

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    msgDiv.innerHTML = `
      ${avatarHtml}
      <div class="msg-bubble">
        ${text}
        <span class="msg-time">${time}</span>
      </div>
    `;

    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  };

  const showTypingIndicator = () => {
    const indicatorDiv = document.createElement('div');
    indicatorDiv.className = 'chat-msg incoming typing-indicator-wrapper';
    indicatorDiv.innerHTML = `
      <div class="chat-avatar" style="width:30px; height:30px; font-size:0.8rem;"><i class="fa-solid fa-robot"></i></div>
      <div class="msg-bubble" style="padding: 0.6rem 1rem;">
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    chatBody.appendChild(indicatorDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
    return indicatorDiv;
  };

  const triggerBotResponse = (input) => {
    const indicator = showTypingIndicator();
    
    setTimeout(() => {
      // Remove indicator
      indicator.remove();
      
      // Determine response logic
      const response = generateBotResponseText(input);
      appendMsg(response, 'incoming');
    }, 1200);
  };

  const generateBotResponseText = (input) => {
    const query = input.toLowerCase();
    
    // 1. Futuristic work-from-home income generation guidance
    if (query.includes('income') || query.includes('earn') || query.includes('money') || query === 'income') {
      return `
        <strong>🚀 Futuristic Work-From-Home (WFH) Business Model</strong><br><br>
        Here is a complete verdict and guidance for launching a highly-lucrative startup from home:<br><br>
        <strong>Concept: Autonomous AI agent configuration & integration.</strong><br>
        Businesses worldwide are struggling to deploy custom AI agents. By acting as an <em>AI Agent Integrator</em>, you can build specialized agents for businesses using local LLM wrappers.<br><br>
        <strong>Step-by-Step Guidance:</strong><br>
        1. <strong>Learn the Stack:</strong> Master no-code agent platforms (Flowise, Langflow) or code frameworks (LangChain, AutoGen).<br>
        2. <strong>Identify High-Demand Verticals:</strong> Focus on automated real estate follow-ups, recursive e-commerce customer support, or automated draft auditing for legal teams.<br>
        3. <strong>Client Onboarding:</strong> Design a basic landing page demonstrating mock agents. Reach out to local businesses offering a 7-day free trial.<br>
        4. <strong>Pricing Strategy:</strong> Setup a hybrid model—$1,500 for development, and a $250/month retention/maintenance fee.<br><br>
        <em>Verdict: High viability. Startup cost is virtually zero, demanding only knowledge and outreach. AskNemuAI can help you write your first sales sequence or outline proposal frameworks!</em>
      `;
    }

    // 2. Medical support consultant simulation
    if (query.includes('medical') || query.includes('doctor') || query.includes('health') || query === 'medical') {
      return `
        <div style="border-left: 3px solid var(--secondary); padding-left: 8px; margin-bottom: 8px;">
          <strong>⚠️ SAFETY DISCLAIMER:</strong> This is a simulated interactive AI consultation. It does not replace professional medical diagnosis, advice, or treatment. If you are experiencing a medical emergency, please call emergency services immediately.
        </div>
        <strong>🩺 Senior Medical Consultant Simulator</strong><br><br>
        <em>Initializing deep analysis protocol...</em><br><br>
        Welcome to the medical support division. To assist you with an accurate triage simulation, please provide details regarding:<br>
        • Primary symptoms & onset duration<br>
        • Pain scale description (1-10)<br>
        • Relevant medical history or current medications<br><br>
        Based on deep analysis, I can help match symptoms to probable clinical paths, translate complex lab results, and outline preparatory questions for your next real-world physician visit. How would you like to proceed?
      `;
    }

    // 3. Career Growth
    if (query.includes('career') || query.includes('job') || query.includes('interview') || query === 'career') {
      return `
        <strong>💼 Career Development Support</strong><br><br>
        AskNemuAI accelerates your professional scaling through:<br>
        • <strong>Resume Auditing:</strong> Submit your accomplishments, and I will align them with ATS optimization rules.<br>
        • <strong>Mock Interviewing:</strong> Type 'start interview for [Job Title]' and we will run a interactive technical panel.<br>
        • <strong>Skill Mapping:</strong> Get custom learning roadmaps for developer, designer, or product manager pathways.<br><br>
        What role are you targeting next? Let me know and we will outline a custom strategy!
      `;
    }

    // 4. Learning/Education
    if (query.includes('education') || query.includes('learn') || query.includes('academic') || query === 'education') {
      return `
        <strong>🎓 Learning & Academic Support</strong><br><br>
        I can act as your personal tutor across several domains:<br>
        • <strong>Concept Simplification:</strong> Explain Quantum Physics, Calculus, or Economics using simple analogies.<br>
        • <strong>Code Debugging:</strong> Send your Javascript, Python, or C++ blocks, and I'll find the logic bugs.<br>
        • <strong>Essay Structuring:</strong> Let me analyze your thesis statement and compile a highly structured outline.<br><br>
        What topic or assignment are you currently tackling?
      `;
    }

    // 5. Productivity
    if (query.includes('productivity') || query.includes('time') || query.includes('efficiency') || query === 'productivity') {
      return `
        <strong>⚡ Productivity Enhancement</strong><br><br>
        Here are three systems I can build for you:<br>
        1. <strong>Time-Blocking Matrix:</strong> Structure your calendar into deep work slots.<br>
        2. <strong>Kanban Action Boards:</strong> Translate massive projects into atomic micro-tasks.<br>
        3. <strong>Eisenhower Matrix:</strong> Help you filter the urgent versus the truly important.<br><br>
        Try asking: <em>'Create a study timetable for a computer science midterm'</em> to see it in action.
      `;
    }

    // 6. About AskNemuAI
    if (query.includes('about') || query.includes('nemu') || query.includes('platform') || query === 'about') {
      return `
        <strong>🤖 AskNemuAI System Information</strong><br><br>
        AskNemuAI is an investor-ready futuristic startup page. It features:<br>
        • <strong>Neural Canvas Engine:</strong> Dynamic particle simulations in the background.<br>
        • <strong>Modular Chat Node:</strong> High fidelity chatbot context parsing.<br>
        • <strong>Glassmorphism UI:</strong> Apple Vision Pro-inspired design aesthetics.<br><br>
        Use the quick actions or type any custom query to test my contextual processing power!
      `;
    }

    // 7. Core options matching standard greetings or help
    if (query.includes('hello') || query.includes('hi') || query.includes('hey') || query.includes('help')) {
      return `
        Hello there! I am the AskNemuAI support assistant. I can guide you through:<br>
        • <strong>Futuristic WFH Income Ideas</strong> (Type 'income')<br>
        • <strong>Medical Simulation consultations</strong> (Type 'medical')<br>
        • <strong>Career Development</strong> (Type 'career')<br>
        • <strong>Academic Learning Support</strong> (Type 'education')<br>
        • <strong>Productivity Boosters</strong> (Type 'productivity')<br><br>
        Simply ask me a question or click one of the preset quick chips to begin!
      `;
    }

    // General fallback response
    return `
      I have received your request regarding: "${input}". <br><br>
      As your **AskNemuAI Companion**, I can process this data to generate specialized outlines, action points, and futuristic solutions. Let me know if you would like me to deep-dive into this as a **Career Plan**, **Business Idea**, or **Academic Outline**!
    `;
  };

  // --- 8. Background Neural Network Canvas Simulation ---
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');

  let particlesArray = [];
  let mouse = {
    x: null,
    y: null,
    radius: 120
  };

  // Listen to Mouse position
  window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Constructor
  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.color = color;
    }

    // Draw particle
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    // Update position and check mouse interactions
    update() {
      // Check boundaries
      if (this.x > canvas.width || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.directionY = -this.directionY;
      }

      // Check mouse proximity
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx*dx + dy*dy);
      if (distance < mouse.radius + this.size) {
        if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
          this.x += 2;
        }
        if (mouse.x > this.x && this.x > this.size * 10) {
          this.x -= 2;
        }
        if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
          this.y += 2;
        }
        if (mouse.y > this.y && this.y > this.size * 10) {
          this.y -= 2;
        }
      }

      // Move particle
      this.x += this.directionX * 0.8;
      this.y += this.directionY * 0.8;

      this.draw();
    }
  }

  // Populate network
  function initParticles() {
    particlesArray = [];
    let numberOfParticles = (canvas.width * canvas.height) / 11000;
    numberOfParticles = Math.min(numberOfParticles, 120); // Cap at 120 particles
    numberOfParticles = Math.max(numberOfParticles, 40);  // Min 40 particles

    for (let i = 0; i < numberOfParticles; i++) {
      let size = (Math.random() * 2.5) + 1;
      let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
      let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
      let directionX = (Math.random() * 1.5) - 0.75;
      let directionY = (Math.random() * 1.5) - 0.75;
      let color = 'rgba(0, 229, 255, 0.4)'; // Primary glow
      
      // Randomize color slightly between primary and secondary accents
      if (Math.random() > 0.7) {
        color = 'rgba(249, 122, 93, 0.35)'; // Coral glow
      }

      particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
  }

  // Connect particles close to each other
  function connectParticles() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        
        let maxDistance = 140;
        if (distance < maxDistance) {
          opacityValue = 1 - (distance / maxDistance);
          // Color based on particle matching
          ctx.strokeStyle = `rgba(0, 229, 255, ${opacityValue * 0.15})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    connectParticles();
  }

  // Resize Listener
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mouse.radius = (canvas.width/10) * (canvas.height/10);
    mouse.radius = Math.min(mouse.radius, 120); // Cap mouse reach
    initParticles();
  });

  // Init canvas size and start animation
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
  animate();

});
