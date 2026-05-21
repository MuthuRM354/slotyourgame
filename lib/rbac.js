const HIERARCHY = {
  league_admin: 3,
  captain: 2,
  player: 1,
}

export function hasPermission(userRole, requiredRole) {
  return (HIERARCHY[userRole] ?? 0) >= (HIERARCHY[requiredRole] ?? 0)
}

export const PERMISSIONS = {
  CREATE_FIXTURE: 'captain',
  EDIT_ROSTER: 'captain',
  VIEW_ALL_TEAMS: 'league_admin',
  MARK_AVAILABILITY: 'player',
  MANAGE_BILLING: 'captain',
  ALLOCATE_GROUNDS: 'league_admin',
}
