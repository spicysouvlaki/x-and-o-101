/**
 * Glossary/Tooltip module for football terms
 * Provides hover/tap definitions for technical jargon
 */

const Glossary = (function() {
  // Football term definitions
  const terms = {
    'offense': {
      term: 'Offense',
      definition: 'The team with the ball, trying to score. They run plays to move down the field toward the end zone.'
    },
    'defense': {
      term: 'Defense',
      definition: 'The team without the ball, trying to stop the offense from scoring. They try to tackle runners and intercept passes.'
    },
    'snap': {
      term: 'Snap',
      definition: 'The moment the center hikes the ball to the quarterback, starting the play. Everything before this is "pre-snap."'
    },
    'look': {
      term: 'Look',
      definition: 'The defensive alignment the offense sees before the snap. A "single-high look" means one safety deep; "two-high" means two safeties split deep.'
    },
    'single-high': {
      term: 'Single-High',
      definition: 'A defensive look with one safety positioned deep in the middle of the field, typically indicating Cover 1 or Cover 3.'
    },
    'two-high': {
      term: 'Two-High',
      definition: 'A defensive look with two safeties positioned deep, splitting the field in half. Often indicates Cover 2 or Cover 4.'
    },
    'formation': {
      term: 'Formation',
      definition: 'How players are arranged on the field before the snap. Tells you about likely play types (run vs. pass) and where receivers will be.'
    },
    'coverage': {
      term: 'Coverage',
      definition: 'The defensive scheme for defending passes. Determines which defenders cover which areas of the field (zone) or which receivers (man).'
    },
    'blitz': {
      term: 'Blitz',
      definition: 'When the defense sends extra rushers (more than 4) to pressure the QB. High risk/reward - can get a sack or leave receivers wide open.'
    },
    'zone': {
      term: 'Zone',
      definition: 'Defenders cover areas of the field rather than specific receivers. Good against short passes but can leave gaps between zones.'
    },
    'man': {
      term: 'Man',
      definition: 'Each defender covers a specific receiver wherever they go. Good for tight coverage but vulnerable to picks and crossing routes.'
    },
    'zone-vs-man': {
      term: 'Zone vs. Man',
      definition: 'Zone: defenders cover areas. Man: defenders cover specific receivers. Zone is safer but has gaps; man is tighter but can be beaten with good routes.'
    },
    'check-down': {
      term: 'Check Down',
      definition: 'A short, safe throw to a nearby receiver (usually a running back) when the primary targets are covered. Takes what the defense gives you.'
    },
    'hot-route': {
      term: 'Hot Route',
      definition: 'A quick route a receiver runs when they see a blitz coming. The QB throws immediately to beat the extra rushers.'
    },
    'pre-snap': {
      term: 'Pre-Snap',
      definition: 'Everything that happens before the ball is snapped. The QB reads the defense and may change the play based on what they see.'
    },
    'read': {
      term: 'Read',
      definition: 'What the QB looks at to decide where to throw. Could be a specific defender, safety position, or coverage type.'
    },
    'pocket': {
      term: 'Pocket',
      definition: 'The protected area formed by the offensive line where the QB stands to throw. "Collapsing pocket" means defenders are breaking through.'
    },
    'play-action': {
      term: 'Play-Action',
      definition: 'A fake handoff to freeze the defense before throwing. Works best when the defense expects a run.'
    },
    'seam': {
      term: 'Seam',
      definition: 'The gap between zone defenders. A "seam route" attacks this space, running between the deep safeties or between zones.'
    },
    'flat': {
      term: 'Flat',
      definition: 'The area near the sideline, behind the line of scrimmage. Often targeted for quick, short passes.'
    },
    'audible': {
      term: 'Audible',
      definition: 'When the QB changes the play at the line of scrimmage after seeing how the defense is aligned.'
    },
    'red-zone': {
      term: 'Red Zone',
      definition: 'The area inside the opponent\'s 20-yard line. The field is compressed here, making it harder to score touchdowns.'
    },
    'end-zone': {
      term: 'End Zone',
      definition: 'The 10-yard scoring area at each end of the field. Get the ball here to score a touchdown (6 points).'
    },
    'line-of-scrimmage': {
      term: 'Line of Scrimmage',
      definition: 'The imaginary line where the ball is placed before each play. Neither team can cross it until the ball is snapped.'
    },
    'down': {
      term: 'Down',
      definition: 'One of four attempts the offense has to advance the ball 10 yards. "3rd and 7" means 3rd attempt with 7 yards to go.'
    }
  };

  // Tooltip element
  let tooltip = null;
  let activeTarget = null;
  let hideTimeout = null;

  /**
   * Create the tooltip element
   */
  function createTooltip() {
    tooltip = document.createElement('div');
    tooltip.className = 'glossary-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    tooltip.innerHTML = `
      <div class="glossary-tooltip-term"></div>
      <div class="glossary-tooltip-definition"></div>
    `;
    document.body.appendChild(tooltip);

    // Hide tooltip when clicking outside or scrolling
    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('scroll', hideTooltip, { passive: true });
    window.addEventListener('resize', hideTooltip, { passive: true });
  }

  /**
   * Show the tooltip for a term
   * @param {HTMLElement} target - The term element
   * @param {string} termKey - The term key in the definitions
   */
  function showTooltip(target, termKey) {
    const definition = terms[termKey];
    if (!definition) return;

    // Clear any pending hide
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }

    // Update content
    tooltip.querySelector('.glossary-tooltip-term').textContent = definition.term;
    tooltip.querySelector('.glossary-tooltip-definition').textContent = definition.definition;

    // Position the tooltip
    positionTooltip(target);

    // Show it
    tooltip.classList.add('visible');
    activeTarget = target;
    target.classList.add('active');
  }

  /**
   * Position the tooltip relative to the target
   * @param {HTMLElement} target
   */
  function positionTooltip(target) {
    const rect = target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const padding = 8;

    // Calculate position (prefer above, fall back to below)
    let top = rect.top - tooltipRect.height - padding;
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

    // If tooltip would go above viewport, show below
    if (top < padding) {
      top = rect.bottom + padding;
      tooltip.classList.add('below');
      tooltip.classList.remove('above');
    } else {
      tooltip.classList.add('above');
      tooltip.classList.remove('below');
    }

    // Keep tooltip within horizontal bounds
    const maxLeft = window.innerWidth - tooltipRect.width - padding;
    left = Math.max(padding, Math.min(left, maxLeft));

    // Apply position
    tooltip.style.top = `${top + window.scrollY}px`;
    tooltip.style.left = `${left}px`;
  }

  /**
   * Hide the tooltip
   */
  function hideTooltip() {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }

    hideTimeout = setTimeout(() => {
      tooltip.classList.remove('visible');
      if (activeTarget) {
        activeTarget.classList.remove('active');
        activeTarget = null;
      }
    }, 100);
  }

  /**
   * Handle document clicks
   * @param {Event} e
   */
  function handleDocumentClick(e) {
    // If clicking on a term, don't hide (toggle behavior)
    if (e.target.classList.contains('term')) return;

    // If clicking on the tooltip, don't hide
    if (tooltip.contains(e.target)) return;

    hideTooltip();
  }

  /**
   * Handle term interaction (hover/click)
   * @param {Event} e
   */
  function handleTermInteraction(e) {
    const target = e.target;
    if (!target.classList.contains('term')) return;

    const termKey = target.dataset.term;
    if (!termKey) return;

    e.preventDefault();

    // If already showing this term, hide it (toggle on tap)
    if (activeTarget === target && tooltip.classList.contains('visible')) {
      hideTooltip();
      return;
    }

    showTooltip(target, termKey);
  }

  /**
   * Handle mouse enter on terms
   * @param {Event} e
   */
  function handleMouseEnter(e) {
    const target = e.target;
    if (!target.classList.contains('term')) return;

    const termKey = target.dataset.term;
    if (!termKey) return;

    showTooltip(target, termKey);
  }

  /**
   * Handle mouse leave on terms
   * @param {Event} e
   */
  function handleMouseLeave(e) {
    const target = e.target;
    if (!target.classList.contains('term')) return;

    // Don't hide immediately - allow moving to tooltip
    hideTimeout = setTimeout(() => {
      if (!tooltip.matches(':hover')) {
        hideTooltip();
      }
    }, 200);
  }

  /**
   * Initialize the glossary system
   */
  function init() {
    // Create tooltip element
    createTooltip();

    // Add tooltip hover behavior
    tooltip.addEventListener('mouseenter', () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
      }
    });

    tooltip.addEventListener('mouseleave', hideTooltip);

    // Use event delegation on the document
    // Click for mobile/touch devices
    document.addEventListener('click', handleTermInteraction);

    // Hover for desktop
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    console.log('Glossary initialized');
  }

  /**
   * Get a term definition
   * @param {string} termKey
   * @returns {object|null}
   */
  function getTerm(termKey) {
    return terms[termKey] || null;
  }

  /**
   * Get all terms
   * @returns {object}
   */
  function getAllTerms() {
    return { ...terms };
  }

  /**
   * Create a term span element
   * Useful for dynamically adding terms
   * @param {string} termKey - The term key
   * @param {string} displayText - Optional display text (defaults to term name)
   * @returns {HTMLElement}
   */
  function createTermElement(termKey, displayText) {
    const term = terms[termKey];
    if (!term) return null;

    const span = document.createElement('span');
    span.className = 'term';
    span.dataset.term = termKey;
    span.textContent = displayText || term.term;
    return span;
  }

  // Public API
  return {
    init,
    getTerm,
    getAllTerms,
    createTermElement
  };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Glossary.init());
} else {
  Glossary.init();
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.Glossary = Glossary;
}
