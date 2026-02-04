/**
 * Field rendering module - ported from defensive-formation.tsx
 * Renders SVG football field with defensive formations
 */

const Field = (function() {
  // Defensive formation definitions
  const formations = {
    'Two-High Shell': {
      safeties: [
        { x: 30, y: -12, label: 'FS' },
        { x: 70, y: -12, label: 'SS' }
      ],
      corners: [
        { x: 15, y: -7, label: 'CB' },
        { x: 85, y: -7, label: 'CB' }
      ],
      linebackers: [
        { x: 35, y: -3, label: 'LB' },
        { x: 50, y: -3, label: 'MLB' },
        { x: 65, y: -3, label: 'LB' }
      ],
      dline: [
        { x: 35, y: 0, label: 'DE' },
        { x: 47, y: 0, label: 'DT' },
        { x: 53, y: 0, label: 'DT' },
        { x: 65, y: 0, label: 'DE' }
      ]
    },
    'Cover 2': {
      safeties: [
        { x: 30, y: -12, label: 'FS' },
        { x: 70, y: -12, label: 'SS' }
      ],
      corners: [
        { x: 15, y: -7, label: 'CB' },
        { x: 85, y: -7, label: 'CB' }
      ],
      linebackers: [
        { x: 35, y: -3, label: 'LB' },
        { x: 50, y: -3, label: 'MLB' },
        { x: 65, y: -3, label: 'LB' }
      ],
      dline: [
        { x: 35, y: 0, label: 'DE' },
        { x: 47, y: 0, label: 'DT' },
        { x: 53, y: 0, label: 'DT' },
        { x: 65, y: 0, label: 'DE' }
      ]
    },
    'Cover 4': {
      safeties: [
        { x: 30, y: -12, label: 'FS' },
        { x: 70, y: -12, label: 'SS' }
      ],
      corners: [
        { x: 15, y: -7, label: 'CB' },
        { x: 85, y: -7, label: 'CB' }
      ],
      linebackers: [
        { x: 35, y: -3, label: 'LB' },
        { x: 50, y: -3, label: 'MLB' },
        { x: 65, y: -3, label: 'LB' }
      ],
      dline: [
        { x: 35, y: 0, label: 'DE' },
        { x: 47, y: 0, label: 'DT' },
        { x: 53, y: 0, label: 'DT' },
        { x: 65, y: 0, label: 'DE' }
      ]
    },
    'Cover 3': {
      safeties: [
        { x: 50, y: -15, label: 'FS' }
      ],
      corners: [
        { x: 20, y: -12, label: 'CB' },
        { x: 80, y: -12, label: 'CB' }
      ],
      linebackers: [
        { x: 30, y: -4, label: 'LB' },
        { x: 45, y: -5, label: 'MLB' },
        { x: 55, y: -5, label: 'MLB' },
        { x: 70, y: -4, label: 'LB' }
      ],
      dline: [
        { x: 35, y: 0, label: 'DE' },
        { x: 47, y: 0, label: 'DT' },
        { x: 53, y: 0, label: 'DT' },
        { x: 65, y: 0, label: 'DE' }
      ]
    },
    'Man Coverage': {
      safeties: [
        { x: 50, y: -12, label: 'FS' }
      ],
      corners: [
        { x: 15, y: -2, label: 'CB' },
        { x: 85, y: -2, label: 'CB' }
      ],
      linebackers: [
        { x: 35, y: -3, label: 'LB' },
        { x: 50, y: -3, label: 'MLB' },
        { x: 65, y: -3, label: 'LB' }
      ],
      dline: [
        { x: 35, y: 0, label: 'DE' },
        { x: 47, y: 0, label: 'DT' },
        { x: 53, y: 0, label: 'DT' },
        { x: 65, y: 0, label: 'DE' }
      ]
    },
    'Cover 1': {
      safeties: [
        { x: 50, y: -12, label: 'FS' }
      ],
      corners: [
        { x: 15, y: -2, label: 'CB' },
        { x: 85, y: -2, label: 'CB' }
      ],
      linebackers: [
        { x: 35, y: -3, label: 'LB' },
        { x: 50, y: -3, label: 'MLB' },
        { x: 65, y: -3, label: 'LB' }
      ],
      dline: [
        { x: 35, y: 0, label: 'DE' },
        { x: 47, y: 0, label: 'DT' },
        { x: 53, y: 0, label: 'DT' },
        { x: 65, y: 0, label: 'DE' }
      ]
    }
  };

  // Offensive formation definitions
  const offensiveFormations = {
    'default': {
      qb: { x: 50, y: 5, label: 'QB' },
      oline: [
        { x: 40, y: 2, label: 'LT' },
        { x: 44, y: 2, label: 'LG' },
        { x: 50, y: 2, label: 'C' },
        { x: 56, y: 2, label: 'RG' },
        { x: 60, y: 2, label: 'RT' }
      ],
      receivers: [
        { x: 15, y: 2, label: 'WR' },
        { x: 85, y: 2, label: 'WR' }
      ],
      te: { x: 65, y: 2, label: 'TE' },
      rb: { x: 50, y: 8, label: 'RB' }
    }
  };

  // Position descriptions for learning
  const positionDescriptions = {
    'QB': {
      name: 'Quarterback',
      desc: 'The field general. Reads the defense, calls plays, throws the ball or hands off to runners.'
    },
    'RB': {
      name: 'Running Back',
      desc: 'Carries the ball on run plays, catches passes out of the backfield, and blocks for the QB.'
    },
    'WR': {
      name: 'Wide Receiver',
      desc: 'Lines up wide, runs routes, and catches passes. Speed and route-running are key.'
    },
    'TE': {
      name: 'Tight End',
      desc: 'Hybrid position - blocks like a lineman and catches passes like a receiver.'
    },
    'C': {
      name: 'Center',
      desc: 'Snaps the ball to the QB and makes blocking calls for the offensive line.'
    },
    'LG': {
      name: 'Left Guard',
      desc: 'Blocks defenders to protect the QB and create running lanes.'
    },
    'RG': {
      name: 'Right Guard',
      desc: 'Blocks defenders to protect the QB and create running lanes.'
    },
    'LT': {
      name: 'Left Tackle',
      desc: 'Protects the QB\'s blind side (for right-handed QBs). Often the best pass blocker.'
    },
    'RT': {
      name: 'Right Tackle',
      desc: 'Blocks edge rushers and creates holes for outside runs.'
    },
    'CB': {
      name: 'Cornerback',
      desc: 'Covers wide receivers man-to-man or in zone. Must be fast and agile.'
    },
    'FS': {
      name: 'Free Safety',
      desc: 'Roams the deep middle, reads the QB, and provides last line of defense.'
    },
    'SS': {
      name: 'Strong Safety',
      desc: 'Plays closer to the line, helps against the run, and covers tight ends.'
    },
    'MLB': {
      name: 'Middle Linebacker',
      desc: 'The defensive quarterback. Calls plays, stops the run, and covers the middle.'
    },
    'LB': {
      name: 'Linebacker',
      desc: 'Versatile defender - stops runs, rushes the passer, and covers receivers.'
    },
    'DE': {
      name: 'Defensive End',
      desc: 'Lines up on the edge, rushes the passer, and sets the edge against runs.'
    },
    'DT': {
      name: 'Defensive Tackle',
      desc: 'Interior lineman who clogs running lanes and pressures the QB up the middle.'
    }
  };

  // Parse yard line from string like "Own 25" or "Opponent 43"
  function parseYardLine(fieldPos) {
    if (!fieldPos) return 25;
    const match = fieldPos.match(/(Own|Opponent|Midfield)\s*(\d+)?/i);
    if (!match) return 25;

    if (match[1].toLowerCase() === 'midfield') return 50;

    const yards = parseInt(match[2]) || 25;
    if (match[1].toLowerCase() === 'own') {
      return yards;
    } else {
      return 100 - yards;
    }
  }

  // Create SVG namespace helper
  function createSVGElement(tag) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
  }

  // Create the field SVG
  function createFieldSVG(options = {}) {
    const {
      showEndZone = false,
      showScoring = false,
      yardLine = 25,
      firstDownDistance = 10
    } = options;

    const svg = createSVGElement('svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('class', 'field-svg');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    // Create defs for gradient
    const defs = createSVGElement('defs');
    const gradient = createSVGElement('linearGradient');
    gradient.setAttribute('id', 'fieldGradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '0%');
    gradient.setAttribute('y2', '100%');

    const stop1 = createSVGElement('stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#16a34a');

    const stop2 = createSVGElement('stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#166534');

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.appendChild(defs);

    // Field background
    const grass = createSVGElement('rect');
    grass.setAttribute('x', '0');
    grass.setAttribute('y', '0');
    grass.setAttribute('width', '100');
    grass.setAttribute('height', '100');
    grass.setAttribute('class', 'field-grass');
    svg.appendChild(grass);

    // Calculate view range (20 yards centered on ball)
    const viewStart = Math.max(0, yardLine - 10);
    const viewEnd = Math.min(100, yardLine + 10);
    const scaleY = 80 / (viewEnd - viewStart);

    // Add alternating stripes
    for (let i = 0; i < 20; i++) {
      if (i % 2 === 0) {
        const stripe = createSVGElement('rect');
        stripe.setAttribute('x', '0');
        stripe.setAttribute('y', (10 + i * 4).toString());
        stripe.setAttribute('width', '100');
        stripe.setAttribute('height', '4');
        stripe.setAttribute('class', 'field-stripe');
        svg.appendChild(stripe);
      }
    }

    // End zones for scoring visualization
    if (showEndZone) {
      const endZone = createSVGElement('rect');
      endZone.setAttribute('x', '0');
      endZone.setAttribute('y', '0');
      endZone.setAttribute('width', '100');
      endZone.setAttribute('height', '10');
      endZone.setAttribute('class', 'end-zone');
      svg.appendChild(endZone);

      const endZoneText = createSVGElement('text');
      endZoneText.setAttribute('x', '50');
      endZoneText.setAttribute('y', '6');
      endZoneText.setAttribute('class', 'end-zone-text');
      endZoneText.textContent = 'END ZONE';
      svg.appendChild(endZoneText);
    }

    // Yard lines and numbers
    for (let yard = 10; yard <= 90; yard += 10) {
      const yardNum = yard <= 50 ? yard : 100 - yard;
      const y = 90 - ((yard - viewStart) / (viewEnd - viewStart)) * 80;

      if (y >= 10 && y <= 90) {
        const line = createSVGElement('line');
        line.setAttribute('x1', '5');
        line.setAttribute('y1', y.toString());
        line.setAttribute('x2', '95');
        line.setAttribute('y2', y.toString());
        line.setAttribute('class', 'yard-line');
        svg.appendChild(line);

        // Yard numbers
        const leftNum = createSVGElement('text');
        leftNum.setAttribute('x', '8');
        leftNum.setAttribute('y', (y - 1).toString());
        leftNum.setAttribute('class', 'yard-number');
        leftNum.textContent = yardNum.toString();
        svg.appendChild(leftNum);

        const rightNum = createSVGElement('text');
        rightNum.setAttribute('x', '92');
        rightNum.setAttribute('y', (y - 1).toString());
        rightNum.setAttribute('class', 'yard-number');
        rightNum.textContent = yardNum.toString();
        svg.appendChild(rightNum);
      }
    }

    // Hash marks
    for (let yard = viewStart; yard <= viewEnd; yard++) {
      const y = 90 - ((yard - viewStart) / (viewEnd - viewStart)) * 80;

      // Left hash
      const leftHash = createSVGElement('line');
      leftHash.setAttribute('x1', '30');
      leftHash.setAttribute('y1', y.toString());
      leftHash.setAttribute('x2', '34');
      leftHash.setAttribute('y2', y.toString());
      leftHash.setAttribute('class', 'hash-mark');
      svg.appendChild(leftHash);

      // Right hash
      const rightHash = createSVGElement('line');
      rightHash.setAttribute('x1', '66');
      rightHash.setAttribute('y1', y.toString());
      rightHash.setAttribute('x2', '70');
      rightHash.setAttribute('y2', y.toString());
      rightHash.setAttribute('class', 'hash-mark');
      svg.appendChild(rightHash);
    }

    // Line of scrimmage
    const losY = 90 - ((yardLine - viewStart) / (viewEnd - viewStart)) * 80;
    const los = createSVGElement('line');
    los.setAttribute('x1', '0');
    los.setAttribute('y1', losY.toString());
    los.setAttribute('x2', '100');
    los.setAttribute('y2', losY.toString());
    los.setAttribute('class', 'line-of-scrimmage');
    svg.appendChild(los);

    // First down line
    const firstDownYard = Math.min(yardLine + firstDownDistance, 100);
    const fdY = 90 - ((firstDownYard - viewStart) / (viewEnd - viewStart)) * 80;
    if (fdY >= 10 && fdY <= 90) {
      const fdLine = createSVGElement('line');
      fdLine.setAttribute('x1', '0');
      fdLine.setAttribute('y1', fdY.toString());
      fdLine.setAttribute('x2', '100');
      fdLine.setAttribute('y2', fdY.toString());
      fdLine.setAttribute('class', 'first-down-line');
      svg.appendChild(fdLine);
    }

    // Scoring arrow animation
    if (showScoring) {
      const arrowPath = createSVGElement('path');
      arrowPath.setAttribute('d', 'M 50 80 L 50 15');
      arrowPath.setAttribute('class', 'scoring-arrow');
      svg.appendChild(arrowPath);

      const arrowHead = createSVGElement('polygon');
      arrowHead.setAttribute('points', '50,10 45,20 55,20');
      arrowHead.setAttribute('class', 'scoring-arrow-head');
      svg.appendChild(arrowHead);
    }

    return svg;
  }

  // Add defensive players to the field
  function addDefensivePlayers(svg, coverage, yardLine = 25, onClick = null) {
    const formation = formations[coverage] || formations['Two-High Shell'];
    const viewStart = Math.max(0, yardLine - 10);
    const viewEnd = Math.min(100, yardLine + 10);
    const losY = 90 - ((yardLine - viewStart) / (viewEnd - viewStart)) * 80;

    const allPlayers = [
      ...formation.safeties,
      ...formation.corners,
      ...formation.linebackers,
      ...formation.dline
    ];

    allPlayers.forEach((player, index) => {
      const playerY = losY + (player.y * 3);

      const group = createSVGElement('g');
      group.setAttribute('class', 'player-marker');
      group.setAttribute('data-label', player.label);
      group.setAttribute('transform', `translate(${player.x}, ${playerY})`);

      const circle = createSVGElement('circle');
      circle.setAttribute('cx', '0');
      circle.setAttribute('cy', '0');
      circle.setAttribute('r', '2.5');
      circle.setAttribute('class', 'player-circle defense');
      group.appendChild(circle);

      const label = createSVGElement('text');
      label.setAttribute('x', '0');
      label.setAttribute('y', '0');
      label.setAttribute('class', 'player-label');
      label.textContent = player.label;
      group.appendChild(label);

      if (onClick) {
        group.style.cursor = 'pointer';
        group.addEventListener('click', () => onClick(player.label, positionDescriptions[player.label]));
      }

      svg.appendChild(group);
    });
  }

  // Add offensive players to the field
  function addOffensivePlayers(svg, yardLine = 25, onClick = null) {
    const formation = offensiveFormations['default'];
    const viewStart = Math.max(0, yardLine - 10);
    const viewEnd = Math.min(100, yardLine + 10);
    const losY = 90 - ((yardLine - viewStart) / (viewEnd - viewStart)) * 80;

    const allPlayers = [
      formation.qb,
      ...formation.oline,
      ...formation.receivers,
      formation.te,
      formation.rb
    ];

    allPlayers.forEach((player) => {
      const playerY = losY + (player.y * 2);

      const group = createSVGElement('g');
      group.setAttribute('class', 'player-marker');
      group.setAttribute('data-label', player.label);
      group.setAttribute('transform', `translate(${player.x}, ${playerY})`);

      const circle = createSVGElement('circle');
      circle.setAttribute('cx', '0');
      circle.setAttribute('cy', '0');
      circle.setAttribute('r', '2.5');
      circle.setAttribute('class', 'player-circle offense');
      group.appendChild(circle);

      const label = createSVGElement('text');
      label.setAttribute('x', '0');
      label.setAttribute('y', '0');
      label.setAttribute('class', 'player-label');
      label.textContent = player.label;
      group.appendChild(label);

      if (onClick) {
        group.style.cursor = 'pointer';
        group.addEventListener('click', () => onClick(player.label, positionDescriptions[player.label]));
      }

      svg.appendChild(group);
    });
  }

  // Main field creation function
  function create(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    container.innerHTML = '';

    const yardLine = typeof options.fieldPos === 'string'
      ? parseYardLine(options.fieldPos)
      : (options.yardLine || 25);

    const svg = createFieldSVG({
      showEndZone: options.showEndZone || false,
      showScoring: options.showScoring || false,
      yardLine: yardLine,
      firstDownDistance: options.firstDownDistance || 10
    });

    container.appendChild(svg);

    return {
      svg,
      container,
      yardLine
    };
  }

  // Set coverage on existing field
  function setCoverage(fieldObj, coverage, onClick = null) {
    if (!fieldObj || !fieldObj.svg) return;

    // Remove existing players
    const existingPlayers = fieldObj.svg.querySelectorAll('.player-marker');
    existingPlayers.forEach(p => p.remove());

    // Add new defensive players
    addDefensivePlayers(fieldObj.svg, coverage, fieldObj.yardLine, onClick);
  }

  // Add both offense and defense
  function setFullFormation(fieldObj, coverage, options = {}) {
    if (!fieldObj || !fieldObj.svg) return;

    // Remove existing players
    const existingPlayers = fieldObj.svg.querySelectorAll('.player-marker');
    existingPlayers.forEach(p => p.remove());

    // Add players
    if (options.showOffense !== false) {
      addOffensivePlayers(fieldObj.svg, fieldObj.yardLine, options.onOffenseClick);
    }
    if (options.showDefense !== false) {
      addDefensivePlayers(fieldObj.svg, coverage, fieldObj.yardLine, options.onDefenseClick);
    }
  }

  // Public API
  return {
    create,
    setCoverage,
    setFullFormation,
    parseYardLine,
    formations,
    positionDescriptions
  };
})();

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.Field = Field;
}
