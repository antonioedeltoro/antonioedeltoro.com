// Safety net: reveal all scroll-animated content even if anything below errors out
setTimeout(function () {
  document.querySelectorAll('.fade-in:not(.visible)').forEach(function (el) { el.classList.add('visible'); });
}, 2000);

// mailto form
function sendMail(e) {
  e.preventDefault();
  // Collapse line breaks in single-line fields (defense-in-depth against header injection)
  // and cap lengths even if maxlength is bypassed. encodeURIComponent already neutralizes the mailto.
  const line = (id, max) => document.getElementById(id).value.replace(/[\r\n]+/g, ' ').trim().slice(0, max);
  const name    = line('name', 100);
  const email   = line('email', 254);
  const subject = line('subject', 150);
  const message = document.getElementById('message').value.trim().slice(0, 2000);
  const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
  const mailto = `mailto:antonio@deltoro.codes?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
}
const contactForm = document.querySelector('.contact-form');
if (contactForm) contactForm.addEventListener('submit', sendMail);

// Scroll fade-in
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
