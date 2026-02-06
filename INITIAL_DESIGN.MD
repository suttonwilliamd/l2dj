# Initial Design & Development Guide

This document prioritizes structure and constraints over implementation detail.

---

## Architectural Overview

### Frontend
- Single-page web application
- Declarative UI
- State-driven feature availability

### Audio Engine
- Web Audio API
- Two independent playback sources (decks)
- Central mixed output

---

## Spatial Pedagogy (Critical)

The UI layout is part of the teaching system.

Even in its most minimal form, the interface must preserve the spatial relationships found on common DJ controllers:

- Left deck is physically on the left
- Right deck is physically on the right
- Per-deck controls are local to their deck
- Tempo/speed controls are vertical
- Crossfader is horizontal and centered
- Global controls live between decks

Minimalism must preserve these relationships.
Removing controls is allowed; rearranging them is not.

---

## Suggested Tech Stack

### Core
- TypeScript
- React (or equivalent declarative UI framework)

### Audio
- Native Web Audio API
- Optional abstraction layer:
  - Tone.js (only if it does not obscure fundamentals)

### State Management
- Lightweight global state
  - Zustand / Jotai / Redux Toolkit
- Skill tree and unlocked nodes live here

---

## Initial Feature Set (Breadth-Oriented)

### Audio
- Load local audio files
- Play / pause
- Playback rate slider per deck

### Mixing
- Two decks
- Linear crossfader

### Learning System
- Skill tree with dependencies
- Feature-gated controls
- Contextual lesson panels

---

## Skill Tree Representation

Skill tree should be data-driven.

Each node should include:
- id
- name
- short description
- prerequisites
- unlocked vocabulary
- unlocked controls

UI behavior is derived from this data.

---

## Recommended Development Order

1. One-deck playback with correct spatial placement
2. Two-deck playback (left/right)
3. Per-deck speed control
4. Crossfader (centered, horizontal)
5. Static skill tree UI
6. Feature gating via skill unlocks
7. Lesson panels
8. Local persistence (localStorage)

---

## What to Defer

- User accounts
- Progress syncing
- BPM detection
- Audio analysis
- Waveform rendering
- Visual polish
- Mobile optimization

---

## Guiding Principle

If a developer asks:
“Why is this control here, and why is it placed like this?”

The answer must be:
“Because this teaches something about how DJing works in the real world.”
