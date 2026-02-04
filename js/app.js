/**
 * Main application controller
 * Coordinates all modules and handles section interactions
 */

const App = (function() {
  // Coverage info data
  const coverageInfo = {
    'Two-High Shell': {
      name: 'Two-High Shell (Cover 2/4)',
      desc: 'Two safeties deep split the field in half. Corners play underneath. Vulnerable to deep middle and seam routes.',
      tips: [
        'Look for the seam between safeties',
        'Attack the corners with deep outs',
        'Use the middle of the field'
      ]
    },
    'Cover 2': {
      name: 'Cover 2',
      desc: 'Two safeties deep, corners in flats. Middle is open between the safeties.',
      tips: [
        'Attack the hole between corner and safety',
        'Seam routes down the middle',
        'Corner routes to the sideline'
      ]
    },
    'Cover 3': {
      name: 'Cover 3',
      desc: 'Three defenders deep (FS + 2 corners), four underneath. Single-high safety look.',
      tips: [
        'Attack the seams - only 3 deep defenders',
        'Use corner routes to the boundary',
        'Flood zones with multiple receivers'
      ]
    },
    'Man Coverage': {
      name: 'Man Coverage',
      desc: 'Defenders follow specific receivers. Press or off coverage depending on technique.',
      tips: [
        'Quick slants beat man',
        'Pick plays and rubs work well',
        'Use speed mismatches'
      ]
    },
    'Cover 1': {
      name: 'Cover 1 (Man Free)',
      desc: 'Man coverage with single-high safety help. Safety reads QB and helps over the top.',
      tips: [
        'Double moves can beat the safety',
        'Post routes attack the middle',
        'Quick game before safety reacts'
      ]
    }
  };

  // State
  let quizState = null;
  let currentCoverage = 'Two-High Shell';
  let currentCoverageQuizAnswer = null;
  let routeTab = 'pass';

  // Initialize Section 1: Scoring
  function initScoringSection() {
    const field = Field.create('scoring-field', {
      showEndZone: true,
      showScoring: true,
      yardLine: 50
    });
  }

  // Initialize Section 2: Positions
  function initPositionsSection() {
    const field = Field.create('positions-field', {
      yardLine: 25
    });

    const handlePlayerClick = (label, info) => {
      const nameEl = document.getElementById('position-name');
      const descEl = document.getElementById('position-desc');

      if (nameEl && descEl && info) {
        nameEl.textContent = info.name;
        descEl.textContent = info.desc;
      }
    };

    Field.setFullFormation(field, 'Two-High Shell', {
      onOffenseClick: handlePlayerClick,
      onDefenseClick: handlePlayerClick
    });
  }

  // Initialize Section 3: Defense
  function initDefenseSection() {
    const field = Field.create('defense-field', {
      yardLine: 30
    });

    Field.setCoverage(field, currentCoverage);
    updateCoverageInfo(currentCoverage);

    // Set up coverage toggle buttons
    const buttons = document.querySelectorAll('.coverage-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active state
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update coverage
        currentCoverage = btn.dataset.coverage;
        Field.setCoverage(field, currentCoverage);
        updateCoverageInfo(currentCoverage);
      });
    });
  }

  // Update coverage info display
  function updateCoverageInfo(coverage) {
    const info = coverageInfo[coverage] || coverageInfo['Two-High Shell'];
    const nameEl = document.getElementById('coverage-name');
    const descEl = document.getElementById('coverage-desc');
    const tipsList = document.getElementById('coverage-tips-list');

    if (nameEl) nameEl.textContent = info.name;
    if (descEl) descEl.textContent = info.desc;
    if (tipsList) {
      tipsList.innerHTML = info.tips.map(tip => `<li>${tip}</li>`).join('');
    }
  }

  // Initialize Section 4: Coverage Quiz
  function initCoverageQuizSection() {
    let quizField = null;
    let streak = 0;
    let correct = 0;
    let total = 0;

    function loadNewCoverageQuiz() {
      currentCoverageQuizAnswer = Quiz.getRandomCoverage();

      // Create or update field
      quizField = Field.create('defense-quiz-field', {
        yardLine: 30
      });
      Field.setCoverage(quizField, currentCoverageQuizAnswer);

      // Reset option states
      const options = document.querySelectorAll('#coverage-quiz-options .quiz-option');
      options.forEach(opt => {
        opt.classList.remove('correct', 'incorrect', 'show-correct');
        opt.disabled = false;
      });

      // Hide feedback
      const feedback = document.getElementById('coverage-quiz-feedback');
      if (feedback) {
        feedback.classList.remove('show', 'correct', 'incorrect');
      }
    }

    // Set up quiz options
    const options = document.querySelectorAll('#coverage-quiz-options .quiz-option');
    options.forEach(opt => {
      opt.addEventListener('click', () => {
        if (opt.disabled) return;

        const answer = opt.dataset.answer;
        const isCorrect = answer === currentCoverageQuizAnswer;

        total++;
        if (isCorrect) {
          correct++;
          streak++;
          opt.classList.add('correct');
        } else {
          streak = 0;
          opt.classList.add('incorrect');

          // Show correct answer
          options.forEach(o => {
            if (o.dataset.answer === currentCoverageQuizAnswer) {
              o.classList.add('show-correct');
            }
          });
        }

        // Disable all options
        options.forEach(o => o.disabled = true);

        // Update stats
        document.getElementById('coverage-streak').textContent = streak;
        document.getElementById('coverage-correct').textContent = correct;
        document.getElementById('coverage-total').textContent = total;

        // Show feedback
        const feedback = document.getElementById('coverage-quiz-feedback');
        if (feedback) {
          feedback.classList.add('show', isCorrect ? 'correct' : 'incorrect');
          feedback.innerHTML = isCorrect
            ? '<div class="quiz-feedback-title">Correct!</div>'
            : `<div class="quiz-feedback-title">Incorrect</div><p class="quiz-feedback-explanation">That was ${currentCoverageQuizAnswer}</p>`;

          // Add next button
          feedback.innerHTML += '<button class="quiz-next-btn" id="coverage-next-btn">Next Coverage →</button>';
          document.getElementById('coverage-next-btn').addEventListener('click', loadNewCoverageQuiz);
        }
      });
    });

    // Initial load
    loadNewCoverageQuiz();
  }

  // Initialize Section 5: Puzzle Game
  function initPuzzleSection() {
    let currentPuzzle = null;

    async function loadNewPuzzle() {
      currentPuzzle = Quiz.getNextPuzzle();
      if (!currentPuzzle) return;

      // Update situation display
      document.getElementById('puzzle-down').textContent = `${currentPuzzle.down} & ${currentPuzzle.distance}`;
      document.getElementById('puzzle-field-pos').textContent = currentPuzzle.field_pos;
      document.getElementById('puzzle-clock').textContent = currentPuzzle.clock;
      document.getElementById('puzzle-score').textContent = currentPuzzle.score;
      document.getElementById('puzzle-play').textContent = currentPuzzle.play;

      // Create field with defense
      const field = Field.create('puzzle-field', {
        fieldPos: currentPuzzle.field_pos,
        firstDownDistance: parseInt(currentPuzzle.distance) || 10
      });
      Field.setFullFormation(field, currentPuzzle.coverage);

      // Render answer options
      const optionsContainer = document.getElementById('puzzle-options');
      const isRunPass = currentPuzzle.answers.length === 2 &&
        (currentPuzzle.answers.includes('Pass') || currentPuzzle.answers.includes('Run'));

      optionsContainer.className = 'quiz-options' + (isRunPass ? ' full-width' : '');
      optionsContainer.innerHTML = currentPuzzle.answers.map(answer =>
        `<button class="quiz-option" data-answer="${answer}">${answer}</button>`
      ).join('');

      // Set up click handlers
      const options = optionsContainer.querySelectorAll('.quiz-option');
      options.forEach(opt => {
        opt.addEventListener('click', () => handlePuzzleAnswer(opt, currentPuzzle));
      });

      // Hide feedback and analytics
      document.getElementById('puzzle-feedback').classList.remove('show', 'correct', 'incorrect');
      document.getElementById('analytics-display').style.display = 'none';
    }

    function handlePuzzleAnswer(selectedOption, puzzle) {
      if (selectedOption.disabled) return;

      const answer = selectedOption.dataset.answer;
      const result = Quiz.handleAnswer(answer, puzzle, 'puzzle');

      // Update UI
      const options = document.querySelectorAll('#puzzle-options .quiz-option');
      options.forEach(opt => {
        opt.disabled = true;
        if (opt.dataset.answer === puzzle.correct) {
          opt.classList.add('correct');
        } else if (opt === selectedOption && !result.isCorrect) {
          opt.classList.add('incorrect');
        }
      });

      // Show feedback
      const feedback = document.getElementById('puzzle-feedback');
      feedback.classList.add('show', result.isCorrect ? 'correct' : 'incorrect');
      feedback.innerHTML = `
        <div class="quiz-feedback-title">${result.isCorrect ? 'Correct!' : 'Incorrect'}</div>
        <p class="quiz-feedback-explanation">${result.explanation}</p>
        <button class="quiz-next-btn" id="puzzle-next-btn">Next Play →</button>
      `;

      document.getElementById('puzzle-next-btn').addEventListener('click', loadNewPuzzle);

      // Update stats
      const state = Quiz.getState();
      document.getElementById('puzzle-rating').textContent = state.rating;
      document.getElementById('puzzle-streak').textContent = state.streak;
      document.getElementById('puzzle-correct').textContent = state.correct;

      // Show analytics
      const analytics = Quiz.lookupAnalytics(puzzle);
      if (analytics) {
        const analyticsDisplay = document.getElementById('analytics-display');
        analyticsDisplay.style.display = 'block';

        document.getElementById('analytics-pass-rate').style.width = `${analytics.passRate}%`;
        document.getElementById('analytics-pass-value').textContent = `${analytics.passRate}%`;
        document.getElementById('analytics-run-rate').style.width = `${analytics.runRate}%`;
        document.getElementById('analytics-run-value').textContent = `${analytics.runRate}%`;
        document.getElementById('analytics-insight').textContent = analytics.insight;
      }
    }

    // Initial load and stats
    const state = Quiz.getState();
    document.getElementById('puzzle-rating').textContent = state.rating;
    document.getElementById('puzzle-streak').textContent = state.streak;
    document.getElementById('puzzle-correct').textContent = state.correct;

    loadNewPuzzle();
  }

  // Initialize Section 6: Routes
  function initRoutesSection() {
    const grid = document.getElementById('routes-grid');
    const detail = document.getElementById('route-detail');
    const tabs = document.querySelectorAll('.route-tab');

    function renderRouteCards(type) {
      const routes = Routes.getRoutes(type);
      grid.innerHTML = Object.entries(routes).map(([name, info]) => `
        <div class="route-card" data-route="${name}">
          <div class="route-card-name">${info.name}</div>
          <div class="route-card-desc">${info.beats[0]}</div>
        </div>
      `).join('');

      // Set up click handlers
      grid.querySelectorAll('.route-card').forEach(card => {
        card.addEventListener('click', () => showRouteDetail(card.dataset.route));
      });
    }

    function showRouteDetail(routeName) {
      const info = Routes.getRouteInfo(routeName);
      if (!info) return;

      grid.style.display = 'none';
      detail.style.display = 'block';

      document.getElementById('route-detail-name').textContent = info.name;
      document.getElementById('route-detail-desc').textContent = info.description;
      document.getElementById('route-tips-list').innerHTML =
        info.tips.map(tip => `<li>${tip}</li>`).join('');

      // Render route diagram
      Routes.render('route-diagram', routeName);
    }

    // Back button
    document.getElementById('route-back').addEventListener('click', () => {
      grid.style.display = 'grid';
      detail.style.display = 'none';
    });

    // Tab switching
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        routeTab = tab.dataset.tab;
        renderRouteCards(routeTab);
      });
    });

    // Restart button
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        Quiz.reset();
        Progress.reset();
      });
    }

    // Initial render
    renderRouteCards('pass');
  }

  // Show completion banner when all sections done
  function checkCompletion() {
    if (Progress.getCompletionPercentage() >= 100) {
      const banner = document.getElementById('completion-banner');
      if (banner) {
        banner.style.display = 'block';
      }
    }
  }

  // Initialize the app
  async function init() {
    // Initialize Quiz (loads data)
    await Quiz.init();

    // Initialize Progress
    Progress.init();

    // Set up progress observer
    Progress.addObserver((event, data) => {
      if (event === 'sectionCompleted') {
        checkCompletion();
      }
    });

    // Initialize all sections
    initScoringSection();
    initPositionsSection();
    initDefenseSection();
    initCoverageQuizSection();
    initPuzzleSection();
    initRoutesSection();

    // Check if already completed
    checkCompletion();

    console.log('X\'s and O\'s 101 initialized');
  }

  // Start app when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  return {
    init,
    Quiz,
    Progress,
    Field,
    Routes
  };
})();

// Export for debugging
if (typeof window !== 'undefined') {
  window.App = App;
}
