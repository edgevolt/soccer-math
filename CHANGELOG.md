# Changelog

All notable changes to this project will be documented in this file.

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
