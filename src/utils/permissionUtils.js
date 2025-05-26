export function hasPermission(userLevel, userRole, requiredLevel = null, requiredRoles = []) {
    const levelHierarchy = ["Company", "Branch", "Site", "Substation", "Transformer"];
    const userLevelIndex = levelHierarchy.indexOf(userLevel);
    const requiredLevelIndex = requiredLevel ? levelHierarchy.indexOf(requiredLevel) : -1;
  
    const levelMatch = requiredLevel === null || userLevelIndex <= requiredLevelIndex;
    const roleMatch = requiredRoles.length === 0 || requiredRoles.includes(userRole);
  
    return levelMatch && roleMatch;
}