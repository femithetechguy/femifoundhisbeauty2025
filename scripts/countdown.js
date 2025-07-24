// Countdown timer
function initializeCountdown() {
  if (!window.weddingData || !weddingData.wedding) {
    console.error('Wedding data not available for countdown timer');
    return;
  }

  // Get target date from wedding data
  let targetDateString;
  
  // First check if countdown is defined in home section
  const homeSection = weddingData.sections.find(section => section.id === 'home');
  if (homeSection && 
      homeSection.content && 
      homeSection.content.countdown && 
      homeSection.content.countdown.targetDate) {
    targetDateString = homeSection.content.countdown.targetDate;
  } else {
    // Fallback to main wedding date
    const weddingDate = weddingData.wedding.date;
    const weddingTime = weddingData.wedding.time || '00:00';
    targetDateString = `${weddingDate}T${weddingTime}`;
  }

  // Create a Date object for the target date
  const targetDate = new Date(targetDateString);
  
  // Update the wedding date display in the HTML
  const weddingDateElement = document.getElementById('wedding-date-text');
  if (weddingDateElement) {
    // Format the date: Month Day, Year
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = targetDate.toLocaleDateString('en-US', options);
    weddingDateElement.textContent = formattedDate;
  }

  // Update the countdown every second
  const countdownTimer = document.getElementById('countdown-timer');
  if (!countdownTimer) return;

  // Initial update
  updateCountdown();

  // Update every second
  setInterval(updateCountdown, 1000);

  function updateCountdown() {
    const now = new Date();
    const timeRemaining = targetDate - now;

    if (timeRemaining <= 0) {
      // Wedding day has arrived!
      document.getElementById('days').textContent = '000';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';

      // Optional: add a special message or class
      const countdownContainer = document.querySelector('.countdown-container');
      if (countdownContainer) {
        const message = document.createElement('div');
        message.className = 'wedding-day-message';
        message.innerHTML = '<h4>Our special day is here!</h4>';
        
        // Only add the message if it doesn't exist yet
        if (!document.querySelector('.wedding-day-message')) {
          countdownContainer.appendChild(message);
        }
      }
      return;
    }

    // Calculate days, hours, minutes, and seconds
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    // Format and display the time elements
    document.getElementById('days').textContent = String(days).padStart(3, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  }
}
