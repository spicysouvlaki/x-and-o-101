# X's and O's 101 - TODO List

## Target Audience
- Has watched a football game
- Understands scoring, downs, basic rules
- Wants to understand: what might happen on a play? Run vs pass? Where should the QB throw?

---

## 1. Intro Section Overhaul
- [ ] Write a stronger introduction explaining the app's purpose
- [ ] Define expected audience clearly
- [ ] Preview what we'll cover:
  - Predicting run vs. pass
  - Reading defensive formations (zone vs. blitz)
  - Understanding where the QB should look for open receivers
- [ ] Set expectations: this is about understanding the game, not becoming a coach

## 2. Route Tree Simplification
- [ ] Reduce number of routes shown (pick 5-6 essential ones)
- [ ] Add more visual diagrams/pictures
- [ ] Reframe as situational: "IF <situation> THEN <route>"
  - e.g., "If the defense is playing off coverage → Slant or Curl"
  - e.g., "If you need a big play → Post or Corner"
- [ ] Include trade-offs for each route (risk vs. reward)

## 3. Technical Jargon System
- [ ] Create a glossary/tooltip system for football terms
- [ ] Style: dotted underline on hover/tap reveals definition
- [ ] Key terms to define:
  - Snap
  - Look (as in "single-high look")
  - Formation
  - Coverage
  - Blitz
  - Zone vs. Man
  - Check down
  - Hot route
- [ ] Implement as reusable component across all sections

## 4. Trade-offs Audit (Full App)
- [ ] Review all sections for "absolute" statements
- [ ] Reframe everything as trade-offs:
  - ❌ "Shotgun is for passing"
  - ✅ "Shotgun gives the QB more time but tips off pass-heavy intent"
- [ ] Sections to audit:
  - [ ] Formations
  - [ ] Routes
  - [ ] Defense/Coverage
  - [ ] Puzzle explanations

## 5. Formations Section Enhancement
- [ ] Add explicit trade-offs for each formation:
  - Shotgun: more time vs. telegraphs pass
  - I-Formation: power running vs. predictable
  - Empty: max receivers vs. no protection
- [ ] Consider adding EPA data:
  - Pass EPA from shotgun vs. under center
  - Run EPA from different formations
- [ ] Visual comparison of tendencies with context

## 6. New Section: Run vs. Pass Basics
- [ ] Add after formations, before routes
- [ ] Cover:
  - When do teams run? (short yardage, clock management, lead)
  - When do teams pass? (behind, long yardage, 2-minute drill)
  - How to read pre-snap clues
- [ ] Include EPA comparison for run vs. pass situations

## 7. New Section: Situational Football
- [ ] Add before or integrated with puzzle section
- [ ] Key situations to cover:
  - 3rd and long (passing downs)
  - 3rd and short (anything goes)
  - 2nd and short (run-heavy)
  - Red zone (condensed field)
  - 2-minute drill (sideline routes, clock)
  - Goal line (power vs. play action)
- [ ] Frame as "what to expect" not "what to call"

## 8. Puzzle Section Improvements
- [ ] Add warm-up puzzles (easier situations first)
- [ ] Progressive difficulty:
  1. Obvious situations (3rd & 15 = pass)
  2. Moderate (2nd & 5 from midfield)
  3. Harder (situational context matters)
- [ ] On hover/tap of answer option → show play art preview
- [ ] Better feedback explaining WHY the answer is correct
- [ ] Consider removing ELO rating (too gamified for learning?)

---

## 9. Social/Sharing Previews
- [ ] Add Open Graph meta tags for link previews
  - og:title, og:description, og:image, og:url
- [ ] Add Twitter Card meta tags
- [ ] Create preview image (1200x630 recommended)
- [ ] Test with:
  - iMessage
  - Twitter/X
  - Facebook
  - Slack
  - Discord

---

## Technical Debt
- [ ] Route diagram SVGs need to be more exaggerated/clear
- [ ] Click handlers on field positions not working
- [ ] Consider renaming section files to match new numbering

---

## Content Credits
- Route concepts: [Shakin' The Southland](https://www.shakinthesouthland.com/2010/4/7/1399529/defensive-back-techniques-iii-pass)
- EPA data: (TBD - nflfastR or similar)
