/**
 * Route diagrams module - ported from route-diagram.tsx
 * Renders SVG route diagrams for pass routes and run plays
 */

const Routes = (function() {
  // Route definitions with descriptions and tips
  const passRoutes = {
    'Drag': {
      name: 'Drag',
      description: 'Shallow crossing route, ~5 yards across the field. High-percentage throw.',
      beats: ['Zone Coverage', 'Cover 2', 'Cover 3'],
      tips: ['Quick throw against zone', 'Look for soft spots in coverage', 'Great hot route against blitz']
    },
    'Corner': {
      name: 'Corner',
      description: 'Deep outside break toward the corner of the end zone. 15-20 yards.',
      beats: ['Cover 2', 'Two-High Shell'],
      tips: ['Attacks the hole between corner and safety', 'Best thrown to the sideline', 'Timing route - throw before the break']
    },
    'Seam': {
      name: 'Seam',
      description: 'Vertical route up the middle, between hash marks.',
      beats: ['Cover 3', 'Single-High Safety'],
      tips: ['Attack the middle of the field', 'Great for tight ends', 'Read the safety - throw if he commits']
    },
    'Slant': {
      name: 'Slant',
      description: 'Quick inside break at 45 degrees, 3-5 yards.',
      beats: ['Man Coverage', 'Press Coverage'],
      tips: ['Quick throw beats man', 'Hot route against pressure', 'Receiver uses inside leverage']
    },
    'Post': {
      name: 'Post',
      description: 'Deep route breaking toward the goalpost, 12-15 yards.',
      beats: ['Cover 1', 'Single-High Safety'],
      tips: ['Attack single-high safety', 'Big play potential', 'Read safety rotation']
    },
    'Out': {
      name: 'Out',
      description: 'Sharp 90-degree break toward the sideline, 10-12 yards.',
      beats: ['Zone Coverage', 'Soft Coverage'],
      tips: ['Timing throw to the sideline', 'Receiver must sell vertical first', 'Watch for underneath defenders']
    },
    'Fade': {
      name: 'Fade',
      description: 'Straight vertical along the sideline. Red zone specialty.',
      beats: ['Man Coverage', 'Tight Coverage'],
      tips: ['Back shoulder throw', 'Perfect for red zone', 'Trust your receiver in one-on-one']
    },
    'Flat': {
      name: 'Flat',
      description: 'Quick route to the flat area near the sideline.',
      beats: ['Blitz', 'Zone Coverage'],
      tips: ['Safety valve against pressure', 'Check down option', 'Get the ball out quick']
    },
    'Screen': {
      name: 'Screen',
      description: 'Receiver or RB catches behind the line with blockers ahead.',
      beats: ['Heavy Pass Rush', 'Aggressive Defense'],
      tips: ['Use against blitz-heavy defenses', 'Let blockers set up', 'Patience is key']
    },
    'Check Down': {
      name: 'Check Down',
      description: 'Short dump-off to RB or nearby receiver. Last resort.',
      beats: ['Deep Coverage', 'Prevent Defense'],
      tips: ['Take what the defense gives', 'Live to play another down', 'Better than a sack']
    },
    'Dig': {
      name: 'Dig',
      description: 'In-breaking route at 12-15 yards. Sharp 90-degree cut.',
      beats: ['Cover 3', 'Zone Coverage'],
      tips: ['Attacks the middle of zone', 'Sit in the soft spot', 'Great for moving the chains']
    },
    'Curl': {
      name: 'Curl',
      description: 'Stop and turn back toward the QB at 10-12 yards.',
      beats: ['Zone Coverage', 'Off Coverage'],
      tips: ['Receiver finds the hole', 'Timing route', 'Good for third and medium']
    }
  };

  const runPlays = {
    'Inside Zone': {
      name: 'Inside Zone',
      description: 'Zone blocking scheme between the tackles. RB reads blocks and finds cutback.',
      beats: ['Aggressive LBs', 'Slanting D-Line'],
      tips: ['RB reads the blocks', 'One cut and go', 'Great for short yardage']
    },
    'Outside Zone': {
      name: 'Outside Zone',
      description: 'Stretch play toward the edge with cutback option.',
      beats: ['Two-High Safety', 'Spread Defense'],
      tips: ['Get RB in space', 'Use athleticism', 'Cutback if edge is lost']
    },
    'Power Run': {
      name: 'Power Run',
      description: 'Pulling guard leads through the hole. Downhill running.',
      beats: ['Light Boxes', 'Single-High Safety'],
      tips: ['Physical, downhill run', 'Follow the pulling guard', 'Pound the defense']
    },
    'Counter': {
      name: 'Counter',
      description: 'Misdirection - backfield action one way, linemen pull the other.',
      beats: ['Aggressive LBs', 'Over-pursuing Defense'],
      tips: ['Sell the fake', 'Patience for the cutback', 'Great on short yardage']
    },
    'Draw Play': {
      name: 'Draw Play',
      description: 'Fake pass, delayed handoff. Uses pass rush against itself.',
      beats: ['Pass Rush Heavy', 'Obvious Pass Situation'],
      tips: ['Set up with pass looks', 'RB waits for lanes', 'Surprise element']
    },
    'QB Power': {
      name: 'QB Power',
      description: 'QB keeps and runs with lead blockers. Read option or designed.',
      beats: ['Light Boxes', 'RB-focused Defense'],
      tips: ['Use mobile QB', 'Read the unblocked defender', 'Take what they give']
    }
  };

  // SVG path definitions for each route
  const routePaths = {
    'Drag': {
      lines: [
        { x1: 40, y1: 50, x2: 40, y2: 40 },
        { x1: 40, y1: 40, x2: 65, y2: 40 }
      ],
      arrow: { x: 65, y: 40, direction: 'right' }
    },
    'Corner': {
      lines: [
        { x1: 40, y1: 50, x2: 40, y2: 25 }
      ],
      curves: [
        { d: 'M 40 25 Q 50 20 60 10' }
      ],
      arrow: { x: 60, y: 10, direction: 'up-right' }
    },
    'Seam': {
      lines: [
        { x1: 40, y1: 50, x2: 40, y2: 10 }
      ],
      arrow: { x: 40, y: 10, direction: 'up' }
    },
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
    'Out': {
      lines: [
        { x1: 40, y1: 50, x2: 40, y2: 30 },
        { x1: 40, y1: 30, x2: 70, y2: 30 }
      ],
      arrow: { x: 70, y: 30, direction: 'right' }
    },
    'Fade': {
      lines: [
        { x1: 15, y1: 50, x2: 10, y2: 10 }
      ],
      arrow: { x: 10, y: 10, direction: 'up' }
    },
    'Flat': {
      lines: [
        { x1: 40, y1: 50, x2: 40, y2: 48 }
      ],
      curves: [
        { d: 'M 40 48 Q 50 45 65 48' }
      ],
      arrow: { x: 65, y: 48, direction: 'right' }
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
    'Check Down': {
      lines: [
        { x1: 40, y1: 55, x2: 40, y2: 48 },
        { x1: 40, y1: 48, x2: 30, y2: 48 }
      ],
      arrow: { x: 30, y: 48, direction: 'left' }
    },
    'Dig': {
      lines: [
        { x1: 40, y1: 50, x2: 40, y2: 25 },
        { x1: 40, y1: 25, x2: 60, y2: 25 }
      ],
      arrow: { x: 60, y: 25, direction: 'right' }
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
    'Inside Zone': {
      lines: [
        { x1: 40, y1: 55, x2: 40, y2: 52, dashed: true }
      ],
      curves: [
        { d: 'M 40 52 Q 45 45 45 35' }
      ],
      arrow: { x: 45, y: 35, direction: 'up' }
    },
    'Outside Zone': {
      lines: [
        { x1: 40, y1: 55, x2: 55, y2: 55, dashed: true }
      ],
      curves: [
        { d: 'M 55 55 Q 65 50 65 35' }
      ],
      arrow: { x: 65, y: 35, direction: 'up' }
    },
    'Power Run': {
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
    'Draw Play': {
      lines: [
        { x1: 40, y1: 55, x2: 40, y2: 50, dashed: true },
        { x1: 40, y1: 50, x2: 40, y2: 35 }
      ],
      arrow: { x: 40, y: 35, direction: 'up' }
    },
    'QB Power': {
      lines: [
        { x1: 40, y1: 52, x2: 45, y2: 50, dashed: true },
        { x1: 45, y1: 50, x2: 55, y2: 40 }
      ],
      arrow: { x: 55, y: 40, direction: 'up-right' }
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
