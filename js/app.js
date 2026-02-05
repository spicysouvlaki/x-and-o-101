/**
 * Main application controller
 * Coordinates all modules and handles section interactions
 */

const App = (function() {
  // Coverage info data with stats
  const coverageInfo = {
    'Two-High Shell': {
      name: 'Two-High Shell (Cover 2/4)',
      desc: 'Two safeties deep split the field in half. Corners play underneath. Vulnerable to deep middle and <span class="term" data-term="seam">seam</span> routes.',
      tips: [
        'Look for the <span class="term" data-term="seam">seam</span> between safeties',
        'Attack the corners with deep outs',
        'Use the middle of the field'
      ],
      strengths: { deep: 85, short: 60, run: 50 },
      weaknesses: ['Deep middle (hole shot)', 'Seam routes', 'Corner routes'],
      usage: 'Base defense, safe look'
    },
    'Cover 2': {
      name: 'Cover 2',
      desc: 'Two safeties deep, corners in <span class="term" data-term="flat">flats</span>. Middle is open between the safeties.',
      tips: [
        'Attack the hole between corner and safety',
        '<span class="term" data-term="seam">Seam</span> routes down the middle',
        'Corner routes to the sideline'
      ],
      strengths: { deep: 80, short: 70, run: 55 },
      weaknesses: ['Deep middle', 'Sideline fade routes', 'TE seams'],
      usage: 'Passing situations, prevent big plays'
    },
    'Cover 3': {
      name: 'Cover 3',
      desc: 'Three defenders deep (FS + 2 corners), four underneath. <span class="term" data-term="single-high">Single-high</span> safety <span class="term" data-term="look">look</span>.',
      tips: [
        'Attack the <span class="term" data-term="seam">seams</span> - only 3 deep defenders',
        'Use corner routes to the boundary',
        'Flood zones with multiple receivers'
      ],
      strengths: { deep: 75, short: 65, run: 70 },
      weaknesses: ['Seams between zones', 'Flat routes', '4 verticals'],
      usage: 'Balanced defense, good run support'
    },
    'Cover 1': {
      name: 'Cover 1 (Man Free)',
      desc: '<span class="term" data-term="man">Man coverage</span> with <span class="term" data-term="single-high">single-high</span> safety help. Safety <span class="term" data-term="read">reads</span> QB and helps over the top.',
      tips: [
        'Double moves can beat the safety',
        'Post routes attack the middle',
        'Quick game before safety reacts'
      ],
      strengths: { deep: 70, short: 70, run: 75 },
      weaknesses: ['Double moves', 'Posts and deep crosses', 'Bunch formations'],
      usage: 'Blitz situations, red zone defense'
    }
  };

  // Formation info data
  const formationInfo = {
    'shotgun': {
      name: 'Shotgun',
      desc: 'QB stands 5-7 yards behind center. Gives more time to <span class="term" data-term="read">read</span> the defense and throw. Most common passing <span class="term" data-term="formation">formation</span> in modern football.',
      passRate: 65,
      runRate: 35
    },
    'under-center': {
      name: 'Under Center',
      desc: 'QB takes the <span class="term" data-term="snap">snap</span> directly from the center. Better for <span class="term" data-term="play-action">play-action</span> fakes and short-yardage situations. Traditional pro-style <span class="term" data-term="formation">formation</span>.',
      passRate: 45,
      runRate: 55
    },
    'i-formation': {
      name: 'I-Formation',
      desc: 'Fullback lined up in front of the running back. Power running <span class="term" data-term="formation">formation</span>. Great for short-yardage and goal-line situations.',
      passRate: 30,
      runRate: 70
    },
    'empty': {
      name: 'Empty Backfield',
      desc: 'No running backs behind the QB. Five receivers spread out. Maximum passing threat but vulnerable to pressure from a <span class="term" data-term="blitz">blitz</span>.',
      passRate: 85,
      runRate: 15
    }
  };

  // State
  let quizState = null;
  let currentFormation = 'shotgun';
  let currentPlay = 'none';
  let currentCoverage = 'Two-High Shell';
  let currentCoverageQuizAnswer = null;
  let routeTab = 'pass';

  // Section 1: Scoring - no initialization needed (uses static images)

  // Initialize Section 2: Formations
  function initFormationsSection() {
    const field = Field.create('formation-field', {
      yardLine: 25
    });

    // Helper to update field with current formation and play
    function updateField() {
      Field.setFormation(field, currentFormation, { play: currentPlay });
    }

    // Show initial formation
    updateField();
    updateFormationInfo(currentFormation);

    // Set up formation toggle buttons
    const formationButtons = document.querySelectorAll('.formation-btn');
    formationButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active state
        formationButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update formation
        currentFormation = btn.dataset.formation;
        updateField();
        updateFormationInfo(currentFormation);
      });
    });

    // Set up play toggle buttons
    const playButtons = document.querySelectorAll('.play-btn');
    playButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active state
        playButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update play
        currentPlay = btn.dataset.play;
        updateField();
      });
    });
  }

  // Update formation info display with crossfade transition
  function updateFormationInfo(formation) {
    const info = formationInfo[formation] || formationInfo['shotgun'];
    const nameEl = document.getElementById('formation-name');
    const descEl = document.getElementById('formation-desc');
    const passFill = document.getElementById('tendency-pass');
    const runFill = document.getElementById('tendency-run');
    const passValue = document.getElementById('tendency-pass-value');
    const runValue = document.getElementById('tendency-run-value');
    const infoContainer = document.querySelector('.formation-info');

    // Add updating class for fade effect
    if (infoContainer) {
      infoContainer.classList.add('updating');

      setTimeout(() => {
        if (nameEl) nameEl.textContent = info.name;
        if (descEl) descEl.innerHTML = info.desc;
        if (passFill) passFill.style.width = `${info.passRate}%`;
        if (runFill) runFill.style.width = `${info.runRate}%`;
        if (passValue) passValue.textContent = `${info.passRate}%`;
        if (runValue) runValue.textContent = `${info.runRate}%`;
        infoContainer.classList.remove('updating');
      }, 150);
    } else {
      if (nameEl) nameEl.textContent = info.name;
      if (descEl) descEl.innerHTML = info.desc;
      if (passFill) passFill.style.width = `${info.passRate}%`;
      if (runFill) runFill.style.width = `${info.runRate}%`;
      if (passValue) passValue.textContent = `${info.passRate}%`;
      if (runValue) runValue.textContent = `${info.runRate}%`;
    }
  }

  // Initialize Defense Section
  function initDefenseSection() {
    const field = Field.create('defense-field', {
      yardLine: 30
    });

    let currentDefensePlay = 'none';

    // Helper to update field with current coverage and play
    function updateField() {
      Field.setCoverage(field, currentCoverage, { play: currentDefensePlay });
    }

    updateField();
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
        updateField();
        updateCoverageInfo(currentCoverage);
      });
    });

    // Set up play toggle buttons
    const playButtons = document.querySelectorAll('.defense-play-btn');
    playButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active state
        playButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update play
        currentDefensePlay = btn.dataset.play;
        updateField();
      });
    });
  }

  // Update coverage info display with crossfade transition
  function updateCoverageInfo(coverage) {
    const info = coverageInfo[coverage] || coverageInfo['Two-High Shell'];
    const nameEl = document.getElementById('coverage-name');
    const descEl = document.getElementById('coverage-desc');
    const tipsList = document.getElementById('coverage-tips-list');
    const weaknessesList = document.getElementById('coverage-weaknesses-list');
    const usageEl = document.getElementById('coverage-usage');
    const deepFill = document.getElementById('strength-deep');
    const shortFill = document.getElementById('strength-short');
    const runFill = document.getElementById('strength-run');
    const infoContainer = document.querySelector('.coverage-info');

    // Helper to set strength bar with green/red coloring
    function setStrengthBar(el, value) {
      if (!el) return;
      el.style.width = `${value}%`;
      el.classList.remove('strong', 'weak');
      el.classList.add(value >= 65 ? 'strong' : 'weak');
    }

    // Add updating class for fade effect
    if (infoContainer) {
      infoContainer.classList.add('updating');

      setTimeout(() => {
        if (nameEl) nameEl.textContent = info.name;
        if (descEl) descEl.innerHTML = info.desc;
        if (tipsList) {
          tipsList.innerHTML = info.tips.map(tip => `<li>${tip}</li>`).join('');
        }
        if (weaknessesList && info.weaknesses) {
          weaknessesList.innerHTML = info.weaknesses.map(w => `<li>${w}</li>`).join('');
        }
        if (usageEl && info.usage) {
          usageEl.textContent = info.usage;
        }
        if (info.strengths) {
          setStrengthBar(deepFill, info.strengths.deep);
          setStrengthBar(shortFill, info.strengths.short);
          setStrengthBar(runFill, info.strengths.run);
        }
        infoContainer.classList.remove('updating');
      }, 150);
    } else {
      if (nameEl) nameEl.textContent = info.name;
      if (descEl) descEl.innerHTML = info.desc;
      if (tipsList) {
        tipsList.innerHTML = info.tips.map(tip => `<li>${tip}</li>`).join('');
      }
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
      // Don't show zones in quiz - that would give away the answer!
      Field.setCoverage(quizField, currentCoverageQuizAnswer, { showZones: false });

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

        // Update stats with pop animation
        const streakEl = document.getElementById('coverage-streak');
        const correctEl = document.getElementById('coverage-correct');
        const totalEl = document.getElementById('coverage-total');

        [streakEl, correctEl, totalEl].forEach(el => {
          el.classList.remove('stat-pop');
          void el.offsetWidth; // Force reflow
          el.classList.add('stat-pop');
        });

        streakEl.textContent = streak;
        correctEl.textContent = correct;
        totalEl.textContent = total;

        // Add fire emoji for 3+ streak
        const streakCard = streakEl.closest('.stat-card');
        if (streak >= 3) {
          streakEl.classList.add('streak-fire');
          if (streakCard) streakCard.classList.add('hot');
        } else {
          streakEl.classList.remove('streak-fire');
          if (streakCard) streakCard.classList.remove('hot');
        }

        // Show feedback
        const feedback = document.getElementById('coverage-quiz-feedback');
        if (feedback) {
          feedback.classList.add('show', isCorrect ? 'correct' : 'incorrect');
          feedback.innerHTML = isCorrect
            ? '<div class="quiz-feedback-title">Correct!</div>'
            : `<div class="quiz-feedback-title">Incorrect</div><p class="quiz-feedback-explanation">That was ${currentCoverageQuizAnswer}</p>`;

          // Add next button with fade-in animation
          feedback.innerHTML += '<button class="quiz-next-btn fade-in" id="coverage-next-btn">Next Coverage →</button>';
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
        <button class="quiz-next-btn fade-in" id="puzzle-next-btn">Next Play →</button>
      `;

      document.getElementById('puzzle-next-btn').addEventListener('click', loadNewPuzzle);

      // Update stats with pop animation
      const state = Quiz.getState();
      const ratingEl = document.getElementById('puzzle-rating');
      const streakEl = document.getElementById('puzzle-streak');
      const correctEl = document.getElementById('puzzle-correct');

      [ratingEl, streakEl, correctEl].forEach(el => {
        el.classList.remove('stat-pop');
        void el.offsetWidth; // Force reflow
        el.classList.add('stat-pop');
      });

      ratingEl.textContent = state.rating;
      streakEl.textContent = state.streak;
      correctEl.textContent = state.correct;

      // Add fire emoji and hot glow for 3+ streak
      const streakCard = streakEl.closest('.stat-card');
      if (state.streak >= 3) {
        streakEl.classList.add('streak-fire');
        if (streakCard) streakCard.classList.add('hot');
      } else {
        streakEl.classList.remove('streak-fire');
        if (streakCard) streakCard.classList.remove('hot');
      }

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
          <div class="route-card-situation">${info.situation}</div>
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
      document.getElementById('route-detail-desc').innerHTML = info.description;
      document.getElementById('route-tips-list').innerHTML =
        info.tips.map(tip => `<li>${tip}</li>`).join('');

      // Update situational info
      const situationText = document.getElementById('route-situation-text');
      if (situationText) situationText.innerHTML = info.situation;

      // Update trade-offs
      const rewardText = document.getElementById('route-reward');
      const riskText = document.getElementById('route-risk');
      if (rewardText) rewardText.textContent = info.reward;
      if (riskText) riskText.textContent = info.risk;

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

    // Register section initializers (called when each section loads)
    if (typeof Sections !== 'undefined') {
      Sections.onLoad(2, initFormationsSection);
      Sections.onLoad(3, initRoutesSection);
      Sections.onLoad(4, initDefenseSection);
      Sections.onLoad(5, initCoverageQuizSection);
      Sections.onLoad(6, initPuzzleSection);
    }

    // Initialize Progress (this will load initial sections)
    await Progress.init();

    // Set up progress observer
    Progress.addObserver((event, data) => {
      if (event === 'sectionCompleted') {
        checkCompletion();
      }
    });

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
