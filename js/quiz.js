/**
 * Quiz engine module with ELO rating system
 * Handles all quiz logic, scoring, and localStorage persistence
 */

const Quiz = (function() {
  // Storage keys
  const STORAGE_KEYS = {
    RATING: 'xo101_rating',
    STREAK: 'xo101_streak',
    CORRECT: 'xo101_correct',
    TOTAL: 'xo101_total',
    COVERAGE_CORRECT: 'xo101_coverage_correct',
    COVERAGE_TOTAL: 'xo101_coverage_total',
    COMPLETED_PUZZLES: 'xo101_completed_puzzles'
  };

  // ELO constants
  const K_FACTOR = 32;
  const BASE_RATING = 1200;

  // Quiz state
  let state = {
    rating: BASE_RATING,
    streak: 0,
    correct: 0,
    total: 0,
    coverageCorrect: 0,
    coverageTotal: 0,
    completedPuzzles: [],
    currentPuzzle: null,
    puzzles: [],
    analytics: []
  };

  // Load state from localStorage
  function loadState() {
    state.rating = parseInt(localStorage.getItem(STORAGE_KEYS.RATING)) || BASE_RATING;
    state.streak = parseInt(localStorage.getItem(STORAGE_KEYS.STREAK)) || 0;
    state.correct = parseInt(localStorage.getItem(STORAGE_KEYS.CORRECT)) || 0;
    state.total = parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL)) || 0;
    state.coverageCorrect = parseInt(localStorage.getItem(STORAGE_KEYS.COVERAGE_CORRECT)) || 0;
    state.coverageTotal = parseInt(localStorage.getItem(STORAGE_KEYS.COVERAGE_TOTAL)) || 0;

    try {
      state.completedPuzzles = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPLETED_PUZZLES)) || [];
    } catch (e) {
      state.completedPuzzles = [];
    }
  }

  // Save state to localStorage
  function saveState() {
    localStorage.setItem(STORAGE_KEYS.RATING, state.rating.toString());
    localStorage.setItem(STORAGE_KEYS.STREAK, state.streak.toString());
    localStorage.setItem(STORAGE_KEYS.CORRECT, state.correct.toString());
    localStorage.setItem(STORAGE_KEYS.TOTAL, state.total.toString());
    localStorage.setItem(STORAGE_KEYS.COVERAGE_CORRECT, state.coverageCorrect.toString());
    localStorage.setItem(STORAGE_KEYS.COVERAGE_TOTAL, state.coverageTotal.toString());
    localStorage.setItem(STORAGE_KEYS.COMPLETED_PUZZLES, JSON.stringify(state.completedPuzzles));
  }

  // Calculate ELO rating change
  function calculateELO(isCorrect, puzzleDifficulty = 'intermediate') {
    const difficultyRatings = {
      'beginner': 1000,
      'intermediate': 1200,
      'advanced': 1400
    };

    const puzzleRating = difficultyRatings[puzzleDifficulty] || 1200;
    const expected = 1 / (1 + Math.pow(10, (puzzleRating - state.rating) / 400));
    const actual = isCorrect ? 1 : 0;
    const change = Math.round(K_FACTOR * (actual - expected));

    return change;
  }

  // Handle answer submission
  function handleAnswer(answer, puzzle, type = 'puzzle') {
    const isCorrect = answer === puzzle.correct;
    const ratingChange = calculateELO(isCorrect, puzzle.difficulty);

    if (type === 'puzzle') {
      state.total++;

      if (isCorrect) {
        state.correct++;
        state.streak++;
        state.rating = Math.max(100, state.rating + ratingChange);

        if (!state.completedPuzzles.includes(puzzle.id)) {
          state.completedPuzzles.push(puzzle.id);
        }
      } else {
        state.streak = 0;
        state.rating = Math.max(100, state.rating + ratingChange);
      }
    } else if (type === 'coverage') {
      state.coverageTotal++;
      if (isCorrect) {
        state.coverageCorrect++;
        state.streak++;
      } else {
        state.streak = 0;
      }
    }

    saveState();

    return {
      isCorrect,
      ratingChange,
      newRating: state.rating,
      streak: state.streak,
      explanation: puzzle.explanation
    };
  }

  // Get next puzzle based on current rating
  function getNextPuzzle() {
    if (state.puzzles.length === 0) return null;

    // Filter out recently completed puzzles
    const recentlyCompleted = state.completedPuzzles.slice(-5);
    let available = state.puzzles.filter(p => !recentlyCompleted.includes(p.id));

    // If all puzzles done, reset and use all
    if (available.length === 0) {
      available = state.puzzles;
    }

    // Weight puzzles by how close they are to player's rating
    const difficultyRatings = {
      'beginner': 1000,
      'intermediate': 1200,
      'advanced': 1400
    };

    const weighted = available.map(puzzle => {
      const puzzleRating = difficultyRatings[puzzle.difficulty] || 1200;
      const distance = Math.abs(state.rating - puzzleRating);
      const weight = Math.max(1, 100 - distance / 10);
      return { puzzle, weight };
    });

    // Random weighted selection
    const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0);
    let random = Math.random() * totalWeight;

    for (const { puzzle, weight } of weighted) {
      random -= weight;
      if (random <= 0) {
        state.currentPuzzle = puzzle;
        return puzzle;
      }
    }

    state.currentPuzzle = available[0];
    return state.currentPuzzle;
  }

  // Get random coverage for quiz
  function getRandomCoverage() {
    const coverages = ['Two-High Shell', 'Cover 3', 'Cover 1'];
    return coverages[Math.floor(Math.random() * coverages.length)];
  }

  // Look up analytics for a situation
  function lookupAnalytics(puzzle) {
    if (state.analytics.length === 0) return null;

    // Parse distance
    let distanceBucket = '10+';
    const distance = parseInt(puzzle.distance) || 10;
    if (distance <= 2) distanceBucket = '1-2';
    else if (distance <= 4) distanceBucket = '3-4';
    else if (distance <= 6) distanceBucket = '5-6';
    else if (distance <= 9) distanceBucket = '7-9';
    else if (puzzle.distance === 'Goal') distanceBucket = 'Goal';
    else distanceBucket = '10+';

    // Parse field zone
    let fieldZone = 'midfield';
    const fieldPos = puzzle.field_pos || '';
    if (fieldPos.includes('Own') && parseInt(fieldPos.match(/\d+/)?.[0]) <= 20) {
      fieldZone = 'own_deep';
    } else if (fieldPos.includes('Own')) {
      fieldZone = 'own_territory';
    } else if (fieldPos.includes('Opponent') && parseInt(fieldPos.match(/\d+/)?.[0]) <= 20) {
      fieldZone = 'red_zone';
    } else if (fieldPos.includes('Opponent') && parseInt(fieldPos.match(/\d+/)?.[0]) <= 5) {
      fieldZone = 'goal_line';
    } else if (fieldPos.includes('Opponent')) {
      fieldZone = 'opp_territory';
    }

    // Find matching analytics
    const down = parseInt(puzzle.down) || 1;

    const match = state.analytics.find(a =>
      a.down === down &&
      a.distance_bucket === distanceBucket
    );

    if (match) {
      return {
        passRate: Math.round(match.pass_rate * 100),
        runRate: Math.round((1 - match.pass_rate) * 100),
        passEPA: match.pass_epa_mean,
        runEPA: match.run_epa_mean,
        passSuccess: Math.round(match.pass_success_rate * 100),
        runSuccess: Math.round(match.run_success_rate * 100),
        sampleSize: match.sample_size,
        insight: generateInsight(match)
      };
    }

    return null;
  }

  // Generate insight text from analytics
  function generateInsight(analytics) {
    const passRate = Math.round(analytics.pass_rate * 100);

    if (passRate > 80) {
      return `NFL teams pass ${passRate}% of the time in this situation.`;
    } else if (passRate < 40) {
      return `This is a run-heavy situation - NFL teams run ${100 - passRate}% of the time.`;
    } else {
      return `Balanced situation - NFL pass rate is ${passRate}%.`;
    }
  }

  // Load puzzles from JSON
  async function loadPuzzles() {
    try {
      const response = await fetch('data/puzzles.json');
      state.puzzles = await response.json();
    } catch (e) {
      console.error('Failed to load puzzles:', e);
      state.puzzles = [];
    }
  }

  // Load analytics from JSON
  async function loadAnalytics() {
    try {
      const response = await fetch('data/analytics.json');
      state.analytics = await response.json();
    } catch (e) {
      console.error('Failed to load analytics:', e);
      state.analytics = [];
    }
  }

  // Initialize quiz module
  async function init() {
    loadState();
    await Promise.all([loadPuzzles(), loadAnalytics()]);
    return state;
  }

  // Reset all progress
  function reset() {
    state = {
      rating: BASE_RATING,
      streak: 0,
      correct: 0,
      total: 0,
      coverageCorrect: 0,
      coverageTotal: 0,
      completedPuzzles: [],
      currentPuzzle: null,
      puzzles: state.puzzles,
      analytics: state.analytics
    };
    saveState();
  }

  // Get current state
  function getState() {
    return { ...state };
  }

  // Public API
  return {
    init,
    handleAnswer,
    getNextPuzzle,
    getRandomCoverage,
    lookupAnalytics,
    getState,
    reset,
    loadState,
    saveState
  };
})();

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.Quiz = Quiz;
}
