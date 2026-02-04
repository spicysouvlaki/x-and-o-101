/**
 * Progress tracking module
 * Handles section progress, scroll tracking, and localStorage persistence
 */

const Progress = (function() {
  // Storage keys
  const STORAGE_KEYS = {
    COMPLETED_SECTIONS: 'xo101_completed_sections',
    CURRENT_SECTION: 'xo101_current_section'
  };

  // Total sections
  const TOTAL_SECTIONS = 6;

  // State
  let state = {
    completedSections: [],
    currentSection: 1,
    observers: []
  };

  // DOM elements
  let progressBar = null;
  let progressText = null;

  // Load state from localStorage
  function loadState() {
    try {
      state.completedSections = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPLETED_SECTIONS)) || [];
    } catch (e) {
      state.completedSections = [];
    }
    state.currentSection = parseInt(localStorage.getItem(STORAGE_KEYS.CURRENT_SECTION)) || 1;
  }

  // Save state to localStorage
  function saveState() {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_SECTIONS, JSON.stringify(state.completedSections));
    localStorage.setItem(STORAGE_KEYS.CURRENT_SECTION, state.currentSection.toString());
  }

  // Update progress bar UI
  function updateProgressUI() {
    if (!progressBar || !progressText) return;

    const progress = (state.completedSections.length / TOTAL_SECTIONS) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${Math.round(progress)}% Complete`;
  }

  // Mark section as completed
  function completeSection(sectionNum) {
    if (!state.completedSections.includes(sectionNum)) {
      state.completedSections.push(sectionNum);
      state.completedSections.sort((a, b) => a - b);
      saveState();
      updateProgressUI();
      notifyObservers('sectionCompleted', sectionNum);
    }
  }

  // Set current section
  function setCurrentSection(sectionNum) {
    state.currentSection = sectionNum;
    saveState();
    notifyObservers('sectionChanged', sectionNum);
  }

  // Check if section is completed
  function isSectionCompleted(sectionNum) {
    return state.completedSections.includes(sectionNum);
  }

  // Get completion percentage
  function getCompletionPercentage() {
    return (state.completedSections.length / TOTAL_SECTIONS) * 100;
  }

  // Scroll to section
  function scrollToSection(sectionNum) {
    const section = document.querySelector(`[data-section="${sectionNum}"]`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setCurrentSection(sectionNum);
    }
  }

  // Set up scroll observer
  function setupScrollObserver() {
    const sections = document.querySelectorAll('.section');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionNum = parseInt(entry.target.dataset.section);
          if (sectionNum && sectionNum !== state.currentSection) {
            setCurrentSection(sectionNum);
          }
        }
      });
    }, {
      threshold: 0.5
    });

    sections.forEach(section => observer.observe(section));
  }

  // Set up next button handlers
  function setupNextButtons() {
    const buttons = document.querySelectorAll('.btn-next');

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const nextSection = parseInt(button.dataset.next);
        const currentSection = nextSection - 1;

        // Mark current section as completed
        completeSection(currentSection);

        // Scroll to next section
        scrollToSection(nextSection);
      });
    });
  }

  // Add observer callback
  function addObserver(callback) {
    state.observers.push(callback);
  }

  // Notify all observers
  function notifyObservers(event, data) {
    state.observers.forEach(callback => {
      try {
        callback(event, data);
      } catch (e) {
        console.error('Observer error:', e);
      }
    });
  }

  // Reset progress
  function reset() {
    state.completedSections = [];
    state.currentSection = 1;
    saveState();
    updateProgressUI();
    scrollToSection(1);
  }

  // Initialize progress module
  function init() {
    loadState();

    // Get DOM elements
    progressBar = document.getElementById('progress-bar');
    progressText = document.getElementById('progress-text');

    // Update UI
    updateProgressUI();

    // Set up observers and handlers
    setupScrollObserver();
    setupNextButtons();

    return state;
  }

  // Get current state
  function getState() {
    return { ...state };
  }

  // Public API
  return {
    init,
    completeSection,
    setCurrentSection,
    isSectionCompleted,
    getCompletionPercentage,
    scrollToSection,
    addObserver,
    reset,
    getState
  };
})();

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.Progress = Progress;
}
