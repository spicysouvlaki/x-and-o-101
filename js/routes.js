/**
 * Route diagrams module - ported from route-diagram.tsx
 * Renders SVG route diagrams for pass routes and run plays
 */

const Routes = (function() {
  // Simplified route definitions - 6 essential routes with situational framing
  const passRoutes = {
    'Slant': {
      name: 'Slant',
      situation: 'Defense is in <span class="term" data-term="man">man coverage</span>',
      description: 'Quick inside break at 45 degrees. The receiver uses inside leverage to create separation from the defender.',
      reward: 'Fast, high-percentage throw that\'s hard to defend one-on-one',
      risk: 'Linebacker can read it and jump the route for an interception',
      tips: ['QB throws within 2 seconds of snap', 'Receiver breaks sharply at 3-5 yards', 'Great <span class="term" data-term="hot-route">hot route</span> against <span class="term" data-term="blitz">blitz</span>']
    },
    'Post': {
      name: 'Post',
      situation: 'Defense shows <span class="term" data-term="single-high">single-high</span> safety',
      description: 'Deep route breaking toward the goalpost at 12-15 yards. Attacks the middle of the field.',
      reward: 'Big play potential - can go for 20+ yards or a touchdown',
      risk: 'Takes time to develop; QB can get sacked if protection breaks down',
      tips: ['Safety commits to one side, throw to the other', 'Receiver must beat corner off the line', 'Often paired with play-action']
    },
    'Curl': {
      name: 'Curl',
      situation: 'Need to move the chains on 3rd down',
      description: 'Receiver runs 10-12 yards, stops, and turns back toward the QB. Finds the soft spot in <span class="term" data-term="zone">zone coverage</span>.',
      reward: 'Reliable chain-mover; receiver can adjust to find open space',
      risk: 'Limited yards after catch; defender can close quickly',
      tips: ['Receiver "sits" in the hole between defenders', 'QB must anticipate the break', 'Good for 3rd and 6-8 situations']
    },
    'Drag': {
      name: 'Drag',
      situation: 'Defense is in <span class="term" data-term="zone">zone coverage</span>',
      description: 'Shallow crossing route at ~5 yards. Receiver runs across the field underneath the <span class="term" data-term="coverage">coverage</span>.',
      reward: 'High-percentage throw that exploits gaps between zone defenders',
      risk: 'Short gain; need blockers for yards after catch',
      tips: ['Watch for soft spots as receiver crosses', 'Often open against Cover 2 or Cover 3', 'Quick throw avoids pressure']
    },
    'Fade': {
      name: 'Fade',
      situation: 'In the <span class="term" data-term="red-zone">red zone</span> with one-on-one coverage',
      description: 'Straight vertical along the sideline. QB throws to the back shoulder where only the receiver can get it.',
      reward: 'Touchdown or nothing - great when you need 6 points',
      risk: 'Low completion percentage; requires perfect timing and throw',
      tips: ['Look for size mismatch (tall receiver vs short corner)', 'Back-shoulder throw keeps it away from defender', 'Trust your receiver to make the play']
    },
    'Screen': {
      name: 'Screen',
      situation: 'Defense is <span class="term" data-term="blitz">blitzing</span> heavily',
      description: 'RB or receiver catches behind the line with blockers setting up ahead. Uses the defense\'s aggression against them.',
      reward: 'Can turn a blitz into a big gain with blockers in space',
      risk: 'If defense reads it, can be a big loss or turnover',
      tips: ['O-line lets rushers through, then blocks downfield', 'RB must be patient waiting for blocks', 'Works best when defense expects deep pass']
    }
  };

  // Simplified run plays - 4 essential concepts
  const runPlays = {
    'Inside Zone': {
      name: 'Inside Zone',
      situation: 'Standard running down, defense not stacking the box',
      description: 'Zone blocking where linemen block areas, not specific defenders. RB reads the blocks and finds the best lane.',
      reward: 'Consistent yards; RB can adjust to what the defense gives',
      risk: 'Can get stuffed if defense fills the gaps quickly',
      tips: ['Watch RB\'s eyes - he\'s reading blocks', 'One cut and go north', 'Most common run play in NFL']
    },
    'Power': {
      name: 'Power',
      situation: 'Short yardage or goal line - need to move the pile',
      description: 'A guard pulls across the formation to lead block. Downhill, physical running.',
      reward: 'Hard to stop when executed well; wears down defense',
      risk: 'Predictable direction; defense can stack the point of attack',
      tips: ['Watch for pulling lineman', 'RB follows the lead blocker', 'Classic "ground and pound" football']
    },
    'Counter': {
      name: 'Counter',
      situation: 'Defense is over-pursuing or playing aggressively',
      description: 'Misdirection - backfield action goes one way, but linemen pull the other way. Freezes linebackers.',
      reward: 'Big play potential when defense bites on the fake',
      risk: 'Takes time to develop; can lose yards if defense reads it',
      tips: ['Watch for initial fake one direction', 'RB takes handoff going opposite way', 'Sets up well after establishing inside zone']
    },
    'Draw': {
      name: 'Draw',
      situation: 'Obvious passing down (3rd and long) or heavy pass rush',
      description: 'Fake pass, then delayed handoff. Uses the defense\'s pass rush aggression against them.',
      reward: 'Catches defense off guard; can get chunk yards',
      risk: 'If defense doesn\'t bite, RB has nowhere to go',
      tips: ['QB drops back like it\'s a pass', 'O-line lets rushers upfield, then blocks', 'Works best on 3rd and 8+']
    }
  };

  // SVG path definitions for each route (simplified to 6 pass + 4 run)
  const routePaths = {
    // Pass Routes
    'Slant': {
      lines: [
        { x1: 40, y1: 50, x2: 40, y2: 43 },
        { x1: 40, y1: 43, x2: 55, y2: 28 }
      ],
      arrow: { x: 55, y: 28, direction: 'up-right' }
    },
    'Post': {
      lines: [
        { x1: 40, y1: 50, x2: 40, y2: 25 },
        { x1: 40, y1: 25, x2: 50, y2: 10 }
      ],
      arrow: { x: 50, y: 10, direction: 'up-right' }
    },
    'Curl': {
      lines: [
        { x1: 40, y1: 50, x2: 40, y2: 30 }
      ],
      curves: [
        { d: 'M 40 30 Q 38 28 35 32' }
      ],
      arrow: { x: 35, y: 32, direction: 'down-left' }
    },
    'Drag': {
      lines: [
        { x1: 40, y1: 50, x2: 40, y2: 40 },
        { x1: 40, y1: 40, x2: 65, y2: 40 }
      ],
      arrow: { x: 65, y: 40, direction: 'right' }
    },
    'Fade': {
      lines: [
        { x1: 15, y1: 50, x2: 10, y2: 10 }
      ],
      arrow: { x: 10, y: 10, direction: 'up' }
    },
    'Screen': {
      lines: [
        { x1: 40, y1: 50, x2: 40, y2: 52 }
      ],
      curves: [
        { d: 'M 40 52 Q 35 55 25 52' }
      ],
      arrow: { x: 25, y: 52, direction: 'left' }
    },
    // Run Plays
    'Inside Zone': {
      lines: [
        { x1: 40, y1: 55, x2: 40, y2: 52, dashed: true }
      ],
      curves: [
        { d: 'M 40 52 Q 45 45 45 35' }
      ],
      arrow: { x: 45, y: 35, direction: 'up' }
    },
    'Power': {
      lines: [
        { x1: 40, y1: 55, x2: 40, y2: 50, dashed: true },
        { x1: 40, y1: 50, x2: 50, y2: 40 }
      ],
      arrow: { x: 50, y: 40, direction: 'up-right' }
    },
    'Counter': {
      lines: [
        { x1: 40, y1: 55, x2: 25, y2: 55, dashed: true }
      ],
      curves: [
        { d: 'M 25 55 Q 30 50 40 45 Q 55 35 60 25' }
      ],
      arrow: { x: 60, y: 25, direction: 'up-right' }
    },
    'Draw': {
      lines: [
        { x1: 40, y1: 55, x2: 40, y2: 50, dashed: true },
        { x1: 40, y1: 50, x2: 40, y2: 35 }
      ],
      arrow: { x: 40, y: 35, direction: 'up' }
    }
  };

  // Create SVG namespace helper
  function createSVGElement(tag) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
  }

  // Get arrow points based on direction
  function getArrowPoints(x, y, direction) {
    const size = 4;
    const points = {
      'up': `${x},${y} ${x-size/2},${y+size} ${x+size/2},${y+size}`,
      'right': `${x},${y} ${x-size},${y-size/2} ${x-size},${y+size/2}`,
      'left': `${x},${y} ${x+size},${y-size/2} ${x+size},${y+size/2}`,
      'down': `${x},${y} ${x-size/2},${y-size} ${x+size/2},${y-size}`,
      'up-right': `${x},${y} ${x-size},${y} ${x-size/2},${y+size/2}`,
      'up-left': `${x},${y} ${x+size},${y} ${x+size/2},${y+size/2}`,
      'down-right': `${x},${y} ${x-size},${y} ${x-size/2},${y-size/2}`,
      'down-left': `${x},${y} ${x+size},${y} ${x+size/2},${y-size/2}`
    };
    return points[direction] || points['up'];
  }

  // Create route diagram SVG
  function createRouteDiagram(routeName, options = {}) {
    const { width = 80, height = 60, animate = false } = options;

    const svg = createSVGElement('svg');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('class', 'route-diagram-svg');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.style.width = '100%';
    svg.style.height = '100%';

    // Field background
    const bg = createSVGElement('rect');
    bg.setAttribute('x', '0');
    bg.setAttribute('y', '0');
    bg.setAttribute('width', width.toString());
    bg.setAttribute('height', height.toString());
    bg.setAttribute('fill', '#16a34a');
    svg.appendChild(bg);

    // Hash marks
    const leftHash = createSVGElement('line');
    leftHash.setAttribute('x1', '35');
    leftHash.setAttribute('y1', '0');
    leftHash.setAttribute('x2', '35');
    leftHash.setAttribute('y2', height.toString());
    leftHash.setAttribute('stroke', 'white');
    leftHash.setAttribute('stroke-width', '0.5');
    leftHash.setAttribute('stroke-dasharray', '2,2');
    leftHash.setAttribute('opacity', '0.3');
    svg.appendChild(leftHash);

    const rightHash = createSVGElement('line');
    rightHash.setAttribute('x1', '45');
    rightHash.setAttribute('y1', '0');
    rightHash.setAttribute('x2', '45');
    rightHash.setAttribute('y2', height.toString());
    rightHash.setAttribute('stroke', 'white');
    rightHash.setAttribute('stroke-width', '0.5');
    rightHash.setAttribute('stroke-dasharray', '2,2');
    rightHash.setAttribute('opacity', '0.3');
    svg.appendChild(rightHash);

    // Line of scrimmage
    const los = createSVGElement('line');
    los.setAttribute('x1', '0');
    los.setAttribute('y1', '50');
    los.setAttribute('x2', width.toString());
    los.setAttribute('y2', '50');
    los.setAttribute('stroke', '#fbbf24');
    los.setAttribute('stroke-width', '1');
    svg.appendChild(los);

    // First down line
    const firstDown = createSVGElement('line');
    firstDown.setAttribute('x1', '0');
    firstDown.setAttribute('y1', '20');
    firstDown.setAttribute('x2', width.toString());
    firstDown.setAttribute('y2', '20');
    firstDown.setAttribute('stroke', '#10b981');
    firstDown.setAttribute('stroke-width', '1');
    firstDown.setAttribute('stroke-dasharray', '3,2');
    svg.appendChild(firstDown);

    // Draw route path
    const path = routePaths[routeName];
    if (path) {
      // Draw lines
      if (path.lines) {
        path.lines.forEach(line => {
          const lineEl = createSVGElement('line');
          lineEl.setAttribute('x1', line.x1.toString());
          lineEl.setAttribute('y1', line.y1.toString());
          lineEl.setAttribute('x2', line.x2.toString());
          lineEl.setAttribute('y2', line.y2.toString());
          lineEl.setAttribute('stroke', 'white');
          lineEl.setAttribute('stroke-width', '2');
          if (line.dashed) {
            lineEl.setAttribute('stroke-dasharray', '3,2');
          }
          svg.appendChild(lineEl);
        });
      }

      // Draw curves
      if (path.curves) {
        path.curves.forEach(curve => {
          const pathEl = createSVGElement('path');
          pathEl.setAttribute('d', curve.d);
          pathEl.setAttribute('stroke', 'white');
          pathEl.setAttribute('stroke-width', '2');
          pathEl.setAttribute('fill', 'none');
          svg.appendChild(pathEl);
        });
      }

      // Draw arrow
      if (path.arrow) {
        const arrow = createSVGElement('polygon');
        arrow.setAttribute('points', getArrowPoints(path.arrow.x, path.arrow.y, path.arrow.direction));
        arrow.setAttribute('fill', 'white');
        svg.appendChild(arrow);
      }

      // Starting point (receiver position)
      const startX = path.lines ? path.lines[0].x1 : 40;
      const startY = path.lines ? path.lines[0].y1 : 50;
      const startPoint = createSVGElement('circle');
      startPoint.setAttribute('cx', startX.toString());
      startPoint.setAttribute('cy', startY.toString());
      startPoint.setAttribute('r', '3');
      startPoint.setAttribute('fill', '#3b82f6');
      startPoint.setAttribute('stroke', 'white');
      startPoint.setAttribute('stroke-width', '1');
      svg.appendChild(startPoint);
    }

    return svg;
  }

  // Render route to container
  function render(containerId, routeName, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    container.innerHTML = '';
    const svg = createRouteDiagram(routeName, options);
    container.appendChild(svg);

    return svg;
  }

  // Get all routes by type
  function getRoutes(type = 'pass') {
    return type === 'pass' ? passRoutes : runPlays;
  }

  // Get route info
  function getRouteInfo(routeName) {
    return passRoutes[routeName] || runPlays[routeName] || null;
  }

  // Get all route names
  function getAllRouteNames() {
    return {
      pass: Object.keys(passRoutes),
      run: Object.keys(runPlays)
    };
  }

  // Public API
  return {
    render,
    createRouteDiagram,
    getRoutes,
    getRouteInfo,
    getAllRouteNames,
    passRoutes,
    runPlays
  };
})();

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.Routes = Routes;
}
