const skillsData = {
  frontend: {
    title: 'Frontend development',
    description:
      'Semantic HTML, maintainable CSS architecture, and polished JavaScript interactions for modern responsive websites.',
    bars: [
      { label: 'HTML / Semantics', value: 95 },
      { label: 'CSS / Motion / Layout', value: 93 },
      { label: 'JavaScript Interactivity', value: 88 }
    ]
  },
  design: {
    title: 'Interface design',
    description:
      'Clean visual systems, neutral palettes, content hierarchy, and motion choices that support the user journey without distraction.',
    bars: [
      { label: 'Visual hierarchy', value: 92 },
      { label: 'Responsive layout thinking', value: 90 },
      { label: 'Micro-interactions', value: 86 }
    ]
  },
  seo: {
    title: 'SEO-ready structure',
    description:
      'Search-friendly metadata, semantic sectioning, content readability, and performant code that improves visibility and usability.',
    bars: [
      { label: 'On-page SEO', value: 89 },
      { label: 'Accessibility structure', value: 87 },
      { label: 'Performance mindset', value: 91 }
    ]
  },
  workflow: {
    title: 'Client workflow',
    description:
      'From discovery to delivery: strategy, wireframing, visual refinement, development, QA, and launch support for smooth project execution.',
    bars: [
      { label: 'Discovery & planning', value: 90 },
      { label: 'Build & iterate', value: 92 },
      { label: 'Launch readiness', value: 88 }
    ]
  }
};

const skillContent = document.getElementById('skill-content');
const skillChips = document.querySelectorAll('.skill-chip');
const reveals = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('[data-count]');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const resumeTabs = document.querySelectorAll('.resume-tab');
const resumePanels = document.querySelectorAll('.resume-panel');
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-links');
const header = document.querySelector('.site-header');
const contactForm = document.getElementById('contact-form');
const formNote = document.getElementById('form-note');

function renderSkill(key) {
  const item = skillsData[key];
  skillContent.innerHTML = `
    <h4>${item.title}</h4>
    <p>${item.description}</p>
    <div class="skill-bars">
      ${item.bars
        .map(
          (bar) => `
            <div class="skill-bar">
              <span><strong>${bar.label}</strong><em>${bar.value}%</em></span>
              <div class="skill-track"><div class="skill-fill" style="--target:${bar.value}%"></div></div>
            </div>
          `
        )
        .join('')}
    </div>
  `;

  requestAnimationFrame(() => {
    skillContent.querySelectorAll('.skill-fill').forEach((fill) => {
      fill.style.width = fill.style.getPropertyValue('--target') || fill.getAttribute('style').match(/\d+%/)[0];
    });
  });
}

skillChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    skillChips.forEach((btn) => btn.classList.remove('active'));
    chip.classList.add('active');
    renderSkill(chip.dataset.skill);
  });
});

renderSkill('frontend');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.14 }
);

reveals.forEach((item) => revealObserver.observe(item));

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 36));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = `${target}${target === 96 ? '+' : '+'}`;
          clearInterval(timer);
        } else {
          el.textContent = `${current}+`;
        }
      }, 28);
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.8 }
);

counters.forEach((counter) => counterObserver.observe(counter));

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;

    projectCards.forEach((card) => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
    });
  });
});

resumeTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    resumeTabs.forEach((btn) => btn.classList.remove('active'));
    resumePanels.forEach((panel) => panel.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

function setActiveSection() {
  let current = '';
  sections.forEach((section) => {
    const top = window.scrollY;
    const offset = section.offsetTop - 140;
    const height = section.offsetHeight;
    if (top >= offset && top < offset + height) {
      current = section.id;
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute('href')?.replace('#', '');
    link.classList.toggle('active', href === current);
  });
}

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
  setActiveSection();
});

navToggle?.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navMenu.classList.toggle('open');
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

const emailConfig = {
  mode: 'demo',
  publicKey: 'YOUR_EMAILJS_PUBLIC_KEY',
  serviceId: 'YOUR_EMAILJS_SERVICE_ID',
  templateId: 'YOUR_EMAILJS_TEMPLATE_ID',
  fallbackFormSubmitEmail: 'your@email.com'
};

if (emailConfig.mode === 'emailjs' && window.emailjs) {
  window.emailjs.init({ publicKey: emailConfig.publicKey });
}

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(contactForm).entries());
  formNote.className = 'form-note';

  try {
    if (emailConfig.mode === 'emailjs' && window.emailjs) {
      await window.emailjs.send(emailConfig.serviceId, emailConfig.templateId, formData);
      formNote.textContent = 'Message sent successfully. Email notification is active.';
      formNote.classList.add('success');
      contactForm.reset();
      return;
    }

    if (emailConfig.mode === 'formsubmit') {
      const response = await fetch(`https://formsubmit.co/ajax/${emailConfig.fallbackFormSubmitEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('FormSubmit delivery failed');
      formNote.textContent = 'Message sent successfully through FormSubmit.';
      formNote.classList.add('success');
      contactForm.reset();
      return;
    }

    formNote.textContent = 'Demo mode: form validation works. Add EmailJS or FormSubmit credentials in script.js to enable live email notifications.';
    formNote.classList.add('success');
    contactForm.reset();
  } catch (error) {
    formNote.textContent = 'Something went wrong while sending the message. Please check your email integration settings.';
    formNote.classList.add('error');
  }
});
document.querySelector('.project-links a')
setActiveSection();




// function kuchbhi(name) {
//     console.log("Hello " + name);
// }
// function phankha(name){
//     name("AC"); // Call the kuchbhi function with "AC" as the argument

// }
// kuchbhi(phankha); 
// phankha(kuchbhi);