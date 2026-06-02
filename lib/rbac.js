/**
 * Role definitions for SlotYourGame.
 * Matches the Java UserRole enum on the backend.
 * Roles: PLAYER, CAPTAIN, VENUE_OWNER, ADMIN
 */

const ROLE_HIERARCHY = {
  player:       0,
  captain:      1,
  ground_admin: 2,
  league_admin: 3,
  super_admin:  4,
}

export function hasPermission(userRole, requiredRole) {
  if (userRole === 'ground_admin') {
    return requiredRole === 'ground_admin' || requiredRole === 'super_admin'
  }
  return (ROLE_HIERARCHY[userRole] ?? -1) >= (ROLE_HIERARCHY[requiredRole] ?? 999)
}

/** True if userRole can manage team-level things (fixtures, roster, etc.) */
export function isCaptainOrAbove(role) {
  return role === 'captain' || role === 'league_admin' || role === 'super_admin'
}

/** True if userRole is a ground admin or super admin */
export function isGroundAdmin(role) {
  return role === 'ground_admin' || role === 'super_admin'
}

/** Map backend Java enum → frontend role key */
export function normalizeRole(backendRole) {
  const map = {
    PLAYER:      'player',
    CAPTAIN:     'captain',
    VENUE_OWNER: 'ground_admin',
    ADMIN:       'super_admin',
  }
  return map[backendRole] ?? backendRole?.toLowerCase() ?? 'player'
}

export const ROLE_LABELS = {
  player:       'Player',
  captain:      'Captain',
  ground_admin: 'Ground Admin',
  league_admin: 'League Admin',
  super_admin:  'Super Admin',
}

export const ROLE_COLORS = {
  player:       'bg-blue-500/15 text-blue-300 border-blue-700/40',
  captain:      'bg-emerald-500/15 text-emerald-300 border-emerald-700/40',
  ground_admin: 'bg-orange-500/15 text-orange-300 border-orange-700/40',
  league_admin: 'bg-purple-500/15 text-purple-300 border-purple-700/40',
  super_admin:  'bg-red-500/15 text-red-300 border-red-700/40',
}
