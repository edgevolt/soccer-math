/**
 * Soccer Math - Game Logic
 * A math game for 4th graders supporting multiplication and division
 */

// ========================================
// GAME CONFIGURATION
// ========================================

const CONFIG = {
    gameDuration: 600, // seconds (10 minutes)
    streakBonusThreshold: 3, // correct answers in a row for bonus

    // Adaptive learning settings
    reinforcementProbability: 0.5,  // 50% chance to show missed question
    reinforcementRequired: 2,       // correct answers needed to remove from pool

    // Difficulty levels with multiplication tables
    levels: {
        1: { name: 'Level 1', tables: [1, 2, 5, 10], minCorrect: 0 },
        2: { name: 'Level 2', tables: [3, 4, 6], minCorrect: 5 },
        3: { name: 'Level 3', tables: [7, 8, 9, 11, 12], minCorrect: 12 }
    },

    // Fraction levels for equivalent fractions mode
    fractionLevels: {
        1: { name: 'Level 1', baseFractions: [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]], multiplierRange: [2, 4], minCorrect: 0 },
        2: { name: 'Level 2', baseFractions: [[1, 5], [2, 5], [3, 5], [1, 6], [5, 6], [1, 8], [3, 8]], multiplierRange: [2, 6], minCorrect: 5 },
        3: { name: 'Level 3', baseFractions: [[1, 7], [2, 7], [1, 9], [2, 9], [1, 10], [3, 10], [1, 12], [5, 12]], multiplierRange: [2, 8], minCorrect: 12 }
    },

    // Character cards for lucky block rewards
    characterCards: {
        common: [
            { name: 'Rashford', fullName: 'Marcus Rashford', team: 'Manchester United', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rarity: 1, stats: { PAC: 90, SHO: 86, PAS: 78, DRI: 84, DEF: 45, PHY: 74 } },
            { name: 'Mainoo', fullName: 'Kobbie Mainoo', team: 'Manchester United', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rarity: 1, stats: { PAC: 78, SHO: 72, PAS: 84, DRI: 86, DEF: 74, PHY: 72 } },
            { name: 'Garnacho', fullName: 'Alejandro Garnacho', team: 'Manchester United', emoji: '🇦🇷', rarity: 1, stats: { PAC: 92, SHO: 78, PAS: 76, DRI: 85, DEF: 40, PHY: 60 } },
            { name: 'Hojlund', fullName: 'Rasmus Højlund', team: 'Manchester United', emoji: '🇩🇰', rarity: 1, stats: { PAC: 88, SHO: 81, PAS: 65, DRI: 76, DEF: 38, PHY: 85 } },
            { name: 'Onana', fullName: 'André Onana', team: 'Manchester United', emoji: '🇨🇲', rarity: 1, stats: { PAC: 60, SHO: 50, PAS: 85, DRI: 70, DEF: 50, PHY: 80 } },
            { name: 'Maguire', fullName: 'Harry Maguire', team: 'Manchester United', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rarity: 1, stats: { PAC: 50, SHO: 54, PAS: 65, DRI: 68, DEF: 82, PHY: 85 } },
            { name: 'Grealish', fullName: 'Jack Grealish', team: 'Manchester City', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rarity: 1, stats: { PAC: 84, SHO: 76, PAS: 83, DRI: 88, DEF: 46, PHY: 69 } },
            { name: 'Alvarez', fullName: 'Julián Álvarez', team: 'Manchester City', emoji: '🇦🇷', rarity: 1, stats: { PAC: 86, SHO: 83, PAS: 79, DRI: 84, DEF: 55, PHY: 78 } },
            { name: 'Gvardiol', fullName: 'Joško Gvardiol', team: 'Manchester City', emoji: '🇭🇷', rarity: 1, stats: { PAC: 82, SHO: 60, PAS: 78, DRI: 76, DEF: 84, PHY: 82 } },
            { name: 'Doku', fullName: 'Jérémy Doku', team: 'Manchester City', emoji: '🇧🇪', rarity: 1, stats: { PAC: 96, SHO: 74, PAS: 76, DRI: 92, DEF: 35, PHY: 66 } },
            { name: 'Martinelli', fullName: 'Gabriel Martinelli', team: 'Arsenal', emoji: '🇧🇷', rarity: 1, stats: { PAC: 91, SHO: 82, PAS: 78, DRI: 86, DEF: 50, PHY: 74 } },
            { name: 'Jesus', fullName: 'Gabriel Jesus', team: 'Arsenal', emoji: '🇧🇷', rarity: 1, stats: { PAC: 86, SHO: 82, PAS: 79, DRI: 88, DEF: 45, PHY: 76 } },
            { name: 'Havertz', fullName: 'Kai Havertz', team: 'Arsenal', emoji: '🇩🇪', rarity: 1, stats: { PAC: 82, SHO: 78, PAS: 79, DRI: 84, DEF: 55, PHY: 74 } },
            { name: 'White', fullName: 'Ben White', team: 'Arsenal', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rarity: 1, stats: { PAC: 78, SHO: 55, PAS: 76, DRI: 74, DEF: 82, PHY: 78 } },
            { name: 'Nunez', fullName: 'Darwin Núñez', team: 'Liverpool', emoji: '🇺🇾', rarity: 1, stats: { PAC: 90, SHO: 81, PAS: 71, DRI: 78, DEF: 45, PHY: 88 } },
            { name: 'Diaz', fullName: 'Luis Díaz', team: 'Liverpool', emoji: '🇨🇴', rarity: 1, stats: { PAC: 91, SHO: 80, PAS: 75, DRI: 87, DEF: 40, PHY: 70 } },
            { name: 'Jota', fullName: 'Diogo Jota', team: 'Liverpool', emoji: '🇵🇹', rarity: 1, stats: { PAC: 85, SHO: 84, PAS: 76, DRI: 85, DEF: 50, PHY: 72 } },
            { name: 'Mac Allister', fullName: 'Alexis Mac Allister', team: 'Liverpool', emoji: '🇦🇷', rarity: 1, stats: { PAC: 78, SHO: 82, PAS: 86, DRI: 85, DEF: 75, PHY: 78 } },
            { name: 'Szoboszlai', fullName: 'Dominik Szoboszlai', team: 'Liverpool', emoji: '🇭🇺', rarity: 1, stats: { PAC: 85, SHO: 84, PAS: 88, DRI: 82, DEF: 65, PHY: 78 } },
            { name: 'Trent', fullName: 'Trent Alexander-Arnold', team: 'Liverpool', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rarity: 1, stats: { PAC: 76, SHO: 78, PAS: 92, DRI: 80, DEF: 72, PHY: 70 } },
            { name: 'Robertson', fullName: 'Andrew Robertson', team: 'Liverpool', emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', rarity: 1, stats: { PAC: 82, SHO: 62, PAS: 81, DRI: 78, DEF: 81, PHY: 76 } },
            { name: 'Enzo', fullName: 'Enzo Fernández', team: 'Chelsea', emoji: '🇦🇷', rarity: 1, stats: { PAC: 74, SHO: 76, PAS: 88, DRI: 82, DEF: 78, PHY: 76 } },
            { name: 'Palmer', fullName: 'Cole Palmer', team: 'Chelsea', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rarity: 1, stats: { PAC: 82, SHO: 83, PAS: 85, DRI: 86, DEF: 50, PHY: 68 } },
            { name: 'Caicedo', fullName: 'Moisés Caicedo', team: 'Chelsea', emoji: '🇪🇨', rarity: 1, stats: { PAC: 78, SHO: 68, PAS: 80, DRI: 80, DEF: 82, PHY: 84 } },
            { name: 'Richarlison', fullName: 'Richarlison', team: 'Tottenham', emoji: '🇧🇷', rarity: 1, stats: { PAC: 85, SHO: 79, PAS: 72, DRI: 82, DEF: 50, PHY: 76 } },
            { name: 'Maddison', fullName: 'James Maddison', team: 'Tottenham', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rarity: 1, stats: { PAC: 76, SHO: 82, PAS: 88, DRI: 85, DEF: 55, PHY: 68 } },
            { name: 'Van de Ven', fullName: 'Micky van de Ven', team: 'Tottenham', emoji: '🇳🇱', rarity: 1, stats: { PAC: 92, SHO: 45, PAS: 72, DRI: 74, DEF: 82, PHY: 84 } },
            { name: 'Guimaraes', fullName: 'Bruno Guimarães', team: 'Newcastle', emoji: '🇧🇷', rarity: 1, stats: { PAC: 75, SHO: 76, PAS: 85, DRI: 84, DEF: 80, PHY: 82 } },
            { name: 'Isak', fullName: 'Alexander Isak', team: 'Newcastle', emoji: '🇸🇪', rarity: 1, stats: { PAC: 88, SHO: 84, PAS: 72, DRI: 85, DEF: 35, PHY: 76 } },
            { name: 'Mitoma', fullName: 'Kaoru Mitoma', team: 'Brighton', emoji: '🇯🇵', rarity: 1, stats: { PAC: 88, SHO: 74, PAS: 78, DRI: 89, DEF: 55, PHY: 60 } },
            { name: 'Pulisic', fullName: 'Christian Pulisic', team: 'AC Milan', emoji: '🇺🇸', rarity: 1, stats: { PAC: 89, SHO: 75, PAS: 78, DRI: 86, DEF: 45, PHY: 65 } },
            { name: 'Davies', fullName: 'Alphonso Davies', team: 'Bayern Munich', emoji: '🇨🇦', rarity: 1, stats: { PAC: 96, SHO: 68, PAS: 76, DRI: 84, DEF: 74, PHY: 76 } },
            { name: 'Yamal', fullName: 'Lamine Yamal', team: 'FC Barcelona', emoji: '🇪🇸', rarity: 1, stats: { PAC: 88, SHO: 74, PAS: 80, DRI: 89, DEF: 35, PHY: 55 } },
            { name: 'Raphinha', fullName: 'Raphinha', team: 'FC Barcelona', emoji: '🇧🇷', rarity: 1, stats: { PAC: 90, SHO: 80, PAS: 80, DRI: 86, DEF: 50, PHY: 72 } },
            { name: 'Kounde', fullName: 'Jules Koundé', team: 'FC Barcelona', emoji: '🇫🇷', rarity: 1, stats: { PAC: 84, SHO: 50, PAS: 75, DRI: 76, DEF: 86, PHY: 78 } },
            { name: 'Camavinga', fullName: 'Eduardo Camavinga', team: 'Real Madrid', emoji: '🇫🇷', rarity: 1, stats: { PAC: 82, SHO: 70, PAS: 84, DRI: 85, DEF: 82, PHY: 80 } },
            { name: 'Tchouameni', fullName: 'Aurélien Tchouaméni', team: 'Real Madrid', emoji: '🇫🇷', rarity: 1, stats: { PAC: 76, SHO: 72, PAS: 80, DRI: 80, DEF: 85, PHY: 84 } },
            { name: 'Endrick', fullName: 'Endrick Felipe', team: 'Real Madrid', emoji: '🇧🇷', rarity: 1, stats: { PAC: 88, SHO: 82, PAS: 68, DRI: 84, DEF: 40, PHY: 74 } },
            { name: 'Sane', fullName: 'Leroy Sané', team: 'Bayern Munich', emoji: '🇩🇪', rarity: 1, stats: { PAC: 92, SHO: 80, PAS: 79, DRI: 88, DEF: 42, PHY: 68 } },
            { name: 'Coman', fullName: 'Kingsley Coman', team: 'Bayern Munich', emoji: '🇫🇷', rarity: 1, stats: { PAC: 90, SHO: 76, PAS: 78, DRI: 88, DEF: 35, PHY: 65 } }
        ],
        rare: [
            { name: 'Mbappe', fullName: 'Kylian Mbappé', team: 'Real Madrid', emoji: '🇫🇷', rarity: 2, stats: { PAC: 97, SHO: 90, PAS: 82, DRI: 93, DEF: 36, PHY: 78 } },
            { name: 'Haaland', fullName: 'Erling Haaland', team: 'Manchester City', emoji: '🇳🇴', rarity: 2, stats: { PAC: 89, SHO: 93, PAS: 65, DRI: 80, DEF: 45, PHY: 88 } },
            { name: 'De Bruyne', fullName: 'Kevin De Bruyne', team: 'Manchester City', emoji: '🇧🇪', rarity: 2, stats: { PAC: 74, SHO: 86, PAS: 94, DRI: 87, DEF: 65, PHY: 78 } },
            { name: 'Kane', fullName: 'Harry Kane', team: 'Bayern Munich', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rarity: 2, stats: { PAC: 69, SHO: 93, PAS: 85, DRI: 82, DEF: 49, PHY: 83 } },
            { name: 'Salah', fullName: 'Mohamed Salah', team: 'Liverpool', emoji: '🇪🇬', rarity: 2, stats: { PAC: 89, SHO: 87, PAS: 81, DRI: 88, DEF: 45, PHY: 76 } },
            { name: 'Vinicius Jr', fullName: 'Vinícius Júnior', team: 'Real Madrid', emoji: '🇧🇷', rarity: 2, stats: { PAC: 95, SHO: 84, PAS: 81, DRI: 92, DEF: 30, PHY: 68 } },
            { name: 'Rodri', fullName: 'Rodri', team: 'Manchester City', emoji: '🇪🇸', rarity: 2, stats: { PAC: 68, SHO: 76, PAS: 88, DRI: 82, DEF: 87, PHY: 85 } },
            { name: 'Modric', fullName: 'Luka Modrić', team: 'Real Madrid', emoji: '🇭🇷', rarity: 2, stats: { PAC: 72, SHO: 76, PAS: 91, DRI: 88, DEF: 70, PHY: 65 } },
            { name: 'Van Dijk', fullName: 'Virgil van Dijk', team: 'Liverpool', emoji: '🇳🇱', rarity: 2, stats: { PAC: 78, SHO: 60, PAS: 71, DRI: 72, DEF: 89, PHY: 86 } },
            { name: 'Alisson', fullName: 'Alisson Becker', team: 'Liverpool', emoji: '🇧🇷', rarity: 2, stats: { PAC: 60, SHO: 50, PAS: 88, DRI: 75, DEF: 50, PHY: 85 } },
            { name: 'Courtois', fullName: 'Thibaut Courtois', team: 'Real Madrid', emoji: '🇧🇪', rarity: 2, stats: { PAC: 60, SHO: 45, PAS: 75, DRI: 68, DEF: 55, PHY: 82 } },
            { name: 'Ter Stegen', fullName: 'Marc-André ter Stegen', team: 'FC Barcelona', emoji: '🇩🇪', rarity: 2, stats: { PAC: 58, SHO: 48, PAS: 86, DRI: 74, DEF: 45, PHY: 78 } },
            { name: 'Neuer', fullName: 'Manuel Neuer', team: 'Bayern Munich', emoji: '🇩🇪', rarity: 2, stats: { PAC: 65, SHO: 55, PAS: 89, DRI: 78, DEF: 52, PHY: 84 } },
            { name: 'Ederson', fullName: 'Ederson', team: 'Manchester City', emoji: '🇧🇷', rarity: 2, stats: { PAC: 64, SHO: 50, PAS: 91, DRI: 76, DEF: 50, PHY: 80 } },
            { name: 'Dias', fullName: 'Rúben Dias', team: 'Manchester City', emoji: '🇵🇹', rarity: 2, stats: { PAC: 68, SHO: 45, PAS: 72, DRI: 70, DEF: 89, PHY: 87 } },
            { name: 'Saliba', fullName: 'William Saliba', team: 'Arsenal', emoji: '🇫🇷', rarity: 2, stats: { PAC: 82, SHO: 48, PAS: 74, DRI: 76, DEF: 87, PHY: 82 } },
            { name: 'Rudiger', fullName: 'Antonio Rüdiger', team: 'Real Madrid', emoji: '🇩🇪', rarity: 2, stats: { PAC: 88, SHO: 58, PAS: 72, DRI: 70, DEF: 86, PHY: 88 } },
            { name: 'Kimmich', fullName: 'Joshua Kimmich', team: 'Bayern Munich', emoji: '🇩🇪', rarity: 2, stats: { PAC: 70, SHO: 74, PAS: 88, DRI: 84, DEF: 82, PHY: 75 } },
            { name: 'Rice', fullName: 'Declan Rice', team: 'Arsenal', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rarity: 2, stats: { PAC: 76, SHO: 74, PAS: 84, DRI: 81, DEF: 86, PHY: 84 } },
            { name: 'Odegaard', fullName: 'Martin Ødegaard', team: 'Arsenal', emoji: '🇳🇴', rarity: 2, stats: { PAC: 78, SHO: 78, PAS: 90, DRI: 88, DEF: 62, PHY: 68 } },
            { name: 'Saka', fullName: 'Bukayo Saka', team: 'Arsenal', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rarity: 2, stats: { PAC: 88, SHO: 83, PAS: 82, DRI: 87, DEF: 60, PHY: 70 } },
            { name: 'Foden', fullName: 'Phil Foden', team: 'Manchester City', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rarity: 2, stats: { PAC: 85, SHO: 81, PAS: 85, DRI: 89, DEF: 55, PHY: 60 } },
            { name: 'Bernardo', fullName: 'Bernardo Silva', team: 'Manchester City', emoji: '🇵🇹', rarity: 2, stats: { PAC: 78, SHO: 78, PAS: 88, DRI: 92, DEF: 65, PHY: 70 } },
            { name: 'Bruno', fullName: 'Bruno Fernandes', team: 'Manchester United', emoji: '🇵🇹', rarity: 2, stats: { PAC: 75, SHO: 86, PAS: 89, DRI: 84, DEF: 68, PHY: 74 } },
            { name: 'Son', fullName: 'Heung-min Son', team: 'Tottenham', emoji: '🇰🇷', rarity: 2, stats: { PAC: 87, SHO: 88, PAS: 82, DRI: 86, DEF: 42, PHY: 68 } },
            { name: 'Lewandowski', fullName: 'Robert Lewandowski', team: 'FC Barcelona', emoji: '🇵🇱', rarity: 2, stats: { PAC: 75, SHO: 91, PAS: 79, DRI: 86, DEF: 44, PHY: 82 } },
            { name: 'Griezmann', fullName: 'Antoine Griezmann', team: 'Atletico Madrid', emoji: '🇫🇷', rarity: 2, stats: { PAC: 80, SHO: 88, PAS: 89, DRI: 87, DEF: 72, PHY: 72 } },
            { name: 'Lautaro', fullName: 'Lautaro Martínez', team: 'Inter Milan', emoji: '🇦🇷', rarity: 2, stats: { PAC: 84, SHO: 86, PAS: 75, DRI: 85, DEF: 48, PHY: 82 } },
            { name: 'Osimhen', fullName: 'Victor Osimhen', team: 'Napoli', emoji: '🇳🇬', rarity: 2, stats: { PAC: 92, SHO: 86, PAS: 68, DRI: 80, DEF: 45, PHY: 85 } },
            { name: 'Kvara', fullName: 'Khvicha Kvaratskhelia', team: 'Napoli', emoji: '🇬🇪', rarity: 2, stats: { PAC: 88, SHO: 80, PAS: 82, DRI: 89, DEF: 45, PHY: 72 } },
            { name: 'Dybala', fullName: 'Paulo Dybala', team: 'AS Roma', emoji: '🇦🇷', rarity: 2, stats: { PAC: 80, SHO: 85, PAS: 86, DRI: 90, DEF: 40, PHY: 60 } },
            { name: 'De Jong', fullName: 'Frenkie de Jong', team: 'FC Barcelona', emoji: '🇳🇱', rarity: 2, stats: { PAC: 82, SHO: 72, PAS: 88, DRI: 89, DEF: 76, PHY: 78 } },
            { name: 'Pedri', fullName: 'Pedri González', team: 'FC Barcelona', emoji: '🇪🇸', rarity: 2, stats: { PAC: 79, SHO: 70, PAS: 86, DRI: 88, DEF: 65, PHY: 60 } },
            { name: 'Gavi', fullName: 'Gavi', team: 'FC Barcelona', emoji: '🇪🇸', rarity: 2, stats: { PAC: 78, SHO: 68, PAS: 84, DRI: 86, DEF: 75, PHY: 76 } },
            { name: 'Musiala', fullName: 'Jamal Musiala', team: 'Bayern Munich', emoji: '🇩🇪', rarity: 2, stats: { PAC: 87, SHO: 78, PAS: 84, DRI: 93, DEF: 58, PHY: 64 } },
            { name: 'Wirtz', fullName: 'Florian Wirtz', team: 'Bayer Leverkusen', emoji: '🇩🇪', rarity: 2, stats: { PAC: 84, SHO: 80, PAS: 88, DRI: 90, DEF: 60, PHY: 68 } },
            { name: 'Leao', fullName: 'Rafael Leão', team: 'AC Milan', emoji: '🇵🇹', rarity: 2, stats: { PAC: 93, SHO: 78, PAS: 75, DRI: 86, DEF: 35, PHY: 78 } },
            { name: 'Valverde', fullName: 'Federico Valverde', team: 'Real Madrid', emoji: '🇺🇾', rarity: 2, stats: { PAC: 88, SHO: 82, PAS: 84, DRI: 82, DEF: 80, PHY: 85 } },
            { name: 'Bonmati', fullName: 'Aitana Bonmatí', team: 'FC Barcelona', emoji: '🇪🇸', rarity: 2, stats: { PAC: 81, SHO: 84, PAS: 91, DRI: 91, DEF: 75, PHY: 68 } },
            { name: 'Putellas', fullName: 'Alexia Putellas', team: 'FC Barcelona', emoji: '🇪🇸', rarity: 2, stats: { PAC: 82, SHO: 90, PAS: 91, DRI: 92, DEF: 72, PHY: 70 } },
            { name: 'Kerr', fullName: 'Sam Kerr', team: 'Chelsea', emoji: '🇦🇺', rarity: 2, stats: { PAC: 88, SHO: 90, PAS: 78, DRI: 86, DEF: 45, PHY: 82 } },
            { name: 'Morgan', fullName: 'Alex Morgan', team: 'San Diego Wave', emoji: '🇺🇸', rarity: 2, stats: { PAC: 83, SHO: 87, PAS: 76, DRI: 82, DEF: 40, PHY: 72 } }
        ],
        legendary: [
            { name: 'Garrincha', fullName: 'Garrincha', team: 'Botafogo', emoji: '🇧🇷', rarity: 3, stats: { PAC: 94, SHO: 85, PAS: 88, DRI: 98, DEF: 35, PHY: 68 } },
            { name: 'Zico', fullName: 'Zico', team: 'Flamengo', emoji: '🇧🇷', rarity: 3, stats: { PAC: 85, SHO: 91, PAS: 95, DRI: 92, DEF: 55, PHY: 70 } },
            { name: 'Iniesta', fullName: 'Andrés Iniesta', team: 'FC Barcelona', emoji: '🇪🇸', rarity: 3, stats: { PAC: 78, SHO: 76, PAS: 96, DRI: 96, DEF: 65, PHY: 60 } },
            { name: 'Xavi', fullName: 'Xavi Hernández', team: 'FC Barcelona', emoji: '🇪🇸', rarity: 3, stats: { PAC: 76, SHO: 74, PAS: 97, DRI: 93, DEF: 70, PHY: 65 } },
            { name: 'Cafu', fullName: 'Cafu', team: 'AC Milan', emoji: '🇧🇷', rarity: 3, stats: { PAC: 90, SHO: 70, PAS: 82, DRI: 86, DEF: 88, PHY: 85 } },
            { name: 'Roberto Carlos', fullName: 'Roberto Carlos', team: 'Real Madrid', emoji: '🇧🇷', rarity: 3, stats: { PAC: 92, SHO: 86, PAS: 80, DRI: 82, DEF: 85, PHY: 86 } },
            { name: 'Gullit', fullName: 'Ruud Gullit', team: 'AC Milan', emoji: '🇳🇱', rarity: 3, stats: { PAC: 88, SHO: 88, PAS: 88, DRI: 88, DEF: 82, PHY: 90 } },
            { name: 'Kaka', fullName: 'Kaká', team: 'AC Milan', emoji: '🇧🇷', rarity: 3, stats: { PAC: 92, SHO: 86, PAS: 88, DRI: 90, DEF: 50, PHY: 78 } },
            { name: 'Beckham', fullName: 'David Beckham', team: 'Manchester United', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rarity: 3, stats: { PAC: 78, SHO: 84, PAS: 95, DRI: 82, DEF: 65, PHY: 75 } },
            { name: 'Gerrard', fullName: 'Steven Gerrard', team: 'Liverpool', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rarity: 3, stats: { PAC: 80, SHO: 88, PAS: 88, DRI: 78, DEF: 82, PHY: 85 } },
            { name: 'Lampard', fullName: 'Frank Lampard', team: 'Chelsea', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rarity: 3, stats: { PAC: 76, SHO: 89, PAS: 86, DRI: 80, DEF: 72, PHY: 80 } },
            { name: 'Rooney', fullName: 'Wayne Rooney', team: 'Manchester United', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rarity: 3, stats: { PAC: 86, SHO: 88, PAS: 82, DRI: 84, DEF: 60, PHY: 88 } },
            { name: 'Mia Hamm', fullName: 'Mia Hamm', team: 'USA', emoji: '🇺🇸', rarity: 3, stats: { PAC: 90, SHO: 92, PAS: 85, DRI: 88, DEF: 45, PHY: 74 } },
            { name: 'Marta', fullName: 'Marta', team: 'Orlando Pride', emoji: '🇧🇷', rarity: 3, stats: { PAC: 87, SHO: 88, PAS: 86, DRI: 92, DEF: 45, PHY: 70 } }
        ],
        mythical: [
            { name: 'Zidane', fullName: 'Zinedine Zidane', team: 'Real Madrid', emoji: '🇫🇷', rarity: 4, stats: { PAC: 82, SHO: 89, PAS: 96, DRI: 95, DEF: 70, PHY: 81 } },
            { name: 'Cruyff', fullName: 'Johan Cruyff', team: 'Ajax', emoji: '🇳🇱', rarity: 4, stats: { PAC: 91, SHO: 92, PAS: 93, DRI: 98, DEF: 42, PHY: 70 } },
            { name: 'R9', fullName: 'Ronaldo Nazário', team: 'Inter Milan', emoji: '🇧🇷', rarity: 4, stats: { PAC: 97, SHO: 95, PAS: 81, DRI: 95, DEF: 35, PHY: 76 } },
            { name: 'Ronaldinho', fullName: 'Ronaldinho', team: 'FC Barcelona', emoji: '🇧🇷', rarity: 4, stats: { PAC: 91, SHO: 90, PAS: 90, DRI: 98, DEF: 35, PHY: 78 } },
            { name: 'Maldini', fullName: 'Paolo Maldini', team: 'AC Milan', emoji: '🇮🇹', rarity: 4, stats: { PAC: 86, SHO: 55, PAS: 75, DRI: 70, DEF: 96, PHY: 85 } },
            { name: 'Beckenbauer', fullName: 'Franz Beckenbauer', team: 'Bayern Munich', emoji: '🇩🇪', rarity: 4, stats: { PAC: 82, SHO: 70, PAS: 90, DRI: 88, DEF: 94, PHY: 80 } },
            { name: 'Yashin', fullName: 'Lev Yashin', team: 'Dynamo Moscow', emoji: '🇷🇺', rarity: 4, stats: { PAC: 65, SHO: 40, PAS: 75, DRI: 70, DEF: 95, PHY: 88 } },
            { name: 'Platini', fullName: 'Michel Platini', team: 'Juventus', emoji: '🇫🇷', rarity: 4, stats: { PAC: 84, SHO: 90, PAS: 94, DRI: 92, DEF: 55, PHY: 72 } },
            { name: 'Best', fullName: 'George Best', team: 'Manchester United', emoji: '🇬🇧', rarity: 4, stats: { PAC: 93, SHO: 91, PAS: 86, DRI: 95, DEF: 45, PHY: 70 } },
            { name: 'Van Basten', fullName: 'Marco van Basten', team: 'AC Milan', emoji: '🇳🇱', rarity: 4, stats: { PAC: 86, SHO: 94, PAS: 78, DRI: 88, DEF: 40, PHY: 80 } },
            { name: 'Puskas', fullName: 'Ferenc Puskás', team: 'Real Madrid', emoji: '🇭🇺', rarity: 4, stats: { PAC: 85, SHO: 96, PAS: 90, DRI: 91, DEF: 40, PHY: 75 } },
            { name: 'Henry', fullName: 'Thierry Henry', team: 'Arsenal', emoji: '🇫🇷', rarity: 4, stats: { PAC: 94, SHO: 93, PAS: 83, DRI: 90, DEF: 53, PHY: 80 } }
        ],
        godly: [
            { name: 'Pele', fullName: 'Pelé', team: 'Santos FC', emoji: '🇧🇷', rarity: 5, stats: { PAC: 95, SHO: 96, PAS: 93, DRI: 96, DEF: 50, PHY: 76 } },
            { name: 'Maradona', fullName: 'Diego Maradona', team: 'Napoli', emoji: '🇦🇷', rarity: 5, stats: { PAC: 90, SHO: 94, PAS: 95, DRI: 98, DEF: 40, PHY: 75 } },
            { name: 'Messi', fullName: 'Lionel Messi', team: 'Inter Miami', emoji: '🇦🇷', rarity: 5, stats: { PAC: 80, SHO: 88, PAS: 92, DRI: 96, DEF: 34, PHY: 60 } },
            { name: 'Ronaldo', fullName: 'Cristiano Ronaldo', team: 'Al Nassr', emoji: '🇵🇹', rarity: 5, stats: { PAC: 83, SHO: 92, PAS: 78, DRI: 85, DEF: 34, PHY: 75 } }
        ]
    },

    // Encouraging messages
    goalMessages: ['GOAL! ⚽', 'AMAZING! 🌟', 'BRILLIANT! ✨', 'SUPERSTAR! 🤩', 'HAT TRICK! 🎩'],
    missMessages: ['Try again!', 'So close!', 'Keep going!', 'You got this!'],

    // World Cup mode
    worldCup: {
        countries: [
            { name: 'Brazil', emoji: '🇧🇷' },
            { name: 'Argentina', emoji: '🇦🇷' },
            { name: 'France', emoji: '🇫🇷' },
            { name: 'Germany', emoji: '🇩🇪' },
            { name: 'England', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
            { name: 'Spain', emoji: '🇪🇸' },
            { name: 'Portugal', emoji: '🇵🇹' },
            { name: 'Netherlands', emoji: '🇳🇱' },
            { name: 'Italy', emoji: '🇮🇹' },
            { name: 'USA', emoji: '🇺🇸' },
        ],
        rounds: [
            { name: 'Group Stage', diff: 0, level: 1, questions: 5, required: 3, drawScore: 2 },
            { name: 'Round of 16', diff: 1, level: 2, questions: 10, required: 7, drawScore: 6 },
            { name: 'Quarter-Finals', diff: 2, level: 2, questions: 12, required: 9, drawScore: 8 },
            { name: 'Semi-Finals', diff: 3, level: 3, questions: 15, required: 12, drawScore: 11 },
            { name: 'Final', diff: 4, level: 3, questions: 20, required: 18, drawScore: 17 }
        ],
        penalty: {
            questions: 5,
            timePerQuestion: 6, // Reduced to 6 seconds per kick
            requiredCorrect: 3
        }
    }
};

// ========================================
// GAME STATE
// ========================================

let gameState = {
    isPlaying: false,
    score: 0,
    streak: 0,
    bestStreak: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    operationType: 'multiplication', // Default operation
    gameMode: 'practice', // 'practice', 'tournament', or 'worldcup'
    startingLevel: 1,
    timeRemaining: 90,
    timerInterval: null,
    collectedCards: loadAndMergeCards(), // Load existing cards from storage
    sessionStartIndex: 0, // Index in localStorage array where this session started
    isMusicPlaying: false // Background music state
};

// World Cup specific state (kept separate to avoid polluting gameState)
let wcState = {
    playerCountry: null,
    opponents: [],
    currentRound: 0,
    roundScore: 0,
    roundQuestionIndex: 0,
    isPenalty: false,
    penaltyScore: 0,
    penaltyQuestionIndex: 0,
    penaltyTimerId: null,
    cleanSheetRounds: [],
    wcCards: [],
    totalGoals: 0,
    totalQuestions: 0
};



// ========================================
// DOM ELEMENTS
// ========================================

const elements = {
    // Screens
    startScreen: document.getElementById('start-screen'),
    gameScreen: document.getElementById('game-screen'),
    gameoverScreen: document.getElementById('gameover-screen'),

    // Start screen
    highScoreValue: document.getElementById('high-score-value'),
    startBtn: document.getElementById('start-btn'),
    operationToggle: document.getElementById('operation-toggle'),
    gameModeToggle: document.getElementById('game-mode-toggle'),
    gameModeHint: document.getElementById('game-mode-hint'),
    timerSection: document.getElementById('timer-section'),
    doneBtn: document.getElementById('done-btn'),

    // Game screen
    scoreDisplay: document.getElementById('score'),
    timerDisplay: document.getElementById('timer'),
    streakDisplay: document.getElementById('streak'),
    streakFire: document.getElementById('streak-fire'),
    levelText: document.getElementById('level-text'),
    levelDots: [
        document.getElementById('dot-1'),
        document.getElementById('dot-2'),
        document.getElementById('dot-3')
    ],
    levelUpCelebration: document.getElementById('level-up-celebration'),
    levelUpText: document.getElementById('level-up-text'),
    num1: document.getElementById('num1'),
    num2: document.getElementById('num2'),
    operator: document.getElementById('operator'),
    questionCard: document.getElementById('question-card'),
    answersGrid: document.getElementById('answers-grid'),
    answerBtns: document.querySelectorAll('.answer-btn'),
    typingArea: document.getElementById('typing-area'),
    answerInput: document.getElementById('answer-input'),
    submitAnswerBtn: document.getElementById('submit-answer-btn'),
    numberPad: document.getElementById('number-pad'),
    numBtns: document.querySelectorAll('.num-btn'),
    ball: document.getElementById('ball'),
    goalArea: document.querySelector('.goal-area'),
    feedback: document.getElementById('feedback'),
    doneBtn: document.getElementById('done-btn'),
    quitBtn: document.getElementById('quit-btn'),

    // Modals
    quitModal: document.getElementById('quit-modal'),
    cancelQuitBtn: document.getElementById('cancel-quit-btn'),
    confirmQuitBtn: document.getElementById('confirm-quit-btn'),

    // Game over screen
    finalScore: document.getElementById('final-score'),
    finalStreak: document.getElementById('final-streak'),
    finalAccuracy: document.getElementById('final-accuracy'),
    newRecord: document.getElementById('new-record'),
    playAgainBtn: document.getElementById('play-again-btn'),
    homeBtn: document.getElementById('home-btn'),

    // Lucky block elements
    luckyBlockOverlay: document.getElementById('lucky-block-overlay'),
    luckyBlock: document.getElementById('lucky-block'),
    cardReveal: document.getElementById('card-reveal'),
    cardEmoji: document.getElementById('card-emoji'),
    cardName: document.getElementById('card-name'),
    cardRarity: document.getElementById('card-rarity'),

    // My Cards elements
    myCardsSection: document.getElementById('my-cards-section'),
    myCardsGrid: document.getElementById('my-cards-grid'),

    // Start screen & Gallery elements
    viewCardsBtn: document.getElementById('view-cards-btn'),
    galleryScreen: document.getElementById('gallery-screen'),
    galleryGrid: document.getElementById('gallery-grid'),
    galleryHomeBtn: document.getElementById('gallery-home-btn'),
    totalCardsCount: document.getElementById('total-cards-count'),
    uniqueCardsCount: document.getElementById('unique-cards-count'),

    // Settings elements
    settingsBtn: document.getElementById('settings-btn'),
    startSettingsBtn: document.getElementById('start-settings-btn'),
    settingsModal: document.getElementById('settings-modal'),
    timerSelect: document.getElementById('timer-select'),
    levelSelect: document.getElementById('level-select'),
    saveSettingsBtn: document.getElementById('save-settings-btn'),

    // Streak bonus wheel elements
    streakWheelOverlay: document.getElementById('streak-wheel-overlay'),
    bonusWheel: document.getElementById('bonus-wheel'),
    wheelResult: document.getElementById('wheel-result'),

    // Music elements
    bgmAudio: document.getElementById('bgm-audio'),
    globalMusicBtn: document.getElementById('global-music-btn'),

    // World Cup elements
    countrySelectScreen: document.getElementById('country-select-screen'),
    countryGrid: document.getElementById('country-grid'),
    countryBackBtn: document.getElementById('country-back-btn'),
    wcMatchBanner: document.getElementById('wc-match-banner'),
    wcRoundName: document.getElementById('wc-round-name'),
    wcPlayerFlag: document.getElementById('wc-player-flag'),
    wcPlayerName: document.getElementById('wc-player-name'),
    wcOpponentFlag: document.getElementById('wc-opponent-flag'),
    wcOpponentName: document.getElementById('wc-opponent-name'),
    wcScoreDisplay: document.getElementById('wc-score-display'),
    wcQuestionCounter: document.getElementById('wc-question-counter'),
    wcTargetDisplay: document.getElementById('wc-target-display'),
    wcRoundResult: document.getElementById('wc-round-result'),
    wcResultTitle: document.getElementById('wc-result-title'),
    wcResultPlayer: document.getElementById('wc-result-player'),
    wcResultScore: document.getElementById('wc-result-score'),
    wcResultTarget: document.getElementById('wc-result-target'),
    wcResultOpponent: document.getElementById('wc-result-opponent'),
    wcResultMessage: document.getElementById('wc-result-message'),
    wcResultCards: document.getElementById('wc-result-cards'),
    wcResultContinue: document.getElementById('wc-result-continue'),
    wcPenaltyOverlay: document.getElementById('wc-penalty-overlay'),
    wcPenaltyScore: document.getElementById('wc-penalty-score'),
    wcPenaltyTimer: document.getElementById('wc-penalty-timer'),
    wcFinalScreen: document.getElementById('wc-final-screen'),
    wcFinalIcon: document.getElementById('wc-final-icon'),
    wcFinalTitle: document.getElementById('wc-final-title'),
    wcFinalCountry: document.getElementById('wc-final-country'),
    wcFinalStats: document.getElementById('wc-final-stats'),
    wcFinalCards: document.getElementById('wc-final-cards'),
    wcPlayAgainBtn: document.getElementById('wc-play-again-btn'),
    wcHomeBtn: document.getElementById('wc-home-btn')
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Aggregate cards by name and count occurrences
 */
function getUniqueCards(cards) {
    const unique = {};
    cards.forEach(card => {
        if (!unique[card.name]) {
            unique[card.name] = { ...card, count: 0 };
        }
        unique[card.name].count++;
    });
    return Object.values(unique).sort((a, b) => b.rarity - a.rarity); // Sort by rarity (desc)
}

/**
 * Show the gallery screen with collected cards
 */
function showGalleryScreen() {
    const cards = gameState.collectedCards;
    const uniqueCards = getUniqueCards(cards);

    // Update stats
    elements.totalCardsCount.textContent = cards.length;
    elements.uniqueCardsCount.textContent = uniqueCards.length;

    // Build grid
    if (cards.length === 0) {
        elements.galleryGrid.innerHTML = '<div class="no-cards">No cards collected yet. Play to earn them!</div>';
    } else {
        elements.galleryGrid.innerHTML = uniqueCards.map(card => `
            <div class="gallery-card rarity-${card.rarity}">
                <div class="card-team">${card.team || ''}</div>
                <div class="card-portrait">
                    <span class="card-portrait-emoji">${card.emoji}</span>
                </div>
                <span class="gallery-card-name">${card.fullName || card.name}</span>
                <span class="gallery-card-rarity-label">${card.rarity === 1 ? 'COMMON' :
                card.rarity === 2 ? 'RARE' :
                    card.rarity === 3 ? 'LEGENDARY' :
                        card.rarity === 4 ? 'MYTHICAL' : 'GODLY'
            }</span>
                <div class="card-stats-grid">
                    ${Object.entries(card.stats || {}).map(([label, value]) => `
                        <div class="stat-item">
                            <span class="stat-label">${label}</span>
                            <span class="stat-value">${value}</span>
                        </div>
                    `).join('')}
                </div>
                <span class="gallery-card-count">x${card.count}</span>
            </div>
        `).join('');
    }

    showScreen('gallery-screen');
}

/**
 * Get a random integer between min and max (inclusive)
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Format seconds as M:SS
 */
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get a random character card based on rarity weights
 * Godly: 5%, Mythical: 15%, Legendary: 25%, Rare: 40%, Common: 15%
 */
function getRandomCard() {
    const roll = Math.random();
    let pool;

    if (roll < 0.05) {
        // Godly 5%
        pool = CONFIG.characterCards.godly || CONFIG.characterCards.legendary;
    } else if (roll < 0.20) {
        // Mythical 15% (0.05 + 0.15 = 0.20)
        pool = CONFIG.characterCards.mythical || CONFIG.characterCards.legendary;
    } else if (roll < 0.45) {
        // Legendary 25% (0.20 + 0.25 = 0.45)
        pool = CONFIG.characterCards.legendary;
    } else if (roll < 0.85) {
        // Rare 40% (0.45 + 0.40 = 0.85)
        pool = CONFIG.characterCards.rare;
    } else {
        // Common 15%
        pool = CONFIG.characterCards.common;
    }

    return randomChoice(pool);
}

/**
 * Lucky Block Animation State
 */
let rewardTimeouts = [];
let isRewardReadyToClose = false;
let currentRewardCard = null;

function clearRewardTimeouts() {
    rewardTimeouts.forEach(t => clearTimeout(t));
    rewardTimeouts = [];
}

/**
 * Show lucky block reward animation
 */
function showLuckyBlockReward() {
    clearRewardTimeouts();
    isRewardReadyToClose = false;

    const card = getRandomCard();
    currentRewardCard = card;
    gameState.collectedCards.push(card);

    // Show overlay with block
    elements.luckyBlockOverlay.classList.add('show');
    elements.luckyBlock.style.display = 'flex';
    elements.luckyBlock.classList.remove('opened', 'shaking'); // Reset classes
    elements.cardReveal.classList.remove('show');

    // Step 1: Start Shaking (after brief pause)
    rewardTimeouts.push(setTimeout(() => {
        elements.luckyBlock.classList.add('shaking');
    }, 300));

    // Step 2: Open and Reveal (Natural flow)
    rewardTimeouts.push(setTimeout(() => {
        revealCardContent(card);
    }, 2000));
}

/**
 * Helper to render the card content
 */
function revealCardContent(card) {
    clearRewardTimeouts();

    elements.luckyBlock.classList.remove('shaking');
    elements.luckyBlock.classList.add('opened');

    // Render full card HTML
    elements.cardReveal.className = `card-reveal show rarity-${card.rarity}`;
    elements.cardReveal.innerHTML = `
        <div class="card-team">${card.team || ''}</div>
        <div class="card-portrait">
            <span class="card-portrait-emoji">${card.emoji}</span>
        </div>
        <div class="card-name">${card.fullName || card.name}</div>
        <div class="card-rarity rarity-${card.rarity}">${card.rarity === 1 ? 'COMMON' :
            card.rarity === 2 ? 'RARE' :
                card.rarity === 3 ? 'LEGENDARY' :
                    card.rarity === 4 ? 'MYTHICAL' : 'GODLY'
        }</div>
        <div class="card-stats-grid">
            ${Object.entries(card.stats).map(([label, value]) => `
                <div class="stat-item">
                    <span class="stat-label">${label}</span>
                    <span class="stat-value">${value}</span>
                </div>
            `).join('')}
        </div>
            <div class="tap-continue" style="opacity: 0;">Tap to continue</div>
        `;

    // Hide block, show card
    rewardTimeouts.push(setTimeout(() => {
        elements.luckyBlock.style.display = 'none';

        // Enforce watching the card for 2 seconds before allowing close
        rewardTimeouts.push(setTimeout(() => {
            isRewardReadyToClose = true; // Now safe to close

            // Show "Tap to continue" visual cue
            const tapText = elements.cardReveal.querySelector('.tap-continue');
            if (tapText) {
                tapText.style.opacity = '1';
                tapText.style.animation = 'pulse 1.5s ease-in-out infinite';
            }
        }, 2000));

    }, 400));
}

/**
 * Close the lucky block overlay (called when user taps)
 */
function closeLuckyBlockOverlay() {
    // STRICT LOCK: If not ready, ignore click completely.
    // User must watch the animation.
    if (!isRewardReadyToClose) {
        return;
    }

    // Actual close
    elements.luckyBlockOverlay.classList.remove('show');
    elements.luckyBlock.classList.remove('opened', 'shaking');
    elements.cardReveal.classList.remove('show');

    // Show next question after closing the overlay
    if (gameState.isPlaying) {
        showQuestion();
    }
}

/**
 * Get a random item from an array
 */
function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// ========================================
// STREAK BONUS WHEEL
// ========================================

const STREAK_BONUS_INTERVAL = 5;
const PRACTICE_STREAK_REWARD_INTERVAL = 15;
let lastBonusStreak = 0;
let lastPracticeRewardStreak = 0;

/**
 * Check if current streak qualifies for a bonus wheel
 */
function checkStreakBonus() {
    // Only in tournament mode at level 3
    if (gameState.gameMode !== 'tournament' || gameState.currentLevel !== 3) {
        return false;
    }

    const currentStreak = gameState.streak;

    // Check if we've hit a new multiple of 5 (5, 10, 15, 20, ...)
    if (currentStreak > 0 && currentStreak % STREAK_BONUS_INTERVAL === 0 && currentStreak > lastBonusStreak) {
        lastBonusStreak = currentStreak;
        showStreakBonusWheel();
        return true;
    }
    return false;
}

/**
 * Check if current streak in practice mode qualifies for a card reward.
 * Awards a regular lucky block card every 15-streak interval.
 */
function checkPracticeStreakReward() {
    // Only in practice mode
    if (gameState.gameMode !== 'practice') {
        return false;
    }

    const currentStreak = gameState.streak;

    // Check if we've hit a new multiple of 15 (15, 30, 45, ...)
    if (currentStreak > 0 && currentStreak % PRACTICE_STREAK_REWARD_INTERVAL === 0 && currentStreak > lastPracticeRewardStreak) {
        lastPracticeRewardStreak = currentStreak;
        showLuckyBlockReward();
        return true;
    }
    return false;
}

/**
 * Show the streak bonus wheel
 */
let isWheelReadyToSpin = false;

function showStreakBonusWheel() {
    elements.streakWheelOverlay.classList.add('show');
    isWheelReadyToSpin = true;

    // Update subtitle to prompt user
    const subtitle = document.querySelector('.wheel-subtitle');
    if (subtitle) {
        subtitle.textContent = 'Tap the wheel to spin!';
    }
}

/**
 * Spin the bonus wheel and award a card
 */
function spinBonusWheel() {
    // Determine which tier to award
    // Legendary: 60%, Mythical: 25%, Godly: 15%
    const tierRoll = Math.random();
    let targetTier, minAngle, maxAngle;

    if (tierRoll < 0.60) {
        targetTier = 'legendary';
        // Segment 0-216 deg. Center 108.
        // To land at top (0deg), we need rotation R such that (angle + R) % 360 = 0
        // So R = 360 - angle.
        // Range: 360-216 to 360-0 => 144 to 360
        minAngle = 10;
        maxAngle = 206;
    } else if (tierRoll < 0.85) {
        targetTier = 'mythical';
        // Segment 216-306 deg.
        minAngle = 226;
        maxAngle = 296;
    } else {
        targetTier = 'godly';
        // Segment 306-360 deg.
        minAngle = 316;
        maxAngle = 350;
    }

    // Pick a random angle within the segment
    const randomAngleInSegment = Math.floor(Math.random() * (maxAngle - minAngle + 1)) + minAngle;

    // Calculate rotation needed to bring that angle to the top (0deg)
    // The wheel rotates clockwise. If we want angle X to be at top, we rotate by (360 - X).
    const targetRotation = 360 - randomAngleInSegment;

    // Add extra spins for excitement (3-5 full rotations + target)
    const extraSpins = 3 + Math.floor(Math.random() * 3);
    const totalRotation = 360 * extraSpins + targetRotation;

    // Apply rotation
    elements.bonusWheel.style.setProperty('--spin-degrees', `${totalRotation}deg`);
    elements.bonusWheel.classList.add('spinning');

    // After spin completes, show the card
    setTimeout(() => {
        showBonusCardResult(targetTier);
    }, 4000);
}

/**
 * Show the card result after wheel spin
 */
function showBonusCardResult(tier) {
    // Get a random card from the appropriate tier
    let card;
    if (tier === 'legendary') {
        card = randomChoice(CONFIG.characterCards.legendary);
    } else if (tier === 'mythical') {
        card = randomChoice(CONFIG.characterCards.mythical);
    } else {
        card = randomChoice(CONFIG.characterCards.godly);
    }

    // Add to collection
    gameState.collectedCards.push(card);

    // Hide the wheel wrapper
    const wheelWrapper = document.querySelector('.wheel-wrapper');
    if (wheelWrapper) {
        wheelWrapper.style.display = 'none';
    }

    // Update subtitle
    const subtitle = document.querySelector('.wheel-subtitle');
    if (subtitle) {
        subtitle.textContent = 'You won:';
    }

    // Display the card with proper rarity styling
    const rarityClass = `rarity-${card.rarity}`;

    const cardHTML = `
        <div class="card-portrait">
            <span class="card-portrait-emoji">${card.emoji}</span>
        </div>
        <div class="card-name">${card.fullName || card.name}</div>
        <div class="card-rarity ${rarityClass}">${card.rarity === 3 ? 'LEGENDARY' :
            card.rarity === 4 ? 'MYTHICAL' : 'GODLY'
        }</div>
        ${card.team ? `<div class="card-team">${card.team}</div>` : ''}
        <div class="card-stats-grid">
            ${Object.entries(card.stats).map(([label, value]) => `
                <div class="stat-item">
                    <span class="stat-label">${label}</span>
                    <span class="stat-value">${value}</span>
                </div>
            `).join('')}
        </div>
        <div class="tap-continue" style="margin-top: 15px;">Tap to continue</div>
    `;

    elements.wheelResult.innerHTML = cardHTML;
    elements.wheelResult.className = `wheel-result show ${rarityClass}`;
}

/**
 * Close the streak bonus wheel overlay
 */
function closeStreakBonusWheel() {
    elements.streakWheelOverlay.classList.remove('show');
    elements.bonusWheel.classList.remove('spinning');
    elements.wheelResult.classList.remove('show');
    elements.wheelResult.className = 'wheel-result'; // Remove rarity classes
    elements.bonusWheel.style.transform = 'rotate(0deg)';

    // Restore wheel wrapper visibility
    const wheelWrapper = document.querySelector('.wheel-wrapper');
    if (wheelWrapper) {
        wheelWrapper.style.display = 'flex';
    }

    // Restore original subtitle
    const subtitle = document.querySelector('.wheel-subtitle');
    if (subtitle) {
        subtitle.textContent = 'Spin for a rare card!';
    }

    // Show next question after closing the overlay
    if (gameState.isPlaying) {
        showQuestion();
    }
}

// ========================================
// LOCAL STORAGE
// ========================================

function getHighScoreKey() {
    return `soccerMath_${gameState.operationType}_${gameState.gameMode}_HighScore`;
}

function loadHighScore() {
    const key = getHighScoreKey();
    const saved = localStorage.getItem(key);
    gameState.highScore = saved ? parseInt(saved, 10) : 0;
    elements.highScoreValue.textContent = gameState.highScore;
}

function saveHighScore(score) {
    if (score > gameState.highScore) {
        gameState.highScore = score;
        localStorage.setItem(getHighScoreKey(), score.toString());
        return true; // New record
    }
    return false;
}

// ========================================
// MODE SELECTION
// ========================================

function initModeToggles() {
    // Helper to add touch-friendly listeners
    function addToggleListener(buttons, callback) {
        buttons.forEach(btn => {
            // Touch handler (for immediate response on mobile)
            btn.addEventListener('touchstart', (e) => {
                // Only prevent default if it's a button tap, allowing scrolling elsewhere
                if (e.cancelable) e.preventDefault();
                callback(btn);
            }, { passive: false });

            // Click handler (desktop/fallback)
            btn.addEventListener('click', (e) => {
                // Prevent double-firing if touch already handled it (though preventDefault handles that usually)
                callback(btn);
            });
        });
    }

    // Operation toggle (multiplication / division)
    const operationBtns = elements.operationToggle.querySelectorAll('.toggle-btn');
    addToggleListener(operationBtns, (btn) => {
        operationBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        gameState.operationType = btn.dataset.value;

        updateGameModeHint();
        loadHighScore(); // Update high score for selected mode
    });

    // Game mode toggle (practice / tournament / worldcup)
    const gameModeBtns = elements.gameModeToggle.querySelectorAll('.toggle-btn');
    addToggleListener(gameModeBtns, (btn) => {
        gameModeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        gameState.gameMode = btn.dataset.value;

        // Set input mode based on game mode
        if (btn.dataset.value === 'practice') {
            gameState.inputMode = 'choice';
        } else {
            gameState.inputMode = 'typing';
        }

        updateGameModeHint();
    });
}


/**
 * Update the game mode hint text
 */
function updateGameModeHint() {
    if (gameState.gameMode === 'practice') {
        elements.gameModeHint.textContent = 'Multiple choice • No timer';
    } else if (gameState.gameMode === 'worldcup') {
        elements.gameModeHint.textContent = 'Round-based • Sprint to victory';
    } else {
        elements.gameModeHint.textContent = 'Type answers • Timed';
    }
}


// ========================================
// MISSED QUESTIONS (ADAPTIVE LEARNING)
// ========================================

/**
 * Load missed questions from localStorage
 */
function loadMissedQuestions() {
    try {
        const stored = localStorage.getItem('soccerMath_missedQuestions');
        return stored ? JSON.parse(stored) : {};
    } catch (e) {
        return {};
    }
}

/**
 * Save missed questions to localStorage
 */
function saveMissedQuestions(missed) {
    try {
        localStorage.setItem('soccerMath_missedQuestions', JSON.stringify(missed));
    } catch (e) {
        // Ignore storage errors
    }
}

/**
 * Add a question to the missed pool
 */
function addMissedQuestion(num1, num2, operator) {
    const missed = loadMissedQuestions();
    const key = `${num1}${operator}${num2}`;
    missed[key] = CONFIG.reinforcementRequired;
    saveMissedQuestions(missed);
}

/**
 * Reinforce a question (decrease count or remove if mastered)
 */
function reinforceQuestion(num1, num2, operator) {
    const missed = loadMissedQuestions();
    const key = `${num1}${operator}${num2}`;

    if (missed[key]) {
        missed[key]--;
        if (missed[key] <= 0) {
            delete missed[key];
        }
        saveMissedQuestions(missed);
    }
}

/**
 * Get a random missed question if available
 */
function getRandomMissedQuestion() {
    const missed = loadMissedQuestions();
    const keys = Object.keys(missed);

    if (keys.length === 0) return null;

    const key = randomChoice(keys);
    const match = key.match(/^(\d+)(×|÷)(\d+)$/);

    if (!match) return null;

    return {
        num1: parseInt(match[1]),
        operator: match[2],
        num2: parseInt(match[3])
    };
}

// ========================================
// MUSIC CONTROLS
// ========================================

const BGM_TRACKS = ['bgm-1.mp3', 'bgm-2.mp3', 'bgm-3.mp3'];
let currentTrackIndex = 0;

function initMusic() {
    // Always start muted to comply with browser autoplay policies
    // and ensure UI matches reality (no sound without interaction)
    gameState.isMusicPlaying = false;

    // Pick a random starting track
    currentTrackIndex = Math.floor(Math.random() * BGM_TRACKS.length);

    // Set initial button state
    updateMusicButtonState();

    // Add click listeners to all music toggle buttons
    const musicBtns = document.querySelectorAll('.music-toggle-btn');
    musicBtns.forEach(btn => {
        btn.addEventListener('click', toggleMusic);
    });

    // When a track ends, play the next one
    if (elements.bgmAudio) {
        elements.bgmAudio.addEventListener('ended', playNextTrack);
    }
}

function loadTrack(index) {
    if (elements.bgmAudio) {
        elements.bgmAudio.src = BGM_TRACKS[index];
        elements.bgmAudio.load();
    }
}

function playNextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % BGM_TRACKS.length;
    loadTrack(currentTrackIndex);
    if (gameState.isMusicPlaying && elements.bgmAudio) {
        elements.bgmAudio.play().catch(e => {
            console.log("Audio play failed:", e);
        });
    }
}

function toggleMusic() {
    gameState.isMusicPlaying = !gameState.isMusicPlaying;

    // Save preference
    localStorage.setItem('soccerMath_musicEnabled', gameState.isMusicPlaying);

    updateMusicButtonState();

    if (gameState.isMusicPlaying) {
        playMusic();
    } else {
        pauseMusic();
    }
}

function updateMusicButtonState() {
    const musicBtns = document.querySelectorAll('.music-toggle-btn');

    musicBtns.forEach(btn => {
        if (gameState.isMusicPlaying) {
            btn.classList.add('playing');
            btn.setAttribute('aria-label', 'Mute Music');
            btn.textContent = '🔊';
        } else {
            btn.classList.remove('playing');
            btn.setAttribute('aria-label', 'Enable Music');
            btn.textContent = '🔇';
        }
    });
}

function playMusic() {
    if (elements.bgmAudio) {
        loadTrack(currentTrackIndex);
        elements.bgmAudio.volume = 0.5;
        elements.bgmAudio.play().catch(e => {
            console.log("Audio play failed (likely autoplay policy):", e);
        });
    }
}

function pauseMusic() {
    if (elements.bgmAudio) {
        elements.bgmAudio.pause();
    }
}

// ========================================
// DEVICE DETECTION
// ========================================

/**
 * Detect if the user is on a PC (has physical keyboard).
 * Returns true for devices without touch support (desktops/laptops).
 */
function isPC() {
    return navigator.maxTouchPoints === 0 && window.matchMedia('(hover: hover)').matches;
}

// ========================================
// SCREEN MANAGEMENT
// ========================================

function showScreen(screenId) {
    // Hide all screens
    elements.startScreen.classList.remove('active');
    elements.gameScreen.classList.remove('active');
    elements.gameoverScreen.classList.remove('active');
    elements.galleryScreen.classList.remove('active');
    if (elements.countrySelectScreen) elements.countrySelectScreen.classList.remove('active');
    if (elements.wcRoundResult) elements.wcRoundResult.classList.remove('active');
    if (elements.wcFinalScreen) elements.wcFinalScreen.classList.remove('active');

    // Show requested screen
    document.getElementById(screenId).classList.add('active');
}

// ========================================
// GAME LOGIC
// ========================================

/**
 * Determine current difficulty level based on score
 */
function updateLevel() {
    // Calculate what level should be based on correct answers
    if (gameState.gameMode === 'worldcup') return false;

    let newLevel = gameState.startingLevel; // Never go below starting level

    const levelConfig = gameState.operationType === 'fractions' ? CONFIG.fractionLevels : CONFIG.levels;

    if (gameState.correctAnswers >= levelConfig[3].minCorrect) {
        newLevel = 3;
    } else if (gameState.correctAnswers >= levelConfig[2].minCorrect) {
        newLevel = Math.max(2, gameState.startingLevel);
    }

    // Don't advance if there are still missed questions to master
    const missed = loadMissedQuestions();
    const hasMissedQuestions = Object.keys(missed).length > 0;

    if (newLevel > gameState.currentLevel && hasMissedQuestions) {
        // Block level advancement until missed questions are cleared
        return;
    }

    if (newLevel !== gameState.currentLevel) {
        const isLevelUp = newLevel > gameState.currentLevel;
        gameState.currentLevel = newLevel;

        // Update UI
        elements.levelText.textContent = levelConfig[newLevel].name;
        elements.levelDots.forEach((dot, index) => {
            dot.classList.toggle('active', index < newLevel);
        });

        // Show celebration if leveling up
        if (isLevelUp) {
            // Reset streak when leveling up
            gameState.streak = 0;
            elements.streakDisplay.textContent = gameState.streak;
            showLevelUpCelebration(newLevel);

            // Return true if in tournament mode (lucky block will show)
            // This tells the caller to skip automatic next question
            return gameState.gameMode === 'tournament';
        }
    }

    return false; // No level up, continue normally
}

/**
 * Show level up celebration splash
 */
function showLevelUpCelebration(level) {
    elements.levelUpText.textContent = `LEVEL ${level}!`;
    elements.levelUpCelebration.classList.add('show');

    // Remove after animation completes, then show lucky block
    setTimeout(() => {
        elements.levelUpCelebration.classList.remove('show');
        // Show lucky block reward after celebration ONLY in tournament mode
        if (gameState.gameMode === 'tournament') {
            setTimeout(() => {
                showLuckyBlockReward();
            }, 300);
        }
    }, 2000);
}

/**
 * Generate a multiplication question based on current level
 */
/**
 * Generate a multiplication question based on current level
 */
function generateMultiplicationQuestion() {
    // Force Level 1 if in Penalty Mode (safeguard)
    const levelToUse = (gameState.gameMode === 'worldcup' && wcState.isPenalty) ? 1 : gameState.currentLevel;
    const level = CONFIG.levels[levelToUse];
    const tables = level.tables;

    // Pick a random multiplier from current level's tables
    const multiplier = randomChoice(tables);

    // Generate the other number (2-12 for 4th grade)
    const otherNum = randomInt(2, 12);

    // Randomly decide order
    const num1 = Math.random() > 0.5 ? multiplier : otherNum;
    const num2 = num1 === multiplier ? otherNum : multiplier;

    const correctAnswer = num1 * num2;

    // Generate distractor answers for multiple choice
    const distractors = generateMultiplicationDistractors(correctAnswer, num1, num2);
    const answers = shuffleArray([correctAnswer, ...distractors]);

    return {
        num1,
        num2,
        operator: '×',
        correctAnswer,
        answers
    };
}



/**
 * Generate a division question based on current level
 * Division is the inverse of multiplication to ensure whole number answers
 */
function generateDivisionQuestion() {
    const level = CONFIG.levels[gameState.currentLevel];
    const tables = level.tables;

    // Pick a divisor from current level's tables
    const divisor = randomChoice(tables);

    // Generate the quotient (result) - keep it reasonable for 4th grade
    const quotient = randomInt(2, 12);

    // Calculate the dividend (the number being divided)
    const dividend = divisor * quotient;

    // Generate distractor answers for multiple choice
    const distractors = generateDivisionDistractors(quotient, dividend, divisor);
    const answers = shuffleArray([quotient, ...distractors]);

    return {
        num1: dividend,
        num2: divisor,
        operator: '÷',
        correctAnswer: quotient,
        answers
    };
}

/**
 * Generate question based on current operation type
 * Uses adaptive learning to prioritize missed questions
 */
function generateQuestion() {
    // Fractions mode has its own flow (no adaptive learning for now)
    if (gameState.operationType === 'fractions') {
        return generateFractionsQuestion();
    }

    // Check if we should show a missed question (50% chance)
    const missedQuestion = getRandomMissedQuestion();

    if (missedQuestion && Math.random() < CONFIG.reinforcementProbability) {
        // Use the missed question
        const { num1, operator, num2 } = missedQuestion;
        let correctAnswer, distractors;

        if (operator === '×') {
            correctAnswer = num1 * num2;
            distractors = generateMultiplicationDistractors(correctAnswer, num1, num2);
        } else if (operator === '÷') {
            correctAnswer = num1 / num2;
            distractors = generateDivisionDistractors(correctAnswer, num1, num2);
        } else {
            // Fallback
            correctAnswer = 0;
            distractors = [];
        }


        const answers = shuffleArray([correctAnswer, ...distractors]);

        return {
            num1,
            num2,
            operator,
            correctAnswer,
            answers,
            isReinforcement: true  // Flag to track this is a reinforcement question
        };
    }

    // Generate new question based on operation type
    if (gameState.operationType === 'division') {
        return generateDivisionQuestion();
    }
    return generateMultiplicationQuestion();
}

/**
 * Generate plausible wrong answers for multiplication
 */
function generateMultiplicationDistractors(correct, num1, num2) {
    const distractors = new Set();

    // Common mistake patterns
    const patterns = [
        correct + num1,        // Added instead of multiplied once
        correct - num1,        // Subtracted once
        correct + num2,        // Added the other number
        correct - num2,        // Subtracted the other number  
        correct + 10,          // Off by 10
        correct - 10,          // Off by 10
        correct + 1,           // Off by 1
        correct - 1,           // Off by 1
        num1 + num2,           // Addition instead of multiplication
        (num1 + 1) * num2,     // Off by one on first number
        num1 * (num2 + 1),     // Off by one on second number
        (num1 - 1) * num2,     // Off by one (minus)
        num1 * (num2 - 1)      // Off by one (minus)
    ];

    // Add unique positive distractors
    for (const value of patterns) {
        if (value > 0 && value !== correct && !distractors.has(value)) {
            distractors.add(value);
            if (distractors.size >= 3) break;
        }
    }

    // If still need more, add random nearby numbers
    while (distractors.size < 3) {
        const offset = randomInt(-15, 15);
        const value = correct + offset;
        if (value > 0 && value !== correct && !distractors.has(value)) {
            distractors.add(value);
        }
    }

    return Array.from(distractors).slice(0, 3);
}

/**
 * Generate plausible wrong answers for division
 */
function generateDivisionDistractors(correct, dividend, divisor) {
    const distractors = new Set();

    // Common mistake patterns for division
    const patterns = [
        correct + 1,           // Off by 1
        correct - 1,           // Off by 1
        correct + 2,           // Off by 2
        correct - 2,           // Off by 2
        correct + 5,           // Off by 5
        Math.floor(dividend / (divisor - 1)), // Use divisor - 1
        Math.floor(dividend / (divisor + 1)), // Use divisor + 1
        Math.floor((dividend + divisor) / divisor), // Off by 1 (dividend logic)
        Math.floor((dividend - divisor) / divisor)  // Off by 1 (dividend logic)
    ];

    // Add unique positive distractors
    for (const value of patterns) {
        if (value > 0 && value !== correct && Number.isInteger(value) && !distractors.has(value)) {
            distractors.add(value);
            if (distractors.size >= 3) break;
        }
    }

    // If still need more, add random nearby numbers
    while (distractors.size < 3) {
        const offset = randomInt(-5, 5);
        const value = correct + offset;
        if (value > 0 && value !== correct && !distractors.has(value)) {
            distractors.add(value);
        }
    }

    return Array.from(distractors).slice(0, 3);
}

/**
 * Generate an equivalent fractions question based on current level.
 * Practice mode: show fraction, pick the equivalent from 4 choices (all fraction strings).
 * Tournament mode: show "baseNum/baseDen = ?/targetDen", answer is the missing numerator (integer).
 */
function generateFractionsQuestion() {
    const levelConfig = CONFIG.fractionLevels[gameState.currentLevel];
    const baseFractions = levelConfig.baseFractions;
    const [minMult, maxMult] = levelConfig.multiplierRange;

    // Pick a random base fraction [numerator, denominator]
    const [baseNum, baseDen] = randomChoice(baseFractions);

    // Pick a random multiplier to create the equivalent fraction
    const multiplier = randomInt(minMult, maxMult);
    const equivNum = baseNum * multiplier;
    const equivDen = baseDen * multiplier;

    if (gameState.inputMode === 'choice') {
        // Practice mode: answer choices are fraction strings
        const correctAnswer = `${equivNum}/${equivDen}`;
        const distractors = generateFractionsDistractors(equivNum, equivDen, baseNum, baseDen);
        const answers = shuffleArray([correctAnswer, ...distractors]);

        return {
            num1: `${baseNum}/${baseDen}`,
            num2: '',
            operator: '=',
            correctAnswer,
            answers,
            isFractions: true
        };
    } else {
        // Tournament mode: answer is the missing numerator (integer)
        return {
            num1: `${baseNum}/${baseDen}`,
            num2: equivDen,
            operator: '= ?/',
            correctAnswer: equivNum,
            answers: [],
            isFractions: true
        };
    }
}

/**
 * Generate 3 plausible wrong fraction strings for practice mode.
 * Uses the same denominator as the correct answer but wrong numerators.
 */
function generateFractionsDistractors(correctNum, correctDen, baseNum, baseDen) {
    const distractors = new Set();

    // Generate wrong numerators using the same denominator
    const patterns = [
        correctNum + 1,
        correctNum - 1,
        correctNum + 2,
        correctNum - 2,
        correctNum + baseDen,
        correctNum - baseDen,
        correctNum * 2,
        Math.floor(correctNum / 2),
        baseNum + 1,
        baseDen
    ];

    for (const wrongNum of patterns) {
        if (wrongNum > 0 && wrongNum !== correctNum && !distractors.has(wrongNum)) {
            // Make sure it's not actually equivalent to the base fraction
            if (wrongNum / correctDen !== baseNum / baseDen) {
                distractors.add(`${wrongNum}/${correctDen}`);
                if (distractors.size >= 3) break;
            }
        }
    }

    // Fallback: random wrong numerators
    while (distractors.size < 3) {
        const wrongNum = randomInt(1, correctDen - 1);
        const fracStr = `${wrongNum}/${correctDen}`;
        if (wrongNum !== correctNum && !distractors.has(fracStr) && wrongNum / correctDen !== baseNum / baseDen) {
            distractors.add(fracStr);
        }
    }

    return Array.from(distractors).slice(0, 3);
}


/**
 * Display a new question
 */
function showQuestion() {
    gameState.currentQuestion = generateQuestion();
    gameState.currentAttempts = 0; // Reset attempts for new question
    const q = gameState.currentQuestion;

    // Handle fraction display
    const equalsEl = document.querySelector('.question-content .equals');
    const questionMarkEl = document.querySelector('.question-content .question-mark');

    if (q.isFractions) {
        // Hide the static = and ? since fractions mode handles its own layout
        if (equalsEl) equalsEl.style.display = 'none';
        if (questionMarkEl) questionMarkEl.style.display = 'none';

        // Render base fraction as stacked fraction HTML
        elements.num1.innerHTML = renderFractionHTML(q.num1);

        if (gameState.inputMode === 'choice') {
            // Practice: "1/2 = ?"
            elements.operator.textContent = '=';
            elements.num2.textContent = '?';
        } else {
            // Tournament: "1/2 = ?/den"
            elements.operator.textContent = '=';
            elements.num2.innerHTML = renderFractionHTML(`?/${q.num2}`);
        }
    } else {
        // Restore static elements for multiplication/division
        if (equalsEl) equalsEl.style.display = '';
        if (questionMarkEl) questionMarkEl.style.display = '';

        // Standard multiplication/division display
        elements.num1.innerHTML = '';
        elements.num1.textContent = q.num1;
        elements.num2.innerHTML = '';
        elements.num2.textContent = q.num2;
        elements.operator.textContent = q.operator;
    }

    if (gameState.inputMode === 'choice') {
        // Multiple choice mode
        elements.answersGrid.style.display = 'grid';
        elements.typingArea.style.display = 'none';
        elements.numberPad.style.display = 'none';

        // Update answer buttons
        elements.answerBtns.forEach((btn, index) => {
            if (q.isFractions) {
                btn.innerHTML = renderFractionHTML(q.answers[index]);
            } else {
                btn.innerHTML = '';
                btn.textContent = q.answers[index];
            }
            btn.disabled = false;
            btn.classList.remove('correct', 'incorrect');
        });
    } else {
        // Typing mode
        elements.answersGrid.style.display = 'none';
        elements.typingArea.style.display = 'flex';
        elements.numberPad.style.display = 'grid';

        // Clear input
        elements.answerInput.value = '';
        elements.answerInput.classList.remove('correct', 'incorrect');
        elements.answerInput.disabled = false;
        elements.submitAnswerBtn.disabled = false;

        // Prevent native keyboard on mobile/tablet (PC users can type directly)
        if (!isPC()) {
            elements.answerInput.setAttribute('readonly', 'readonly');
        } else {
            elements.answerInput.removeAttribute('readonly');
        }
    }

    // Reset feedback
    elements.feedback.classList.remove('show', 'goal', 'miss');
}

/**
 * Render a fraction string (e.g. "3/6") as stacked HTML.
 */
function renderFractionHTML(fracStr) {
    const str = String(fracStr);
    if (!str.includes('/')) return str;
    const [num, den] = str.split('/');
    return `<span class="fraction"><span class="frac-num">${num}</span><span class="frac-den">${den}</span></span>`;
}

/**
 * Handle answer selection (multiple choice mode)
 */
function handleAnswer(selectedIndex) {
    if (!gameState.isPlaying) return;

    const q = gameState.currentQuestion;
    const selectedAnswer = q.answers[selectedIndex];
    const isCorrect = selectedAnswer === q.correctAnswer;

    gameState.totalQuestions++;

    // Disable all buttons temporarily
    elements.answerBtns.forEach(btn => btn.disabled = true);

    // Find correct button
    const correctIndex = q.answers.indexOf(q.correctAnswer);

    // Track if we'll need to wait for an overlay
    let willShowOverlay = false;

    if (isCorrect) {
        const result = handleCorrectAnswer(selectedIndex);
        willShowOverlay = result.didLevelUp || result.isStreakBonusShown;
    } else {
        handleIncorrectAnswer(selectedIndex, correctIndex);
    }

    // Show next question after delay (longer for incorrect so they can see the answer)
    // BUT skip if level-up or bonus will show an overlay (it will handle next question)
    if (!willShowOverlay) {
        const delay = isCorrect ? 800 : 3500;
        setTimeout(() => {
            if (gameState.isPlaying) {
                // In World Cup mode, check if round is complete
                if (gameState.gameMode === 'worldcup') {
                    handleWCAnswer(isCorrect);
                } else {
                    showQuestion();
                }
            }
        }, delay);
    } else if (gameState.gameMode === 'worldcup') {
        // Still track WC progress even during overlays
        handleWCAnswer(isCorrect);
    }
}

/**
 * Handle typed answer submission (typing mode)
 */
function handleTypedAnswer() {
    if (!gameState.isPlaying) return;

    const q = gameState.currentQuestion;
    const typedValue = elements.answerInput.value.trim();

    // Ignore empty submissions
    if (typedValue === '') return;

    let isCorrect = false;

    // Standard integer answer
    const typedAnswer = parseInt(typedValue, 10);
    isCorrect = typedAnswer === q.correctAnswer;

    gameState.totalQuestions++;

    // Disable input temporarily
    elements.answerInput.disabled = true;
    elements.submitAnswerBtn.disabled = true;

    // Track if we'll need to wait for an overlay
    let willShowOverlay = false;

    if (isCorrect) {
        const result = handleCorrectTypedAnswer();
        willShowOverlay = result.didLevelUp || result.isStreakBonusShown;
    } else {
        handleIncorrectTypedAnswer();
    }

    // Show next question after delay (longer for incorrect so they can see the answer)
    // BUT skip if level-up or bonus will show an overlay (it will handle next question)
    if (!willShowOverlay) {
        const delay = isCorrect ? 800 : 3500;
        setTimeout(() => {
            if (gameState.isPlaying) {
                // In World Cup mode, check if round is complete
                if (gameState.gameMode === 'worldcup') {
                    handleWCAnswer(isCorrect);
                } else {
                    showQuestion();
                }
            }
        }, delay);
    } else if (gameState.gameMode === 'worldcup') {
        // Still track WC progress even during overlays
        handleWCAnswer(isCorrect);
    }
}

/**
 * Handle correct answer (multiple choice)
         */
function handleCorrectAnswer(buttonIndex) {
    gameState.score++;
    gameState.correctAnswers++;
    gameState.streak++;

    // Reinforce this question if it was in the missed pool
    const q = gameState.currentQuestion;
    reinforceQuestion(q.num1, q.num2, q.operator);

    if (gameState.streak > gameState.bestStreak) {
        gameState.bestStreak = gameState.streak;
    }

    // Update displays
    elements.scoreDisplay.textContent = gameState.score;
    elements.streakDisplay.textContent = gameState.streak;

    // Show streak fire if on a hot streak
    if (gameState.streak >= CONFIG.streakBonusThreshold) {
        elements.streakFire.classList.add('active');
    }

    // Button feedback
    elements.answerBtns[buttonIndex].classList.add('correct');

    // Ball animation
    elements.ball.classList.remove('kick', 'miss');
    void elements.ball.offsetWidth; // Force reflow
    elements.ball.classList.add('kick');

    // Goal celebration
    elements.goalArea.classList.add('goal-scored');
    setTimeout(() => elements.goalArea.classList.remove('goal-scored'), 400);

    // Feedback message
    const message = gameState.streak >= CONFIG.streakBonusThreshold
        ? `${gameState.streak}x STREAK! 🔥`
        : randomChoice(CONFIG.goalMessages);
    showFeedback(message, 'goal');

    // Check for streak bonus milestones
    checkStreakBonus();

    // Check for practice mode streak rewards (card every 15 streak)
    const isPracticeRewardShown = checkPracticeStreakReward();

    // Check for level up
    const didLevelUp = updateLevel();

    // Check if streak bonus overlay was shown
    const isStreakBonusShown = elements.streakWheelOverlay.classList.contains('show');

    // Return whether we showed an overlay so the caller knows not to auto-advance
    return { didLevelUp, isStreakBonusShown: isStreakBonusShown || isPracticeRewardShown };
}

/**
 * Handle correct answer (typing mode)
 */
function handleCorrectTypedAnswer() {
    gameState.score++;
    gameState.correctAnswers++;
    gameState.streak++;

    // Reinforce this question if it was in the missed pool
    const q = gameState.currentQuestion;
    reinforceQuestion(q.num1, q.num2, q.operator);

    if (gameState.streak > gameState.bestStreak) {
        gameState.bestStreak = gameState.streak;
    }

    // Update displays
    elements.scoreDisplay.textContent = gameState.score;
    elements.streakDisplay.textContent = gameState.streak;

    // Check for streak bonus milestones
    checkStreakBonus();

    // Show streak fire if on a hot streak
    if (gameState.streak >= CONFIG.streakBonusThreshold) {
        elements.streakFire.classList.add('active');
    }

    // Input feedback
    elements.answerInput.classList.add('correct');

    // Ball animation
    elements.ball.classList.remove('kick', 'miss');
    void elements.ball.offsetWidth; // Force reflow
    elements.ball.classList.add('kick');

    // Goal celebration
    elements.goalArea.classList.add('goal-scored');
    setTimeout(() => elements.goalArea.classList.remove('goal-scored'), 400);

    // Feedback message
    const message = gameState.streak >= CONFIG.streakBonusThreshold
        ? `${gameState.streak}x STREAK! 🔥`
        : randomChoice(CONFIG.goalMessages);
    showFeedback(message, 'goal');

    // Check for level up
    // Returns true if level-up in tournament mode (overlay will show)
    const didLevelUp = updateLevel();

    // Check if streak bonus overlay was shown
    // We can check if the overlay class is active
    const isStreakBonusShown = elements.streakWheelOverlay.classList.contains('show');

    // Return whether we showed an overlay so the caller knows not to auto-advance
    return { didLevelUp, isStreakBonusShown };
}

/**
 * Handle incorrect answer (multiple choice)
 */
function handleIncorrectAnswer(buttonIndex, correctIndex) {
    gameState.streak = 0;
    lastBonusStreak = 0;

    // Add this question to the missed pool for reinforcement
    const q = gameState.currentQuestion;
    addMissedQuestion(q.num1, q.num2, q.operator);

    // Update streak display
    elements.streakDisplay.textContent = gameState.streak;
    elements.streakFire.classList.remove('active');

    // Button feedback
    elements.answerBtns[buttonIndex].classList.add('incorrect');
    elements.answerBtns[correctIndex].classList.add('correct');

    // Ball animation
    elements.ball.classList.remove('kick', 'miss');
    void elements.ball.offsetWidth; // Force reflow
    elements.ball.classList.add('miss');

    // Feedback message
    showFeedback(randomChoice(CONFIG.missMessages), 'miss');
}

/**
 * Handle incorrect answer (typing mode)
 */
function handleIncorrectTypedAnswer() {
    gameState.streak = 0;
    lastBonusStreak = 0;

    // Add this question to the missed pool for reinforcement
    const q = gameState.currentQuestion;
    addMissedQuestion(q.num1, q.num2, q.operator);

    // Update streak display
    elements.streakDisplay.textContent = gameState.streak;
    elements.streakFire.classList.remove('active');

    // Input feedback - show correct answer
    elements.answerInput.classList.add('incorrect');
    elements.answerInput.value = q.correctAnswer;

    // Ball animation
    elements.ball.classList.remove('kick', 'miss');
    void elements.ball.offsetWidth; // Force reflow
    elements.ball.classList.add('miss');

    // Feedback message
    showFeedback(randomChoice(CONFIG.missMessages), 'miss');
}

/**
 * Handle number pad button clicks
 */
function handleNumberPadClick(e) {
    if (!gameState.isPlaying) return;

    const button = e.currentTarget;
    const value = button.dataset.value;
    const input = elements.answerInput;

    if (value === 'backspace') {
        input.value = input.value.slice(0, -1);
    } else if (value === 'clear') {
        input.value = '';
    } else {
        // Append digit (limit to reasonable length)
        if (input.value.length < 4) {
            input.value += value;
        }
    }

    // Visual feedback
    button.classList.add('pressed');

    // Remove focus to prevent stuck state on mobile
    button.blur();

    // Remove pressed class after animation
    setTimeout(() => {
        button.classList.remove('pressed');
    }, 150);
}

/**
 * Show feedback message
 */
function showFeedback(message, type) {
    const feedbackText = elements.feedback.querySelector('.feedback-text');
    feedbackText.textContent = message;

    elements.feedback.classList.remove('show', 'goal', 'miss');
    void elements.feedback.offsetWidth; // Force reflow
    elements.feedback.classList.add('show', type);

    // Hide after delay
    setTimeout(() => {
        elements.feedback.classList.remove('show');
    }, 700);
}

// ========================================
// TIMER
// ========================================

function startTimer() {
    gameState.timeRemaining = CONFIG.gameDuration;
    updateTimerDisplay();

    gameState.timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        updateTimerDisplay();

        if (gameState.timeRemaining <= 0) {
            endGame();
        }
    }, 1000);
}

function updateTimerDisplay() {
    elements.timerDisplay.textContent = formatTime(gameState.timeRemaining);

    // Warning state when time is low
    if (gameState.timeRemaining <= 10) {
        elements.timerDisplay.classList.add('warning');
    } else {
        elements.timerDisplay.classList.remove('warning');
    }
}

function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

/**
 * Load cards from local storage and merge with current session
 */
function loadAndMergeCards() {
    const saved = localStorage.getItem('soccerMathCards');
    return saved ? JSON.parse(saved) : [];
}

/**
 * Save collected cards to local storage
 */
function saveCollectedCards() {
    localStorage.setItem('soccerMathCards', JSON.stringify(gameState.collectedCards));
}

// ========================================
// GAME FLOW
// ========================================

function startGame() {
    // Route to World Cup if selected
    if (gameState.gameMode === 'worldcup') {
        startWorldCup();
        return;
    }

    // Save session start index for quit functionality
    gameState.sessionStartIndex = gameState.collectedCards.length;

    // Set input mode based on game mode
    gameState.inputMode = gameState.gameMode === 'practice' ? 'choice' : 'typing';

    // Reset game state
    gameState.isPlaying = true;
    gameState.score = 0;
    gameState.streak = 0;
    gameState.bestStreak = 0;
    gameState.currentLevel = gameState.startingLevel; // Use selected starting level
    gameState.totalQuestions = 0;
    gameState.correctAnswers = 0;
    // gameState.collectedCards is NOT reset - it persists across sessions

    // Clear missed questions for fresh start (prevent old data from blocking level-ups)
    saveMissedQuestions({});

    // Reset streak bonus trackers
    lastBonusStreak = 0;
    lastPracticeRewardStreak = 0;

    // Reset UI
    elements.scoreDisplay.textContent = '0';
    elements.streakDisplay.textContent = '0';
    elements.streakFire.classList.remove('active');
    const startLevelConfig = gameState.operationType === 'fractions' ? CONFIG.fractionLevels : CONFIG.levels;
    elements.levelText.textContent = startLevelConfig[gameState.startingLevel].name;
    elements.levelDots.forEach((dot, index) => {
        dot.classList.toggle('active', index < gameState.startingLevel);
    });
    elements.timerDisplay.classList.remove('warning', 'practice');

    // Hide WC banner for non-WC modes
    if (elements.wcMatchBanner) elements.wcMatchBanner.style.display = 'none';

    // Configure for practice vs tournament mode
    if (gameState.gameMode === 'practice') {
        // Practice mode: show Done button, hide timer, hide Quit button
        elements.timerSection.style.display = 'none';
        elements.doneBtn.style.display = 'block';
        elements.quitBtn.style.display = 'none';
        elements.timerDisplay.textContent = '∞';
    } else {
        // Tournament mode: show timer, hide Done button, show Quit button
        elements.timerSection.style.display = 'block';
        elements.doneBtn.style.display = 'none';
        elements.quitBtn.style.display = 'block';
    }

    // Show game screen
    showScreen('game-screen');

    // Start game
    showQuestion();

    // Only start timer in tournament mode
    if (gameState.gameMode === 'tournament') {
        startTimer();
    }
}

function endGame() {
    gameState.isPlaying = false;
    stopTimer();

    // Calculate final stats
    const accuracy = gameState.totalQuestions > 0
        ? Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100)
        : 0;

    // Check for new high score
    const isNewRecord = saveHighScore(gameState.score);

    // Save collected cards (only on successful finish)
    saveCollectedCards();

    // Update game over screen
    elements.finalScore.textContent = gameState.score;
    elements.finalStreak.textContent = gameState.bestStreak;
    elements.finalAccuracy.textContent = `${accuracy}%`;

    elements.quitBtn.style.display = 'none';

    if (isNewRecord) {
        elements.newRecord.classList.add('show');
    } else {
        elements.newRecord.classList.remove('show');
    }

    // Display collected cards
    displayCollectedCards();

    // Show game over screen
    showScreen('gameover-screen');
}

/**
 * Display collected cards in game over screen
 */
function displayCollectedCards() {
    const cards = gameState.collectedCards;

    if (cards.length === 0) {
        elements.myCardsSection.classList.remove('show');
        return;
    }

    // Build card HTML
    elements.myCardsGrid.innerHTML = cards.map(card => `
        <div class="collected-card rarity-${card.rarity}">
            <span class="collected-card-emoji">${card.emoji}</span>
            <span class="collected-card-name">${card.name}</span>
        </div>
    `).join('');

    elements.myCardsSection.classList.add('show');
}

function goHome() {
    loadHighScore(); // Refresh displayed high score
    showScreen('start-screen');
}

/**
 * Quit Logic
 */
function quitGame() {
    elements.quitModal.classList.add('show');
}

function closeQuitModal() {
    elements.quitModal.classList.remove('show');
}

function confirmQuit() {
    // Revert cards to state before session started
    gameState.collectedCards = gameState.collectedCards.slice(0, gameState.sessionStartIndex);

    closeQuitModal();
    gameState.isPlaying = false;
    stopTimer();
    if (wcState.penaltyTimerId) { clearInterval(wcState.penaltyTimerId); wcState.penaltyTimerId = null; }
    goHome();
}

// ========================================
// WORLD CUP MODE
// ========================================

/**
 * Start World Cup mode — show country selection
 */
function startWorldCup() {
    // Populate country grid
    elements.countryGrid.innerHTML = '';
    CONFIG.worldCup.countries.forEach(country => {
        const btn = document.createElement('button');
        btn.className = 'country-btn';
        btn.innerHTML = `<span class="country-flag">${country.emoji}</span><span class="country-name">${country.name}</span>`;
        btn.addEventListener('click', () => selectCountry(country));
        elements.countryGrid.appendChild(btn);
    });

    showScreen('country-select-screen');
}

/**
 * Player selects a country — generate opponents and start round 1
 */
function selectCountry(country) {
    wcState.playerCountry = country;
    wcState.currentRound = 0;
    wcState.cleanSheetRounds = [];
    wcState.wcCards = [];
    wcState.totalGoals = 0;
    wcState.totalQuestions = 0;

    // Generate 4 random opponents (different from player)
    const available = CONFIG.worldCup.countries.filter(c => c.name !== country.name);
    wcState.opponents = [];
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    for (let i = 0; i < 4; i++) {
        wcState.opponents.push(shuffled[i]);
    }

    // Save session start index
    gameState.sessionStartIndex = gameState.collectedCards.length;

    startWCRound();
}

/**
 * Start a World Cup round
 */
function startWCRound() {
    const round = CONFIG.worldCup.rounds[wcState.currentRound];
    const opponent = wcState.opponents[wcState.currentRound];

    // Reset round tracking
    wcState.roundScore = 0;
    wcState.roundQuestionIndex = 0;
    wcState.isPenalty = false;

    // Set difficulty level based on round
    // Set difficulty level based on round
    // Group: Level 1, Ro16/Quarters: Level 2, Semis/Final: Level 3
    if (wcState.currentRound === 0) {
        gameState.currentLevel = 1;
    } else if (wcState.currentRound <= 2) {
        gameState.currentLevel = 2;
    } else {
        gameState.currentLevel = 3;
    }

    // Reset game state for this round
    gameState.isPlaying = true;
    gameState.inputMode = 'typing';
    gameState.score = 0;
    gameState.streak = 0;
    gameState.bestStreak = 0;
    gameState.totalQuestions = 0;
    gameState.correctAnswers = 0;

    // Reset streak trackers
    lastBonusStreak = 0;
    lastPracticeRewardStreak = 0;

    // Clear missed questions
    saveMissedQuestions({});

    // Update UI
    elements.scoreDisplay.textContent = '0';
    elements.streakDisplay.textContent = '0';
    elements.streakFire.classList.remove('active');
    elements.timerDisplay.classList.remove('warning', 'practice');

    // Hide timer, done button — WC has no global timer
    elements.timerSection.style.display = 'none';
    elements.doneBtn.style.display = 'none';
    elements.quitBtn.style.display = 'block';

    // Show WC match banner
    elements.wcMatchBanner.style.display = 'block';
    elements.wcRoundName.textContent = round.name;
    elements.wcPlayerFlag.textContent = wcState.playerCountry.emoji;
    elements.wcPlayerName.textContent = wcState.playerCountry.name;
    elements.wcOpponentFlag.textContent = opponent.emoji;
    elements.wcOpponentName.textContent = opponent.name;
    elements.wcScoreDisplay.textContent = `Goals: 0`;
    elements.wcQuestionCounter.textContent = `Q 1/${round.questions}`;
    elements.wcTargetDisplay.textContent = `Need: ${round.required}`;

    // Set level display
    const levelConfig = gameState.operationType === 'fractions' ? CONFIG.fractionLevels : CONFIG.levels;
    elements.levelText.textContent = levelConfig[round.level].name;
    elements.levelDots.forEach((dot, index) => {
        dot.classList.toggle('active', index < round.level);
    });

    // Hide penalty overlay
    elements.wcPenaltyOverlay.style.display = 'none';

    // Show game screen
    showScreen('game-screen');
    showQuestion();
}

/**
 * Handle answer tracking for World Cup mode
 * Called after each question is answered (from the delay timeout)
 */
function handleWCAnswer(isCorrect) {
    if (wcState.isPenalty) {
        handlePenaltyAnswer(isCorrect);
        return;
    }

    const round = CONFIG.worldCup.rounds[wcState.currentRound];

    // Track the answer
    if (isCorrect) {
        wcState.roundScore++;
        wcState.totalGoals++;
    }
    wcState.roundQuestionIndex++;
    wcState.totalQuestions++;

    // Update WC HUD
    elements.wcScoreDisplay.textContent = `Goals: ${wcState.roundScore}`;
    elements.wcQuestionCounter.textContent = `Q ${Math.min(wcState.roundQuestionIndex + 1, round.questions)}/${round.questions}`;

    // Check if round is complete
    if (wcState.roundQuestionIndex >= round.questions) {
        endWCRound();
    } else {
        showQuestion();
    }
}

/**
 * End current WC round — evaluate result
 */
function endWCRound() {
    gameState.isPlaying = false;
    const round = CONFIG.worldCup.rounds[wcState.currentRound];
    const opponent = wcState.opponents[wcState.currentRound];
    const score = wcState.roundScore;

    // Check for clean sheet (100% accuracy)
    if (score === round.questions) {
        wcState.cleanSheetRounds.push(wcState.currentRound);
    }

    // Update result screen
    elements.wcResultPlayer.textContent = `${wcState.playerCountry.emoji} ${wcState.playerCountry.name}`;
    elements.wcResultOpponent.textContent = `${opponent.name} ${opponent.emoji}`;
    elements.wcResultScore.textContent = score;
    elements.wcResultTarget.textContent = round.required;

    if (score >= round.required) {
        // ADVANCE
        elements.wcResultTitle.textContent = `\u2705 Victory!`;
        elements.wcResultMessage.textContent = `You advance to the ${wcState.currentRound < 3 ? CONFIG.worldCup.rounds[wcState.currentRound + 1].name : 'Champion'}!`;
        elements.wcResultContinue.textContent = 'Continue \u2192';
        elements.wcResultContinue.onclick = () => advanceWCRound();

        // Award cards for this result
        awardRoundCards();

    } else if (score === round.drawScore) {
        // DRAW — Penalty Shootout
        elements.wcResultTitle.textContent = `\ud83d\udfe1 It\u2019s a Draw!`;
        elements.wcResultMessage.textContent = 'Penalty Shootout incoming!';
        elements.wcResultContinue.textContent = 'Penalty Shootout \u26bd';
        elements.wcResultContinue.onclick = () => startPenaltyShootout();

    } else {
        // ELIMINATED
        elements.wcResultTitle.textContent = `\u274c Defeated`;
        elements.wcResultMessage.textContent = `You needed ${round.required} goals but only scored ${score}.`;
        elements.wcResultContinue.textContent = 'View Results';
        elements.wcResultContinue.onclick = () => showWCEliminated();
    }

    // Show round result cards if any were earned this round
    displayWCResultCards(elements.wcResultCards, wcState.wcCards);

    showScreen('wc-round-result');
}

/**
 * Award milestone cards based on current round advancement
 */
function awardRoundCards() {
    const round = CONFIG.worldCup.rounds[wcState.currentRound];

    // Clean sheet bonus — Golden Gloves card
    if (wcState.roundScore === round.questions) {
        const goldenGloves = {
            name: 'Golden Gloves',
            fullName: 'Golden Gloves Award',
            team: wcState.playerCountry.name,
            emoji: '\ud83e\udde4',
            rarity: 3,
            stats: { PAC: 70, SHO: 40, PAS: 75, DRI: 65, DEF: 96, PHY: 90 }
        };
        wcState.wcCards.push(goldenGloves);
        gameState.collectedCards.push(goldenGloves);
    }

    // Advancing to Semi-Finals — National Star card
    if (wcState.currentRound === 2) { // Advancing FROM QF (index 2) TO SF
        const nationalStar = {
            name: `${wcState.playerCountry.name} Star`,
            fullName: `${wcState.playerCountry.name} National Star`,
            team: wcState.playerCountry.name,
            emoji: wcState.playerCountry.emoji,
            rarity: 2,
            stats: { PAC: 88, SHO: 85, PAS: 82, DRI: 87, DEF: 60, PHY: 78 }
        };
        wcState.wcCards.push(nationalStar);
        gameState.collectedCards.push(nationalStar);
    }
}

/**
 * Advance to the next World Cup round
 */
function advanceWCRound() {
    wcState.currentRound++;

    if (wcState.currentRound >= CONFIG.worldCup.rounds.length) {
        // Won the World Cup!
        showWCChampion();
    } else {
        startWCRound();
    }
}

// ----------------------------------------
// PENALTY SHOOTOUT
// ----------------------------------------

function startPenaltyShootout() {
    wcState.isPenalty = true;
    wcState.penaltyScore = 0;
    wcState.penaltyQuestionIndex = 0;

    gameState.isPlaying = true;
    gameState.inputMode = 'typing';

    // Set to easiest level for penalty
    gameState.currentLevel = 1;

    // Show penalty overlay
    elements.wcPenaltyOverlay.style.display = 'flex';
    elements.wcPenaltyScore.textContent = `Goals: 0/${CONFIG.worldCup.penalty.questions}`;
    elements.wcPenaltyTimer.textContent = CONFIG.worldCup.penalty.timePerQuestion;

    // Show game screen with penalty overlay
    // Show game screen with penalty overlay
    showScreen('game-screen');
    elements.wcMatchBanner.style.display = 'block';

    // Show warning about timed kicks
    const originalText = elements.wcMatchBanner.innerHTML;
    const warningMsg = document.createElement('div');
    warningMsg.innerHTML = '<div style="background: #f87171; color: white; padding: 10px; text-align: center; border-radius: 8px; margin: 10px 0; font-weight: bold; animation: pulse 1s infinite;">⚠️ TIMED KICKS! 6 SECONDS! ⚠️</div>';

    // Insert warning before the banner content
    elements.wcMatchBanner.parentNode.insertBefore(warningMsg, elements.wcMatchBanner);

    // Remove warning after 3 seconds and start
    setTimeout(() => {
        warningMsg.remove();
        showPenaltyQuestion();
    }, 3000);
}

function showPenaltyQuestion() {
    // Clear any existing timer
    if (wcState.penaltyTimerId) {
        clearInterval(wcState.penaltyTimerId);
        wcState.penaltyTimerId = null;
    }

    if (wcState.penaltyQuestionIndex >= CONFIG.worldCup.penalty.questions) {
        endPenaltyShootout();
        return;
    }

    // Generate a simpler question (always Level 1, never fractions during penalty)
    const savedOp = gameState.operationType;
    if (gameState.operationType === 'fractions') {
        // Use multiplication for penalty — simpler and faster
        gameState.operationType = 'multiplication';
    }
    gameState.currentLevel = 1;

    showQuestion();

    // Restore original operation type immediately after generation 
    // (so game logic doesn't get confused, but we used the temp one for generation)
    gameState.operationType = savedOp;

    // Start per-question timer
    let timeLeft = CONFIG.worldCup.penalty.timePerQuestion;
    elements.wcPenaltyTimer.textContent = timeLeft;

    if (wcState.penaltyTimerId) clearInterval(wcState.penaltyTimerId);
    wcState.penaltyTimerId = setInterval(() => {
        timeLeft--;
        elements.wcPenaltyTimer.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(wcState.penaltyTimerId);
            wcState.penaltyTimerId = null;
            // Time's up — count as a miss
            penaltyTimedOut();
        }
    }, 1000);
}

function penaltyTimedOut() {
    // Show miss feedback
    showFeedback('Time\'s up! Save by the keeper!', 'miss');
    elements.ball.classList.remove('kick', 'miss');
    void elements.ball.offsetWidth;
    elements.ball.classList.add('miss');

    wcState.penaltyQuestionIndex++;
    elements.wcPenaltyScore.textContent = `Goals: ${wcState.penaltyScore}/${CONFIG.worldCup.penalty.questions}`;

    // Clear timer to prevent double-firing
    if (wcState.penaltyTimerId) {
        clearInterval(wcState.penaltyTimerId);
        wcState.penaltyTimerId = null;
    }

    setTimeout(() => {
        // Show next kick prompt instead of auto-advancing
        showNextKickPrompt();
    }, 1500);
}

function handlePenaltyAnswer(isCorrect) {
    // Clear penalty timer immediately
    if (wcState.penaltyTimerId) {
        clearInterval(wcState.penaltyTimerId);
        wcState.penaltyTimerId = null;
    }

    if (isCorrect) {
        wcState.penaltyScore++;
    }
    wcState.penaltyQuestionIndex++;

    elements.wcPenaltyScore.textContent = `Goals: ${wcState.penaltyScore}/${CONFIG.worldCup.penalty.questions}`;

    if (wcState.penaltyQuestionIndex >= CONFIG.worldCup.penalty.questions) {
        endPenaltyShootout();
    } else {
        // Show next kick prompt instead of auto-advancing
        setTimeout(() => {
            showNextKickPrompt();
        }, 1500);
    }
}

/**
 * Show prompt to proceed to next kick
 */
function showNextKickPrompt() {
    // Hide keyboard/inputs
    if (elements.typingArea) elements.typingArea.style.display = 'none';
    if (elements.answersGrid) elements.answersGrid.style.display = 'none';
    if (elements.numberPad) elements.numberPad.style.display = 'none';

    // Create or show button in feedback area
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-primary';
    nextBtn.style.margin = '20px auto';
    nextBtn.style.display = 'block';
    nextBtn.style.fontSize = '1.2rem';
    nextBtn.textContent = '⚽ Next Kick';

    nextBtn.onclick = function () {
        nextBtn.remove();
        // Restore input visibility happens in showQuestion() calling handleTypedAnswer/showKeyboard
        showPenaltyQuestion();
    };

    // Clear feedback content and append button
    elements.feedback.innerHTML = '';
    elements.feedback.appendChild(nextBtn);
    elements.feedback.classList.add('show');
}

function endPenaltyShootout() {
    // Ensure timer is dead
    if (wcState.penaltyTimerId) {
        clearInterval(wcState.penaltyTimerId);
        wcState.penaltyTimerId = null;
    }

    gameState.isPlaying = false;
    elements.wcPenaltyOverlay.style.display = 'none';

    const won = wcState.penaltyScore >= CONFIG.worldCup.penalty.requiredCorrect;
    const round = CONFIG.worldCup.rounds[wcState.currentRound];
    const opponent = wcState.opponents[wcState.currentRound];

    elements.wcResultPlayer.textContent = `${wcState.playerCountry.emoji} ${wcState.playerCountry.name}`;
    elements.wcResultOpponent.textContent = `${opponent.name} ${opponent.emoji}`;
    elements.wcResultScore.textContent = `${wcState.penaltyScore}`;
    elements.wcResultTarget.textContent = `${CONFIG.worldCup.penalty.requiredCorrect}`;

    if (won) {
        elements.wcResultTitle.textContent = `\u2705 Penalty Win!`;
        elements.wcResultMessage.textContent = `You scored ${wcState.penaltyScore}/${CONFIG.worldCup.penalty.questions} penalties!`;
        elements.wcResultContinue.textContent = 'Continue \u2192';
        elements.wcResultContinue.onclick = () => {
            awardRoundCards();
            advanceWCRound();
        };
    } else {
        elements.wcResultTitle.textContent = `\u274c Penalty Heartbreak`;
        elements.wcResultMessage.textContent = `You scored ${wcState.penaltyScore}/${CONFIG.worldCup.penalty.questions}. Needed ${CONFIG.worldCup.penalty.requiredCorrect}.`;
        elements.wcResultContinue.textContent = 'View Results';
        elements.wcResultContinue.onclick = () => showWCEliminated();
    }

    displayWCResultCards(elements.wcResultCards, wcState.wcCards);
    showScreen('wc-round-result');
}

// ----------------------------------------
// WORLD CUP FINAL SCREENS
// ----------------------------------------

function showWCChampion() {
    // Award champion cards
    const championCard = {
        name: 'WC Champion',
        fullName: `${wcState.playerCountry.name} World Cup Champion`,
        team: wcState.playerCountry.name,
        emoji: '\ud83c\udfc6',
        rarity: 3,
        stats: { PAC: 95, SHO: 95, PAS: 95, DRI: 95, DEF: 85, PHY: 90 }
    };
    wcState.wcCards.push(championCard);
    gameState.collectedCards.push(championCard);

    // Award 3 mythical or godly cards
    const highTierCards = [
        ...CONFIG.characterCards.mythical,
        ...CONFIG.characterCards.godly
    ];
    for (let i = 0; i < 3; i++) {
        const card = { ...highTierCards[Math.floor(Math.random() * highTierCards.length)] };
        wcState.wcCards.push(card);
        gameState.collectedCards.push(card);
    }

    // Save cards
    saveCollectedCards();

    // Populate champion screen
    elements.wcFinalIcon.textContent = '\ud83c\udfc6';
    elements.wcFinalTitle.textContent = 'World Cup Champion!';
    elements.wcFinalCountry.textContent = `${wcState.playerCountry.emoji} ${wcState.playerCountry.name}`;
    elements.wcFinalStats.innerHTML = `
        <div class="wc-stat"><span class="stat-icon">\u26bd</span> <strong>${wcState.totalGoals}</strong> Total Goals</div>
        <div class="wc-stat"><span class="stat-icon">\ud83c\udfaf</span> <strong>${wcState.totalQuestions}</strong> Questions</div>
        <div class="wc-stat"><span class="stat-icon">\ud83e\udde4</span> <strong>${wcState.cleanSheetRounds.length}</strong> Clean Sheets</div>
    `;

    displayWCResultCards(elements.wcFinalCards, wcState.wcCards);
    showScreen('wc-final-screen');
}

function showWCEliminated() {
    const round = CONFIG.worldCup.rounds[wcState.currentRound];

    // Save any cards earned so far
    saveCollectedCards();

    elements.wcFinalIcon.textContent = '\ud83d\ude14';
    elements.wcFinalTitle.textContent = 'Eliminated';
    elements.wcFinalCountry.textContent = `${wcState.playerCountry.emoji} ${wcState.playerCountry.name}`;
    elements.wcFinalStats.innerHTML = `
        <div class="wc-stat"><span>Eliminated in the </span><strong>${round.name}</strong></div>
        <div class="wc-stat"><span class="stat-icon">\u26bd</span> <strong>${wcState.totalGoals}</strong> Total Goals</div>
        <div class="wc-stat"><span class="stat-icon">\ud83c\udfaf</span> <strong>${wcState.totalQuestions}</strong> Questions</div>
    `;

    displayWCResultCards(elements.wcFinalCards, wcState.wcCards);
    showScreen('wc-final-screen');
}

/**
 * Display earned cards in a WC result container
 */
function displayWCResultCards(container, cards) {
    container.innerHTML = '';
    if (cards.length === 0) return;

    const title = document.createElement('h3');
    title.textContent = '\ud83c\udccf Cards Earned';
    title.className = 'wc-cards-title';
    container.appendChild(title);

    cards.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = `wc-card-item rarity-${card.rarity}`;
        cardEl.innerHTML = `<span class="wc-card-emoji">${card.emoji}</span><span class="wc-card-name">${card.name}</span>`;
        container.appendChild(cardEl);
    });
}

// ========================================
// EVENT LISTENERS
// ========================================

function initEventListeners() {
    // Start button
    elements.startBtn.addEventListener('click', startGame);

    // Quit buttons
    elements.quitBtn.addEventListener('click', quitGame);
    elements.cancelQuitBtn.addEventListener('click', closeQuitModal);
    elements.confirmQuitBtn.addEventListener('click', confirmQuit);

    // Answer buttons (multiple choice)
    elements.answerBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => handleAnswer(index));
    });

    // Typing mode - submit button
    elements.submitAnswerBtn.addEventListener('click', handleTypedAnswer);

    // Typing mode - enter key
    elements.answerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleTypedAnswer();
        }
    });

    // Number pad buttons
    elements.numBtns.forEach(btn => {
        btn.addEventListener('click', handleNumberPadClick);
    });

    // Physical keyboard input for tournament mode (PC only)
    document.addEventListener('keydown', (e) => {
        // Only handle during active tournament typing mode
        if (!gameState.isPlaying || gameState.inputMode !== 'typing') return;

        // Don't handle if an overlay is visible
        if (elements.luckyBlockOverlay.classList.contains('show') ||
            elements.streakWheelOverlay.classList.contains('show') ||
            elements.quitModal.classList.contains('show')) return;

        // Don't handle if input is disabled (answer already submitted)
        if (elements.answerInput.disabled) return;

        const input = elements.answerInput;

        // Digit keys (main keyboard and numpad)
        if ((e.key >= '0' && e.key <= '9')) {
            e.preventDefault();
            if (input.value.length < 4) {
                input.value += e.key;
            }
        }
        // Backspace
        else if (e.key === 'Backspace') {
            e.preventDefault();
            input.value = input.value.slice(0, -1);
        }
        // Enter - submit answer
        else if (e.key === 'Enter') {
            e.preventDefault();
            handleTypedAnswer();
        }
    });

    // Done button (practice mode)
    elements.doneBtn.addEventListener('click', endGame);

    // Lucky block overlay - tap to close
    elements.luckyBlockOverlay.addEventListener('click', closeLuckyBlockOverlay);

    // Streak bonus wheel overlay - tap to spin or close
    elements.streakWheelOverlay.addEventListener('click', () => {
        if (isWheelReadyToSpin) {
            isWheelReadyToSpin = false;
            // Update subtitle
            const subtitle = document.querySelector('.wheel-subtitle');
            if (subtitle) {
                subtitle.textContent = 'Spinning...';
            }
            spinBonusWheel();
        } else {
            closeStreakBonusWheel();
        }
    });

    // Game over buttons
    elements.playAgainBtn.addEventListener('click', startGame);
    elements.homeBtn.addEventListener('click', goHome);

    // Gallery buttons
    elements.viewCardsBtn.addEventListener('click', showGalleryScreen);
    elements.galleryHomeBtn.addEventListener('click', goHome);

    // World Cup buttons
    if (elements.countryBackBtn) {
        elements.countryBackBtn.addEventListener('click', goHome);
    }
    if (elements.wcPlayAgainBtn) {
        elements.wcPlayAgainBtn.addEventListener('click', () => {
            gameState.gameMode = 'worldcup';
            startWorldCup();
        });
    }
    if (elements.wcHomeBtn) {
        elements.wcHomeBtn.addEventListener('click', goHome);
    }
}

// ========================================
// INITIALIZATION
// ========================================

function init() {
    initMusic();
    initModeToggles();
    loadHighScore();
    initEventListeners();
    initSettings();
    showScreen('start-screen');
}

// Settings Management
function initSettings() {
    // Load saved timer setting
    const savedTimer = localStorage.getItem('soccermath_timer');
    if (savedTimer && elements.timerSelect) {
        elements.timerSelect.value = savedTimer;
        CONFIG.gameDuration = parseInt(savedTimer, 10);
    }

    // Load saved starting level setting
    const savedLevel = localStorage.getItem('soccermath_startingLevel');
    if (savedLevel && elements.levelSelect) {
        elements.levelSelect.value = savedLevel;
        gameState.startingLevel = parseInt(savedLevel, 10);
    }

    // Settings button opens modal (in-game)
    if (elements.settingsBtn) {
        elements.settingsBtn.addEventListener('click', () => {
            if (elements.settingsModal) {
                elements.settingsModal.classList.add('show');
            }
        });
    }

    // Settings button opens modal (start screen)
    if (elements.startSettingsBtn) {
        elements.startSettingsBtn.addEventListener('click', () => {
            if (elements.settingsModal) {
                elements.settingsModal.classList.add('show');
            }
        });
    }

    // Save settings button
    if (elements.saveSettingsBtn) {
        elements.saveSettingsBtn.addEventListener('click', () => {
            // Save timer setting
            if (elements.timerSelect) {
                const timerValue = elements.timerSelect.value;
                localStorage.setItem('soccermath_timer', timerValue);
                CONFIG.gameDuration = parseInt(timerValue, 10);
            }
            // Save starting level setting
            if (elements.levelSelect) {
                const levelValue = elements.levelSelect.value;
                localStorage.setItem('soccermath_startingLevel', levelValue);
                gameState.startingLevel = parseInt(levelValue, 10);
            }
            if (elements.settingsModal) {
                elements.settingsModal.classList.remove('show');
            }
        });
    }

    // Close modal when clicking outside
    if (elements.settingsModal) {
        elements.settingsModal.addEventListener('click', (e) => {
            if (e.target === elements.settingsModal) {
                elements.settingsModal.classList.remove('show');
            }
        });
    }
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
