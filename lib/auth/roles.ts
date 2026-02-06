import { Profile } from '@/lib/types';

export type UserRole = Profile['role'];


/**
 * Checks if a user has admin privileges.
 * @param profile The user profile object
 * @returns true if the user is an admin
 */
export function isAdmin(profile: Profile | null | undefined): boolean {
    return profile?.role === 'admin';
}

/**
 * Checks if a user has moderator or admin privileges.
 * @param profile The user profile object
 * @returns true if the user is a moderator or admin
 */
export function isModeratorOrAdmin(profile: Profile | null | undefined): boolean {
    return profile?.role === 'admin' || profile?.role === 'moderator';
}

/**
 * Checks if a user is verified.
 * @param profile The user profile object
 * @returns true if the user is verified
 */
export function isVerified(profile: Profile | null | undefined): boolean {
    return profile?.is_verified === true;
}

/**
 * Validates if the current user session has the required role (Client-side helper).
 * Note: Always verify roles on the server/middleware as well.
 */
export function hasRole(profile: Profile | null | undefined, requiredRole: UserRole): boolean {
    if (!profile) return false;
    if (requiredRole === 'admin') return profile.role === 'admin';
    if (requiredRole === 'moderator') return profile.role === 'admin' || profile.role === 'moderator';
    return true;
}
