// Card animations and effects
document.addEventListener('DOMContentLoaded', function() {
  // Apply highlight class to important cards (first of each section)
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    // Find the first card in the section (if exists)
    const firstCard = section.querySelector('.card-custom');
    if (firstCard) {
      firstCard.classList.add('highlight');
    }
  });

  // Add scroll-triggered animations
  const cards = document.querySelectorAll('.card-custom');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // If card is visible
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        // Remove from observation
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1 // Trigger when 10% of the card is visible
  });

  // Pause animations initially
  cards.forEach(card => {
    card.style.animationPlayState = 'paused';
    observer.observe(card);
  });

  // Add soft sway animation to some cards randomly
  const swayCards = Array.from(cards).slice(0, Math.ceil(cards.length / 3));
  swayCards.forEach(card => {
    // Add sway animation with random delay
    const delay = Math.random() * 2;
    card.style.animation = `${card.style.animation}, cardSoftSway 5s ease-in-out ${delay}s infinite`;
  });
});
