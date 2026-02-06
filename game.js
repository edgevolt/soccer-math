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
            { name: 'Pele', fullName: 'Pelé', team: 'Santos FC', emoji: '🇧🇷', rarity: 3, stats: { PAC: 95, SHO: 96, PAS: 93, DRI: 96, DEF: 50, PHY: 76 } },
            { name: 'Maradona', fullName: 'Diego Maradona', team: 'Napoli', emoji: '🇦🇷', rarity: 3, stats: { PAC: 90, SHO: 94, PAS: 95, DRI: 98, DEF: 40, PHY: 75 } },
            { name: 'Messi', fullName: 'Lionel Messi', team: 'Inter Miami', emoji: '🇦🇷', rarity: 3, stats: { PAC: 80, SHO: 88, PAS: 92, DRI: 96, DEF: 34, PHY: 60 } },
            { name: 'Ronaldo', fullName: 'Cristiano Ronaldo', team: 'Al Nassr', emoji: '🇵🇹', rarity: 3, stats: { PAC: 83, SHO: 92, PAS: 78, DRI: 85, DEF: 34, PHY: 75 } },
            { name: 'Zidane', fullName: 'Zinedine Zidane', team: 'Real Madrid', emoji: '🇫🇷', rarity: 3, stats: { PAC: 82, SHO: 89, PAS: 96, DRI: 95, DEF: 70, PHY: 81 } },
            { name: 'Cruyff', fullName: 'Johan Cruyff', team: 'Ajax', emoji: '🇳🇱', rarity: 3, stats: { PAC: 91, SHO: 92, PAS: 93, DRI: 98, DEF: 42, PHY: 70 } },
            { name: 'R9', fullName: 'Ronaldo Nazário', team: 'Inter Milan', emoji: '🇧🇷', rarity: 3, stats: { PAC: 97, SHO: 95, PAS: 81, DRI: 95, DEF: 35, PHY: 76 } },
            { name: 'Ronaldinho', fullName: 'Ronaldinho', team: 'FC Barcelona', emoji: '🇧🇷', rarity: 3, stats: { PAC: 91, SHO: 90, PAS: 90, DRI: 98, DEF: 35, PHY: 78 } },
            { name: 'Maldini', fullName: 'Paolo Maldini', team: 'AC Milan', emoji: '🇮🇹', rarity: 3, stats: { PAC: 86, SHO: 55, PAS: 75, DRI: 70, DEF: 96, PHY: 85 } },
            { name: 'Beckenbauer', fullName: 'Franz Beckenbauer', team: 'Bayern Munich', emoji: '🇩🇪', rarity: 3, stats: { PAC: 82, SHO: 70, PAS: 90, DRI: 88, DEF: 94, PHY: 80 } },
            { name: 'Yashin', fullName: 'Lev Yashin', team: 'Dynamo Moscow', emoji: '🇷🇺', rarity: 3, stats: { PAC: 65, SHO: 40, PAS: 75, DRI: 70, DEF: 95, PHY: 88 } },
            { name: 'Platini', fullName: 'Michel Platini', team: 'Juventus', emoji: '🇫🇷', rarity: 3, stats: { PAC: 84, SHO: 90, PAS: 94, DRI: 92, DEF: 55, PHY: 72 } },
            { name: 'Best', fullName: 'George Best', team: 'Manchester United', emoji: '🇬🇧', rarity: 3, stats: { PAC: 93, SHO: 91, PAS: 86, DRI: 95, DEF: 45, PHY: 70 } },
            { name: 'Van Basten', fullName: 'Marco van Basten', team: 'AC Milan', emoji: '🇳🇱', rarity: 3, stats: { PAC: 86, SHO: 94, PAS: 78, DRI: 88, DEF: 40, PHY: 80 } },
            { name: 'Puskas', fullName: 'Ferenc Puskás', team: 'Real Madrid', emoji: '🇭🇺', rarity: 3, stats: { PAC: 85, SHO: 96, PAS: 90, DRI: 91, DEF: 40, PHY: 75 } },
            { name: 'Henry', fullName: 'Thierry Henry', team: 'Arsenal', emoji: '🇫🇷', rarity: 3, stats: { PAC: 94, SHO: 93, PAS: 83, DRI: 90, DEF: 53, PHY: 80 } },
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
    missMessages: ['Try again!', 'So close!', 'Keep going!', 'You got this!']
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
    gameMode: 'practice', // 'practice' or 'tournament'
    startingLevel: 1,
    timeRemaining: 90,
    timerInterval: null,
    collectedCards: loadAndMergeCards(), // Load existing cards from storage
    sessionStartIndex: 0 // Index in localStorage array where this session started
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
    wheelResult: document.getElementById('wheel-result')
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

const STREAK_MILESTONES = [15, 25, 35, 45];
let lastBonusStreak = 0;

/**
 * Check if current streak qualifies for a bonus wheel
 */
function checkStreakBonus() {
    // Only in tournament mode at level 3
    if (gameState.gameMode !== 'tournament' || gameState.currentLevel !== 3) {
        return false;
    }

    const currentStreak = gameState.streak;

    // Check if we've hit a new milestone
    for (const milestone of STREAK_MILESTONES) {
        if (currentStreak === milestone && lastBonusStreak < milestone) {
            lastBonusStreak = milestone;
            showStreakBonusWheel();
            return true;
        }
    }
    return false;
}

/**
 * Show the streak bonus wheel
 */
function showStreakBonusWheel() {
    elements.streakWheelOverlay.classList.add('show');

    // Auto-spin after a brief delay
    setTimeout(() => {
        spinBonusWheel();
    }, 1000);
}

/**
 * Spin the bonus wheel and award a card
 */
function spinBonusWheel() {
    // Determine which tier to award
    // Legendary: 60%, Mythical: 25%, Godly: 15%
    const tierRoll = Math.random();
    let targetTier, targetRotation;

    if (tierRoll < 0.60) {
        targetTier = 'legendary';
        targetRotation = 0; // Points to legendary segment
    } else if (tierRoll < 0.85) {
        targetTier = 'mythical';
        targetRotation = 120; // Points to mythical segment
    } else {
        targetTier = 'godly';
        targetRotation = 240; // Points to godly segment
    }

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
    // Operation toggle (multiplication / division)
    const operationBtns = elements.operationToggle.querySelectorAll('.toggle-btn');
    operationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            operationBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            gameState.operationType = btn.dataset.value;
            loadHighScore(); // Update high score for selected mode
        });
    });

    // Game mode toggle (practice / tournament)
    const gameModeBtns = elements.gameModeToggle.querySelectorAll('.toggle-btn');
    gameModeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            gameModeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            gameState.gameMode = btn.dataset.value;
            // Set input mode based on game mode
            gameState.inputMode = btn.dataset.value === 'practice' ? 'choice' : 'typing';
            updateGameModeHint();
        });
    });
}


/**
 * Update the game mode hint text
 */
function updateGameModeHint() {
    if (gameState.gameMode === 'practice') {
        elements.gameModeHint.textContent = 'Multiple choice • No timer';
    } else {
        elements.gameModeHint.textContent = 'Type answers • 10 minutes';
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
// SCREEN MANAGEMENT
// ========================================

function showScreen(screenId) {
    // Hide all screens
    elements.startScreen.classList.remove('active');
    elements.gameScreen.classList.remove('active');
    elements.gameoverScreen.classList.remove('active');
    elements.galleryScreen.classList.remove('active');

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
    let newLevel = gameState.startingLevel; // Never go below starting level

    if (gameState.correctAnswers >= CONFIG.levels[3].minCorrect) {
        newLevel = 3;
    } else if (gameState.correctAnswers >= CONFIG.levels[2].minCorrect) {
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
        elements.levelText.textContent = CONFIG.levels[newLevel].name;
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
function generateMultiplicationQuestion() {
    const level = CONFIG.levels[gameState.currentLevel];
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
    // Check if we should show a missed question (50% chance)
    const missedQuestion = getRandomMissedQuestion();

    if (missedQuestion && Math.random() < CONFIG.reinforcementProbability) {
        // Use the missed question
        const { num1, operator, num2 } = missedQuestion;
        let correctAnswer, distractors;

        if (operator === '×') {
            correctAnswer = num1 * num2;
            distractors = generateMultiplicationDistractors(correctAnswer, num1, num2);
        } else {
            correctAnswer = num1 / num2;
            distractors = generateDivisionDistractors(correctAnswer, num1, num2);
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
 * Display a new question
 */
function showQuestion() {
    gameState.currentQuestion = generateQuestion();
    gameState.currentAttempts = 0; // Reset attempts for new question
    const q = gameState.currentQuestion;

    // Update question display
    elements.num1.textContent = q.num1;
    elements.num2.textContent = q.num2;
    elements.operator.textContent = q.operator;

    if (gameState.inputMode === 'choice') {
        // Multiple choice mode
        elements.answersGrid.style.display = 'grid';
        elements.typingArea.style.display = 'none';

        // Update answer buttons
        elements.answerBtns.forEach((btn, index) => {
            btn.textContent = q.answers[index];
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

        // Prevent native keyboard on mobile
        elements.answerInput.setAttribute('readonly', 'readonly');
    }

    // Reset feedback
    elements.feedback.classList.remove('show', 'goal', 'miss');
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
        const didLevelUp = handleCorrectAnswer(selectedIndex);

        // Also check if we'll hit a streak bonus milestone at level 3
        const isStreakBonus = gameState.gameMode === 'tournament' &&
            gameState.currentLevel === 3 &&
            STREAK_MILESTONES.includes(gameState.streak) &&
            lastBonusStreak < gameState.streak;

        willShowOverlay = didLevelUp || isStreakBonus;
    } else {
        handleIncorrectAnswer(selectedIndex, correctIndex);
    }

    // Show next question after delay (longer for incorrect so they can see the answer)
    // BUT skip if level-up will show an overlay (it will handle next question)
    if (!willShowOverlay) {
        const delay = isCorrect ? 800 : 2000;
        setTimeout(() => {
            if (gameState.isPlaying) {
                showQuestion();
            }
        }, delay);
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

    const typedAnswer = parseInt(typedValue, 10);
    const isCorrect = typedAnswer === q.correctAnswer;

    gameState.totalQuestions++;

    // Disable input temporarily
    elements.answerInput.disabled = true;
    elements.submitAnswerBtn.disabled = true;

    // Track if we'll need to wait for an overlay
    let willShowOverlay = false;

    if (isCorrect) {
        const didLevelUp = handleCorrectTypedAnswer();

        // Also check if we'll hit a streak bonus milestone at level 3
        const isStreakBonus = gameState.gameMode === 'tournament' &&
            gameState.currentLevel === 3 &&
            STREAK_MILESTONES.includes(gameState.streak) &&
            lastBonusStreak < gameState.streak;

        willShowOverlay = didLevelUp || isStreakBonus;
    } else {
        handleIncorrectTypedAnswer();
    }

    // Show next question after delay (longer for incorrect so they can see the answer)
    // BUT skip if level-up will show an overlay (it will handle next question)
    if (!willShowOverlay) {
        const delay = isCorrect ? 800 : 2000;
        setTimeout(() => {
            if (gameState.isPlaying) {
                showQuestion();
            }
        }, delay);
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

    // Check for level up
    const didLevelUp = updateLevel();

    // Return whether we leveled up so the caller knows not to auto-advance
    return didLevelUp;
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

    // Return whether we leveled up so the caller knows not to auto-advance
    return didLevelUp;
}

/**
 * Handle incorrect answer (multiple choice)
 */
function handleIncorrectAnswer(buttonIndex, correctIndex) {
    gameState.streak = 0;

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

    // Add this question to the missed pool for reinforcement
    const q = gameState.currentQuestion;
    addMissedQuestion(q.num1, q.num2, q.operator);

    // Update streak display
    elements.streakDisplay.textContent = gameState.streak;
    elements.streakFire.classList.remove('active');

    // Input feedback - show correct answer
    elements.answerInput.classList.add('incorrect');
    elements.answerInput.value = gameState.currentQuestion.correctAnswer;

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

    // Reset streak bonus tracker
    lastBonusStreak = 0;

    // Reset UI
    elements.scoreDisplay.textContent = '0';
    elements.streakDisplay.textContent = '0';
    elements.streakFire.classList.remove('active');
    elements.levelText.textContent = CONFIG.levels[gameState.startingLevel].name;
    elements.levelDots.forEach((dot, index) => {
        dot.classList.toggle('active', index < gameState.startingLevel);
    });
    elements.timerDisplay.classList.remove('warning', 'practice');

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
    goHome();
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

    // Done button (practice mode)
    elements.doneBtn.addEventListener('click', endGame);

    // Lucky block overlay - tap to close
    elements.luckyBlockOverlay.addEventListener('click', closeLuckyBlockOverlay);

    // Streak bonus wheel overlay - tap to close
    elements.streakWheelOverlay.addEventListener('click', closeStreakBonusWheel);

    // Game over buttons
    elements.playAgainBtn.addEventListener('click', startGame);
    elements.homeBtn.addEventListener('click', goHome);

    // Gallery buttons
    elements.viewCardsBtn.addEventListener('click', showGalleryScreen);
    elements.galleryHomeBtn.addEventListener('click', goHome);
}

// ========================================
// INITIALIZATION
// ========================================

function init() {
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
