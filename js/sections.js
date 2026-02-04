/**
 * Section loader module
 * Dynamically loads section HTML partials
 */

const Sections = (function() {
  // Section definitions
  const sectionFiles = {
    1: 'sections/1-scoring.html',
    2: 'sections/2-formations.html',
    3: 'sections/4-routes.html',
    4: 'sections/5-defense.html',
    5: 'sections/6-defense-quiz.html',
    6: 'sections/7-puzzle.html'
  };

  // Track loaded sections
  const loadedSections = new Set();

  // Cache for loaded HTML
  const sectionCache = {};

  // Container element
  let container = null;

  // Callbacks for when sections are loaded
  const onLoadCallbacks = {};

  /**
   * Initialize the section loader
   * @param {string} containerId - ID of the container element
   */
  function init(containerId) {
    container = document.getElementById(containerId);
    if (!container) {
      console.error('Sections container not found:', containerId);
      return;
    }
  }

  /**
   * Load a section by number
   * @param {number} sectionNum - Section number to load
   * @returns {Promise<HTMLElement>} - The loaded section element
   */
  async function load(sectionNum) {
    if (!container) {
      console.error('Sections not initialized');
      return null;
    }

    // Check if already loaded
    if (loadedSections.has(sectionNum)) {
      return document.querySelector(`[data-section="${sectionNum}"]`);
    }

    const file = sectionFiles[sectionNum];
    if (!file) {
      console.error('Unknown section:', sectionNum);
      return null;
    }

    try {
      // Check cache first
      let html = sectionCache[sectionNum];

      if (!html) {
        const response = await fetch(file);
        if (!response.ok) {
          throw new Error(`Failed to load section ${sectionNum}: ${response.status}`);
        }
        html = await response.text();
        sectionCache[sectionNum] = html;
      }

      // Create a temporary container to parse the HTML
      const temp = document.createElement('div');
      temp.innerHTML = html;
      const section = temp.firstElementChild;

      // Find the right position to insert (maintain order)
      const existingSections = container.querySelectorAll('.section');
      let inserted = false;

      for (const existing of existingSections) {
        const existingNum = parseInt(existing.dataset.section);
        if (existingNum > sectionNum) {
          container.insertBefore(section, existing);
          inserted = true;
          break;
        }
      }

      if (!inserted) {
        container.appendChild(section);
      }

      loadedSections.add(sectionNum);

      // Trigger callbacks
      if (onLoadCallbacks[sectionNum]) {
        onLoadCallbacks[sectionNum].forEach(cb => cb(section));
      }

      return section;

    } catch (error) {
      console.error('Error loading section:', error);
      return null;
    }
  }

  /**
   * Load multiple sections
   * @param {number[]} sectionNums - Array of section numbers to load
   * @returns {Promise<HTMLElement[]>}
   */
  async function loadMultiple(sectionNums) {
    const promises = sectionNums.map(num => load(num));
    return Promise.all(promises);
  }

  /**
   * Load all sections up to a given number
   * @param {number} upTo - Load sections 1 through upTo
   * @returns {Promise<HTMLElement[]>}
   */
  async function loadUpTo(upTo) {
    const nums = [];
    for (let i = 1; i <= upTo; i++) {
      nums.push(i);
    }
    return loadMultiple(nums);
  }

  /**
   * Register a callback for when a section loads
   * @param {number} sectionNum - Section number
   * @param {Function} callback - Callback function
   */
  function onLoad(sectionNum, callback) {
    if (!onLoadCallbacks[sectionNum]) {
      onLoadCallbacks[sectionNum] = [];
    }
    onLoadCallbacks[sectionNum].push(callback);

    // If already loaded, call immediately
    if (loadedSections.has(sectionNum)) {
      const section = document.querySelector(`[data-section="${sectionNum}"]`);
      callback(section);
    }
  }

  /**
   * Check if a section is loaded
   * @param {number} sectionNum
   * @returns {boolean}
   */
  function isLoaded(sectionNum) {
    return loadedSections.has(sectionNum);
  }

  /**
   * Get total number of sections
   * @returns {number}
   */
  function getTotal() {
    return Object.keys(sectionFiles).length;
  }

  // Public API
  return {
    init,
    load,
    loadMultiple,
    loadUpTo,
    onLoad,
    isLoaded,
    getTotal
  };
})();

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.Sections = Sections;
}
