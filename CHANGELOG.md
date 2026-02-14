# Changelog

All notable changes to this project will be documented in this file.

## [1.2.1] - 2026-02-13

### Changed
- **World Cup Pacing**: Reduced penalty shootout timer to 6 seconds and added a "Next Kick" acknowledgement step to prevent rapid-fire confusion.
- **World Cup Difficulty**: Implemented static difficulty tiers for tournament stages (Group: L1, Ro16/QF: L2, Semi/Final: L3).
- **World Cup Logic**: Fixed an issue where the user's global starting level setting would override the tournament round difficulty, causing immediate level jumps.

## [1.2.0] - 2026-02-13

### Added
- **Equivalent Fractions Mode**: New operation type alongside Multiply and Divide. Players identify equivalent fractions in both Practice (multiple-choice with stacked fraction buttons) and Tournament (type the missing numerator) modes.
- **Fraction Difficulty Levels**: Three progressive levels — simple fractions (halves, thirds, fourths), medium (fifths, sixths, eighths), and advanced (sevenths, ninths, twelfths).
- **Stacked Fraction Display**: Fractions render as proper stacked notation (numerator over denominator with a fraction bar).
- **Music Playlist**: Background music now cycles through 3 tracks instead of looping a single song, starting at a random track each session.

### Changed
- **Wrong Answer Delay**: Increased the pause after an incorrect answer from 2 seconds to 3.5 seconds so students have more time to review the correct answer.
- **Music Credits**: Updated credits to reference Unminus as the music source.

### Fixed
- **Duplicate Character Cards**: Removed characters that appeared in multiple rarity tiers. Each player now exists in exactly one rarity level.

## [1.1.2] - 2026-02-11

### Added
- **Practice Mode Rewards**: Players now earn a card reward every 15 correct answers in a streak during Practice Mode.

### Fixed
- **Landscape Layout**: Fixed numbers and UI elements being cut off on landscape-format screens (Chromebooks, iPads in landscape). The game now constrains to the viewport height and compresses elements to fit.
- **Number Pad in Practice Mode**: Fixed the number pad incorrectly appearing in Practice Mode (multiple-choice) after playing a Tournament Mode session.

## [1.1.0] - 2026-02-07

### Added
- **Background Music**: Added a looping background track ("Latin by Coldise") with a global toggle button.
- **Streak Bonus Wheel**: Players can now spin a bonus wheel for rare cards after achieving specific streak milestones (Tournament Mode, Level 3).
- **About Section**: Added an "About" section in the settings modal displaying version, license, and credits.
- **Music Persistence**: The game now remembers your music preference (on/off) between sessions.

### Fixed
- **Remainder Logic**: Removed the unused/incomplete "Remainder" operation mode to streamline the experience.
- **Reinforcement Logic**: Fixed a bug where multiplication reinforcement questions were incorrectly using division logic.
- **Music Icon Sync**: Fixed an issue where the music icon would show as "playing" on page load even when autoplay was blocked; it now defaults to off.
