\# Design Constraints \& Scope Control



This document exists to prevent feature creep and protect the learning goals of the platform.



If a proposed change violates these constraints, it should be rejected or deferred.



---



\## Hard Constraints



\### 1. Learning Tool, Not Performance Tool

The platform must NOT attempt to:

\- replace professional DJ software

\- support live performance

\- achieve feature parity with existing tools



---



\### 2. Implicit Real-World Mapping

The UI must teach hardware familiarity implicitly.



This means:

\- controls are placed where they are commonly found on real DJ controllers

\- relative spatial relationships must be preserved

\- layout decisions are pedagogical, not aesthetic



No explicit “here’s where this is on real gear” explanations should be required.



---



\### 3. Layout Invariance

Even as features are added or removed:

\- decks remain left/right

\- per-deck controls remain adjacent to their deck

\- global controls remain centered

\- horizontal vs vertical control orientation must be meaningful



Controls may be hidden, but their spatial logic must not be rearranged arbitrarily.



---



\### 4. Minimal DSP

Allowed early DSP:

\- gain (volume)

\- playback rate (speed)



Deferred DSP:

\- EQ

\- filters

\- effects

\- key lock

\- time stretching

\- waveform analysis



---



\### 5. Progressive Disclosure Only

\- No “expert mode”

\- No settings dumps

\- No full-control views



Users unlock capability intentionally.



---



\### 6. Breadth Over Depth

The MVP should:

\- introduce many concepts lightly

\- avoid deep mastery of any single concept



Depth is a future concern.



---



\## Anti-Goals



This project should NOT:

\- become a DAW

\- teach music production

\- act as a gear comparison tool

\- require brand-specific knowledge

\- overwhelm users with configuration



---



\## Feature Admission Test



A feature may only be added if:

1\. It teaches a new conceptual distinction

2\. It cannot be learned through listening alone

3\. It preserves or reinforces real-world spatial intuition



Convenience-only features are out of scope.



---



\## MVP Exit Criteria



The MVP is complete when:

\- two tracks can be mixed using:

&nbsp; - play / pause

&nbsp; - per-deck speed control

&nbsp; - crossfader

\- all visible controls are spatially consistent with real DJ hardware

\- users understand the vocabulary they are interacting with



