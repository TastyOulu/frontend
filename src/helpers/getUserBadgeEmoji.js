export const getUserBadgeEmoji = (score) => {
    if (score >= 4) return '👑';
    if (score >= 3) return '🥇';
    if (score >= 2) return '🥈';
    if (score >= 1) return '🥉';
    if (score >= 0) return '🌟';
    return '🕹️';
};
export default getUserBadgeEmoji;