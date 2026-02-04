/**
 * Field rendering module - ported from defensive-formation.tsx
 * Renders SVG football field with defensive formations
 */

const Field = (function() {
  // Coverage definitions with zone assignments for play art
  const coveragePlayArt = {
    'Two-High Shell': {
      type: 'zone',
      zones: [
        // Safeties: deep halves
        { defender: 'FS', zoneX: 25, zoneY: -18 },
        { defender: 'SS', zoneX: 75, zoneY: -18 },
        // Corners: flats
        { defender: 'CB', side: 'left', zoneX: 10, zoneY: -8 },
        { defender: 'CB', side: 'right', zoneX: 90, zoneY: -8 },
        // LBs: hooks
        { defender: 'LB', side: 'left', zoneX: 30, zoneY: -8 },
        { defender: 'MLB', zoneX: 50, zoneY: -10 },
        { defender: 'LB', side: 'right', zoneX: 70, zoneY: -8 }
      ]
    },
    'Cover 2': {
      type: 'zone',
      zones: [
        { defender: 'FS', zoneX: 25, zoneY: -18 },
        { defender: 'SS', zoneX: 75, zoneY: -18 },
        { defender: 'CB', side: 'left', zoneX: 8, zoneY: -6 },
        { defender: 'CB', side: 'right', zoneX: 92, zoneY: -6 },
        { defender: 'LB', side: 'left', zoneX: 30, zoneY: -8 },
        { defender: 'MLB', zoneX: 50, zoneY: -10 },
        { defender: 'LB', side: 'right', zoneX: 70, zoneY: -8 }
      ]
    },
    'Cover 3': {
      type: 'zone',
      zones: [
        // Single high safety: deep middle
        { defender: 'FS', zoneX: 50, zoneY: -20 },
        // Corners: deep thirds
        { defender: 'CB', side: 'left', zoneX: 20, zoneY: -18 },
        { defender: 'CB', side: 'right', zoneX: 80, zoneY: -18 },
        // LBs: underneath zones
        { defender: 'LB', side: 'left', zoneX: 25, zoneY: -8 },
        { defender: 'MLB', side: 'left', zoneX: 40, zoneY: -8 },
        { defender: 'MLB', side: 'right', zoneX: 60, zoneY: -8 },
        { defender: 'LB', side: 'right', zoneX: 75, zoneY: -8 }
      ]
    },
    'Cover 4': {
      type: 'zone',
      zones: [
        { defender: 'FS', zoneX: 35, zoneY: -18 },
        { defender: 'SS', zoneX: 65, zoneY: -18 },
        { defender: 'CB', side: 'left', zoneX: 15, zoneY: -18 },
        { defender: 'CB', side: 'right', zoneX: 85, zoneY: -18 },
        { defender: 'LB', side: 'left', zoneX: 30, zoneY: -6 },
        { defender: 'MLB', zoneX: 50, zoneY: -8 },
        { defender: 'LB', side: 'right', zoneX: 70, zoneY: -6 }
      ]
    },
    'Man Coverage': {
      type: 'man',
      assignments: [
        { defender: 'CB', side: 'left', targetX: 15, targetY: 2 },
        { defender: 'CB', side: 'right', targetX: 85, targetY: 2 },
        { defender: 'LB', side: 'right', targetX: 65, targetY: 2 },
        { defender: 'LB', side: 'left', targetX: 50, targetY: 8 }
      ],
      safety: { defender: 'FS', zoneX: 50, zoneY: -15 }
    },
    'Cover 1': {
      type: 'man',
      assignments: [
        { defender: 'CB', side: 'left', targetX: 15, targetY: 2 },
        { defender: 'CB', side: 'right', targetX: 85, targetY: 2 },
        { defender: 'LB', side: 'right', targetX: 65, targetY: 2 },
        { defender: 'LB', side: 'left', targetX: 50, targetY: 8 }
      ],
      safety: { defender: 'FS', zoneX: 50, zoneY: -15 }
    }
  };

  // Defensive play definitions for each coverage
  const defensivePlays = {
    'Two-High Shell': {
      'zone': {
        name: 'Cover 2 Zone',
        drops: coveragePlayArt['Two-High Shell'].zones
      },
      'blitz': {
        name: 'Zone Blitz',
        rushers: [
          { defender: 'LB', side: 'right', path: [[65, -3], [55, 0], [50, 5]] }
        ],
        drops: [
          { defender: 'FS', zoneX: 25, zoneY: -18 },
          { defender: 'SS', zoneX: 75, zoneY: -18 },
          { defender: 'CB', side: 'left', zoneX: 10, zoneY: -8 },
          { defender: 'CB', side: 'right', zoneX: 90, zoneY: -8 },
          { defender: 'LB', side: 'left', zoneX: 30, zoneY: -8 },
          { defender: 'MLB', zoneX: 50, zoneY: -10 }
        ]
      }
    },
    'Cover 3': {
      'zone': {
        name: 'Cover 3 Zone',
        drops: coveragePlayArt['Cover 3'].zones
      },
      'blitz': {
        name: 'Fire Zone',
        rushers: [
          { defender: 'LB', side: 'left', path: [[30, -4], [40, 0], [45, 5]] },
          { defender: 'LB', side: 'right', path: [[70, -4], [60, 0], [55, 5]] }
        ],
        drops: [
          { defender: 'FS', zoneX: 50, zoneY: -20 },
          { defender: 'CB', side: 'left', zoneX: 20, zoneY: -18 },
          { defender: 'CB', side: 'right', zoneX: 80, zoneY: -18 },
          { defender: 'MLB', side: 'left', zoneX: 35, zoneY: -8 },
          { defender: 'MLB', side: 'right', zoneX: 65, zoneY: -8 }
        ]
      }
    },
    'Cover 1': {
      'zone': {
        name: 'Cover 1 Man',
        assignments: coveragePlayArt['Cover 1'].assignments,
        safety: coveragePlayArt['Cover 1'].safety
      },
      'blitz': {
        name: 'Cover 1 Blitz',
        rushers: [
          { defender: 'MLB', path: [[50, -3], [50, 2], [50, 8]] },
          { defender: 'LB', side: 'left', path: [[35, -3], [40, 0], [45, 5]] }
        ],
        assignments: [
          { defender: 'CB', side: 'left', targetX: 15, targetY: 2 },
          { defender: 'CB', side: 'right', targetX: 85, targetY: 2 },
          { defender: 'LB', side: 'right', targetX: 65, targetY: 2 }
        ],
        safety: { defender: 'FS', zoneX: 50, zoneY: -15 }
      }
    }
  };

  // Offensive play definitions for each formation
  const offensivePlays = {
    'shotgun': {
      'run': {
        name: 'Inside Zone',
        routes: [
          { player: 'RB', path: [[56, 8], [52, 4], [50, -5]], type: 'run' },
          { player: 'WR', from: [10, 2], path: [[10, 2], [20, 0]], type: 'block' },
          { player: 'WR', from: [25, 2], path: [[25, 2], [35, 0]], type: 'block' },
          { player: 'TE', from: [65, 2], path: [[65, 2], [60, 0]], type: 'block' }
        ]
      },
      'quick': {
        name: 'Quick Slants',
        routes: [
          { player: 'WR', from: [10, 2], path: [[10, 2], [10, -2], [25, -8]], type: 'route' },
          { player: 'WR', from: [25, 2], path: [[25, 2], [25, -2], [40, -8]], type: 'route' },
          { player: 'WR', from: [85, 2], path: [[85, 2], [85, -2], [70, -8]], type: 'route' },
          { player: 'TE', from: [65, 2], path: [[65, 2], [65, -3], [55, -6]], type: 'route' },
          { player: 'RB', from: [56, 8], path: [[56, 8], [70, 6]], type: 'route' }
        ]
      },
      'deep': {
        name: 'Four Verticals',
        routes: [
          { player: 'WR', from: [10, 2], path: [[10, 2], [10, -5], [15, -20]], type: 'route' },
          { player: 'WR', from: [25, 2], path: [[25, 2], [25, -5], [30, -20]], type: 'route' },
          { player: 'WR', from: [85, 2], path: [[85, 2], [85, -5], [80, -20]], type: 'route' },
          { player: 'TE', from: [65, 2], path: [[65, 2], [65, -5], [60, -20]], type: 'route' },
          { player: 'RB', from: [56, 8], path: [[56, 8], [45, 6], [35, -5]], type: 'route' }
        ]
      }
    },
    'under-center': {
      'run': {
        name: 'Power Run',
        routes: [
          { player: 'RB', path: [[50, 9], [55, 5], [60, -5]], type: 'run' },
          { player: 'TE', from: [65, 2], path: [[65, 2], [55, -2]], type: 'block' }
        ]
      },
      'quick': {
        name: 'Play Action Short',
        routes: [
          { player: 'WR', from: [15, 2], path: [[15, 2], [15, -3], [25, -6]], type: 'route' },
          { player: 'WR', from: [85, 2], path: [[85, 2], [85, -3], [75, -6]], type: 'route' },
          { player: 'TE', from: [65, 2], path: [[65, 2], [65, -5], [55, -8]], type: 'route' },
          { player: 'RB', from: [50, 9], path: [[50, 9], [55, 5], [55, 3]], type: 'fake', label: 'FAKE' }
        ]
      },
      'deep': {
        name: 'Play Action Deep',
        routes: [
          { player: 'WR', from: [15, 2], path: [[15, 2], [15, -8], [25, -20]], type: 'route' },
          { player: 'WR', from: [85, 2], path: [[85, 2], [85, -8], [75, -20]], type: 'route' },
          { player: 'TE', from: [65, 2], path: [[65, 2], [65, -8], [50, -18]], type: 'route' },
          { player: 'RB', from: [50, 9], path: [[50, 9], [55, 5], [55, 3]], type: 'fake', label: 'FAKE' }
        ]
      }
    },
    'i-formation': {
      'run': {
        name: 'ISO Run',
        routes: [
          { player: 'FB', path: [[50, 7], [50, 2], [50, -2]], type: 'block' },
          { player: 'RB', path: [[50, 11], [50, 5], [50, -8]], type: 'run' }
        ]
      },
      'quick': {
        name: 'Quick Out',
        routes: [
          { player: 'WR', from: [15, 2], path: [[15, 2], [15, -4], [5, -4]], type: 'route' },
          { player: 'WR', from: [85, 2], path: [[85, 2], [85, -4], [95, -4]], type: 'route' },
          { player: 'TE', from: [65, 2], path: [[65, 2], [68, -5]], type: 'route' },
          { player: 'FB', from: [50, 7], path: [[50, 7], [40, 5]], type: 'block' }
        ]
      },
      'deep': {
        name: 'Deep Post',
        routes: [
          { player: 'WR', from: [15, 2], path: [[15, 2], [15, -10], [35, -20]], type: 'route' },
          { player: 'WR', from: [85, 2], path: [[85, 2], [85, -10], [65, -20]], type: 'route' },
          { player: 'TE', from: [65, 2], path: [[65, 2], [65, -6], [55, -10]], type: 'route' },
          { player: 'FB', from: [50, 7], path: [[50, 7], [40, 5]], type: 'block' }
        ]
      }
    },
    'empty': {
      'run': {
        name: 'QB Draw',
        routes: [
          { player: 'QB', path: [[50, 8], [50, 4], [50, -8]], type: 'run' }
        ]
      },
      'quick': {
        name: 'Mesh Concept',
        routes: [
          { player: 'WR', from: [5, 2], path: [[5, 2], [5, -2], [30, -4]], type: 'route' },
          { player: 'WR', from: [20, 2], path: [[20, 2], [20, -2], [40, -4]], type: 'route' },
          { player: 'WR', from: [70, 2], path: [[70, 2], [70, -2], [50, -4]], type: 'route' },
          { player: 'WR', from: [85, 2], path: [[85, 2], [85, -2], [60, -4]], type: 'route' },
          { player: 'WR', from: [95, 2], path: [[95, 2], [95, -5], [85, -10]], type: 'route' }
        ]
      },
      'deep': {
        name: 'All Go',
        routes: [
          { player: 'WR', from: [5, 2], path: [[5, 2], [5, -5], [10, -20]], type: 'route' },
          { player: 'WR', from: [20, 2], path: [[20, 2], [20, -5], [25, -20]], type: 'route' },
          { player: 'WR', from: [70, 2], path: [[70, 2], [70, -5], [65, -20]], type: 'route' },
          { player: 'WR', from: [85, 2], path: [[85, 2], [85, -5], [80, -20]], type: 'route' },
          { player: 'WR', from: [95, 2], path: [[95, 2], [95, -5], [90, -20]], type: 'route' }
        ]
      }
    }
  };

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
        { x: 50, y: -15, label: 'FS' },
        { x: 65, y: -6, label: 'SS' }
      ],
      corners: [
        { x: 20, y: -12, label: 'CB' },
        { x: 80, y: -12, label: 'CB' }
      ],
      linebackers: [
        { x: 30, y: -4, label: 'LB' },
        { x: 50, y: -4, label: 'MLB' },
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
        { x: 50, y: -12, label: 'FS' },
        { x: 60, y: -5, label: 'SS' }
      ],
      corners: [
        { x: 15, y: -2, label: 'CB' },
        { x: 85, y: -2, label: 'CB' }
      ],
      linebackers: [
        { x: 35, y: -3, label: 'LB' },
        { x: 50, y: -3, label: 'MLB' },
        { x: 70, y: -3, label: 'LB' }
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
    },
    'shotgun': {
      qb: { x: 50, y: 8, label: 'QB' },
      oline: [
        { x: 40, y: 2, label: 'LT' },
        { x: 44, y: 2, label: 'LG' },
        { x: 50, y: 2, label: 'C' },
        { x: 56, y: 2, label: 'RG' },
        { x: 60, y: 2, label: 'RT' }
      ],
      receivers: [
        { x: 10, y: 2, label: 'WR' },
        { x: 25, y: 2, label: 'WR' },
        { x: 85, y: 2, label: 'WR' }
      ],
      te: { x: 65, y: 2, label: 'TE' },
      rb: { x: 56, y: 8, label: 'RB' }
    },
    'under-center': {
      qb: { x: 50, y: 4, label: 'QB' },
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
      rb: { x: 50, y: 9, label: 'RB' }
    },
    'i-formation': {
      qb: { x: 50, y: 4, label: 'QB' },
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
      fb: { x: 50, y: 7, label: 'FB' },
      rb: { x: 50, y: 11, label: 'RB' }
    },
    'empty': {
      qb: { x: 50, y: 8, label: 'QB' },
      oline: [
        { x: 40, y: 2, label: 'LT' },
        { x: 44, y: 2, label: 'LG' },
        { x: 50, y: 2, label: 'C' },
        { x: 56, y: 2, label: 'RG' },
        { x: 60, y: 2, label: 'RT' }
      ],
      receivers: [
        { x: 5, y: 2, label: 'WR' },
        { x: 20, y: 2, label: 'WR' },
        { x: 70, y: 2, label: 'WR' },
        { x: 85, y: 2, label: 'WR' },
        { x: 95, y: 2, label: 'WR' }
      ]
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
    'FB': {
      name: 'Fullback',
      desc: 'Lead blocker for the running back. Clears a path through defenders. Can also carry the ball in short-yardage situations.'
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

  // Helper to create an arrow with head
  function createArrow(x1, y1, x2, y2, cssClass = 'coverage-arrow', delay = 0) {
    const group = createSVGElement('g');

    // Arrow line
    const line = createSVGElement('line');
    line.setAttribute('x1', x1.toString());
    line.setAttribute('y1', y1.toString());
    line.setAttribute('x2', x2.toString());
    line.setAttribute('y2', y2.toString());
    line.setAttribute('class', cssClass);
    line.style.animationDelay = `${delay}s`;
    group.appendChild(line);

    // Arrow head
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const headLen = 2.5;
    const head = createSVGElement('polygon');
    const hx1 = x2 - headLen * Math.cos(angle - Math.PI / 6);
    const hy1 = y2 - headLen * Math.sin(angle - Math.PI / 6);
    const hx2 = x2 - headLen * Math.cos(angle + Math.PI / 6);
    const hy2 = y2 - headLen * Math.sin(angle + Math.PI / 6);
    head.setAttribute('points', `${x2},${y2} ${hx1},${hy1} ${hx2},${hy2}`);
    head.setAttribute('class', cssClass + '-head');
    head.style.animationDelay = `${delay}s`;
    group.appendChild(head);

    return group;
  }

  // Add coverage play art to the field
  function addCoverageZones(svg, coverage, yardLine = 25) {
    const playArt = coveragePlayArt[coverage] || coveragePlayArt['Two-High Shell'];
    const formation = formations[coverage] || formations['Two-High Shell'];

    const viewStart = Math.max(0, yardLine - 10);
    const viewEnd = Math.min(100, yardLine + 10);
    const losY = 90 - ((yardLine - viewStart) / (viewEnd - viewStart)) * 80;

    const zonesGroup = createSVGElement('g');
    zonesGroup.setAttribute('class', 'coverage-zones');

    let delayIndex = 0;

    // Helper to find defender position
    function findDefender(label, side = null) {
      const allDefenders = [
        ...formation.safeties,
        ...formation.corners,
        ...formation.linebackers
      ];
      return allDefenders.find(d => {
        if (d.label !== label) return false;
        if (side === 'left') return d.x < 50;
        if (side === 'right') return d.x >= 50;
        return true;
      });
    }

    if (playArt.type === 'zone') {
      // ZONE COVERAGE: Draw blue circles for zones, arrows from defenders to zones
      playArt.zones.forEach((zone, i) => {
        const defender = findDefender(zone.defender, zone.side);
        if (!defender) return;

        const defenderY = losY + (defender.y * 3);
        const zoneScreenY = losY + (zone.zoneY * 2);

        // Draw zone circle
        const circle = createSVGElement('circle');
        circle.setAttribute('cx', zone.zoneX.toString());
        circle.setAttribute('cy', zoneScreenY.toString());
        circle.setAttribute('r', '6');
        circle.setAttribute('class', 'zone-circle');
        circle.style.animationDelay = `${delayIndex * 0.06}s`;
        zonesGroup.appendChild(circle);

        // Draw arrow from defender to zone
        const arrow = createArrow(
          defender.x, defenderY,
          zone.zoneX, zoneScreenY + 4,
          'zone-arrow',
          delayIndex * 0.06
        );
        zonesGroup.appendChild(arrow);

        delayIndex++;
      });

    } else {
      // MAN COVERAGE: Draw red lines from defenders to receivers
      playArt.assignments.forEach((assignment, i) => {
        const defender = findDefender(assignment.defender, assignment.side);
        if (!defender) return;

        const defenderY = losY + (defender.y * 3);
        const targetY = losY + (assignment.targetY * 2);

        // Draw line to receiver
        const arrow = createArrow(
          defender.x, defenderY,
          assignment.targetX, targetY,
          'man-arrow',
          delayIndex * 0.06
        );
        zonesGroup.appendChild(arrow);

        delayIndex++;
      });

      // Safety help (zone circle for free safety)
      if (playArt.safety) {
        const safety = findDefender(playArt.safety.defender);
        if (safety) {
          const safetyY = losY + (safety.y * 3);
          const zoneY = losY + (playArt.safety.zoneY * 2);

          // Draw zone circle for safety help
          const circle = createSVGElement('circle');
          circle.setAttribute('cx', playArt.safety.zoneX.toString());
          circle.setAttribute('cy', zoneY.toString());
          circle.setAttribute('r', '8');
          circle.setAttribute('class', 'zone-circle safety-help');
          circle.style.animationDelay = `${delayIndex * 0.06}s`;
          zonesGroup.appendChild(circle);

          // Arrow to zone
          const arrow = createArrow(
            safety.x, safetyY,
            playArt.safety.zoneX, zoneY + 5,
            'zone-arrow',
            delayIndex * 0.06
          );
          zonesGroup.appendChild(arrow);
        }
      }
    }

    svg.appendChild(zonesGroup);
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
  function addOffensivePlayers(svg, yardLine = 25, onClick = null, formationName = 'default') {
    const formation = offensiveFormations[formationName] || offensiveFormations['default'];
    const viewStart = Math.max(0, yardLine - 10);
    const viewEnd = Math.min(100, yardLine + 10);
    const losY = 90 - ((yardLine - viewStart) / (viewEnd - viewStart)) * 80;

    const allPlayers = [
      formation.qb,
      ...formation.oline,
      ...(formation.receivers || []),
      formation.te,
      formation.fb,
      formation.rb
    ].filter(Boolean);

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
  function setCoverage(fieldObj, coverage, options = {}) {
    if (!fieldObj || !fieldObj.svg) return;

    const onClick = typeof options === 'function' ? options : options.onClick;
    const showZones = options.showZones !== false; // Default to true
    const playType = options.play || null;

    // Remove existing players, zones, and play art
    const existingPlayers = fieldObj.svg.querySelectorAll('.player-marker');
    existingPlayers.forEach(p => p.remove());
    const existingZones = fieldObj.svg.querySelectorAll('.coverage-zones');
    existingZones.forEach(z => z.remove());
    const existingPlayArt = fieldObj.svg.querySelectorAll('.defensive-play-art');
    existingPlayArt.forEach(p => p.remove());

    // Add play art if specified, otherwise show default zones
    if (playType && playType !== 'none') {
      addDefensivePlayArt(fieldObj.svg, coverage, playType, fieldObj.yardLine);
    } else if (showZones) {
      addCoverageZones(fieldObj.svg, coverage, fieldObj.yardLine);
    }

    // Add new defensive players
    addDefensivePlayers(fieldObj.svg, coverage, fieldObj.yardLine, onClick);

    // Add pop animation to new players
    const newPlayers = fieldObj.svg.querySelectorAll('.player-marker');
    newPlayers.forEach((p, i) => {
      p.classList.add('pop');
      // Stagger animations slightly
      p.style.animationDelay = `${i * 0.02}s`;
    });
  }

  // Add offensive play art (routes, run paths)
  function addOffensivePlayArt(svg, formationName, playType, yardLine = 25) {
    const plays = offensivePlays[formationName];
    if (!plays || !plays[playType]) return;

    const play = plays[playType];
    const viewStart = Math.max(0, yardLine - 10);
    const viewEnd = Math.min(100, yardLine + 10);
    const losY = 90 - ((yardLine - viewStart) / (viewEnd - viewStart)) * 80;

    const playGroup = createSVGElement('g');
    playGroup.setAttribute('class', 'play-art');

    play.routes.forEach((route, index) => {
      if (route.path && route.path.length >= 2) {
        // Build path string
        let pathD = '';
        route.path.forEach((point, i) => {
          const x = point[0];
          const y = losY + (point[1] * 2);
          if (i === 0) {
            pathD += `M ${x} ${y}`;
          } else {
            pathD += ` L ${x} ${y}`;
          }
        });

        // Draw the path
        const path = createSVGElement('path');
        path.setAttribute('d', pathD);
        path.setAttribute('class', `play-path play-${route.type}`);
        path.style.animationDelay = `${index * 0.08}s`;
        playGroup.appendChild(path);

        // Add arrow head at end
        const lastPoint = route.path[route.path.length - 1];
        const prevPoint = route.path[route.path.length - 2];
        const endX = lastPoint[0];
        const endY = losY + (lastPoint[1] * 2);
        const prevX = prevPoint[0];
        const prevY = losY + (prevPoint[1] * 2);

        const angle = Math.atan2(endY - prevY, endX - prevX);
        const headLen = 3;
        const head = createSVGElement('polygon');
        const hx1 = endX - headLen * Math.cos(angle - Math.PI / 6);
        const hy1 = endY - headLen * Math.sin(angle - Math.PI / 6);
        const hx2 = endX - headLen * Math.cos(angle + Math.PI / 6);
        const hy2 = endY - headLen * Math.sin(angle + Math.PI / 6);
        head.setAttribute('points', `${endX},${endY} ${hx1},${hy1} ${hx2},${hy2}`);
        head.setAttribute('class', `play-arrow play-${route.type}-arrow`);
        head.style.animationDelay = `${index * 0.08}s`;
        playGroup.appendChild(head);
      }
    });

    svg.appendChild(playGroup);
  }

  // Add defensive play art (blitz rushes, zone drops)
  function addDefensivePlayArt(svg, coverage, playType, yardLine = 25) {
    const plays = defensivePlays[coverage];
    if (!plays || !plays[playType]) return;

    const play = plays[playType];
    const formation = formations[coverage] || formations['Two-High Shell'];
    const viewStart = Math.max(0, yardLine - 10);
    const viewEnd = Math.min(100, yardLine + 10);
    const losY = 90 - ((yardLine - viewStart) / (viewEnd - viewStart)) * 80;

    const playGroup = createSVGElement('g');
    playGroup.setAttribute('class', 'defensive-play-art');

    // Helper to find defender position
    function findDefender(label, side = null) {
      const allDefenders = [
        ...formation.safeties,
        ...formation.corners,
        ...formation.linebackers
      ];
      return allDefenders.find(d => {
        if (d.label !== label) return false;
        if (side === 'left') return d.x < 50;
        if (side === 'right') return d.x >= 50;
        return true;
      });
    }

    let delayIndex = 0;

    // Draw blitz rushers
    if (play.rushers) {
      play.rushers.forEach((rusher, index) => {
        const defender = findDefender(rusher.defender, rusher.side);
        if (!defender || !rusher.path) return;

        // Build path from defender position through rush path
        let pathD = `M ${defender.x} ${losY + (defender.y * 3)}`;
        rusher.path.forEach((point) => {
          const x = point[0];
          const y = losY + (point[1] * 2);
          pathD += ` L ${x} ${y}`;
        });

        const path = createSVGElement('path');
        path.setAttribute('d', pathD);
        path.setAttribute('class', 'play-path blitz-path');
        path.style.animationDelay = `${delayIndex * 0.08}s`;
        playGroup.appendChild(path);

        // Arrow head at end
        const lastPoint = rusher.path[rusher.path.length - 1];
        const prevPoint = rusher.path.length > 1 ? rusher.path[rusher.path.length - 2] : [defender.x, defender.y];
        const endX = lastPoint[0];
        const endY = losY + (lastPoint[1] * 2);
        const prevX = prevPoint[0];
        const prevY = losY + (prevPoint[1] * 2);

        const angle = Math.atan2(endY - prevY, endX - prevX);
        const headLen = 3;
        const head = createSVGElement('polygon');
        const hx1 = endX - headLen * Math.cos(angle - Math.PI / 6);
        const hy1 = endY - headLen * Math.sin(angle - Math.PI / 6);
        const hx2 = endX - headLen * Math.cos(angle + Math.PI / 6);
        const hy2 = endY - headLen * Math.sin(angle + Math.PI / 6);
        head.setAttribute('points', `${endX},${endY} ${hx1},${hy1} ${hx2},${hy2}`);
        head.setAttribute('class', 'play-arrow blitz-arrow');
        head.style.animationDelay = `${delayIndex * 0.08}s`;
        playGroup.appendChild(head);

        delayIndex++;
      });
    }

    // Draw zone drops
    if (play.drops) {
      play.drops.forEach((zone, i) => {
        const defender = findDefender(zone.defender, zone.side);
        if (!defender) return;

        const defenderY = losY + (defender.y * 3);
        const zoneScreenY = losY + (zone.zoneY * 2);

        // Draw zone circle
        const circle = createSVGElement('circle');
        circle.setAttribute('cx', zone.zoneX.toString());
        circle.setAttribute('cy', zoneScreenY.toString());
        circle.setAttribute('r', '6');
        circle.setAttribute('class', 'zone-circle');
        circle.style.animationDelay = `${delayIndex * 0.06}s`;
        playGroup.appendChild(circle);

        // Draw arrow from defender to zone
        const arrow = createArrow(
          defender.x, defenderY,
          zone.zoneX, zoneScreenY + 4,
          'zone-arrow',
          delayIndex * 0.06
        );
        playGroup.appendChild(arrow);

        delayIndex++;
      });
    }

    // Draw man assignments
    if (play.assignments) {
      play.assignments.forEach((assignment, i) => {
        const defender = findDefender(assignment.defender, assignment.side);
        if (!defender) return;

        const defenderY = losY + (defender.y * 3);
        const targetY = losY + (assignment.targetY * 2);

        const arrow = createArrow(
          defender.x, defenderY,
          assignment.targetX, targetY,
          'man-arrow',
          delayIndex * 0.06
        );
        playGroup.appendChild(arrow);

        delayIndex++;
      });
    }

    // Draw safety help
    if (play.safety) {
      const safety = findDefender(play.safety.defender);
      if (safety) {
        const safetyY = losY + (safety.y * 3);
        const zoneY = losY + (play.safety.zoneY * 2);

        const circle = createSVGElement('circle');
        circle.setAttribute('cx', play.safety.zoneX.toString());
        circle.setAttribute('cy', zoneY.toString());
        circle.setAttribute('r', '8');
        circle.setAttribute('class', 'zone-circle safety-help');
        circle.style.animationDelay = `${delayIndex * 0.06}s`;
        playGroup.appendChild(circle);

        const arrow = createArrow(
          safety.x, safetyY,
          play.safety.zoneX, zoneY + 5,
          'zone-arrow',
          delayIndex * 0.06
        );
        playGroup.appendChild(arrow);
      }
    }

    svg.appendChild(playGroup);
  }

  // Set offensive formation on existing field (no defense)
  function setFormation(fieldObj, formationName, options = {}) {
    if (!fieldObj || !fieldObj.svg) return;

    const onClick = typeof options === 'function' ? options : options.onClick;
    const playType = options.play || null;

    // Remove existing players and play art
    const existingPlayers = fieldObj.svg.querySelectorAll('.player-marker');
    existingPlayers.forEach(p => p.remove());
    const existingPlayArt = fieldObj.svg.querySelectorAll('.play-art');
    existingPlayArt.forEach(p => p.remove());

    // Add offensive players with specified formation
    addOffensivePlayers(fieldObj.svg, fieldObj.yardLine, onClick, formationName);

    // Add play art if specified
    if (playType && playType !== 'none') {
      addOffensivePlayArt(fieldObj.svg, formationName, playType, fieldObj.yardLine);
    }

    // Add pop animation to new players
    const newPlayers = fieldObj.svg.querySelectorAll('.player-marker');
    newPlayers.forEach((p, i) => {
      p.classList.add('pop');
      // Stagger animations slightly
      p.style.animationDelay = `${i * 0.02}s`;
    });
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

    // Add pop animation to new players (only if animate option is not false)
    if (options.animate !== false) {
      const newPlayers = fieldObj.svg.querySelectorAll('.player-marker');
      newPlayers.forEach((p, i) => {
        p.classList.add('pop');
        // Stagger animations slightly
        p.style.animationDelay = `${i * 0.02}s`;
      });
    }
  }

  // Public API
  return {
    create,
    setCoverage,
    setFormation,
    setFullFormation,
    parseYardLine,
    formations,
    offensiveFormations,
    offensivePlays,
    defensivePlays,
    coveragePlayArt,
    positionDescriptions
  };
})();

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.Field = Field;
}
