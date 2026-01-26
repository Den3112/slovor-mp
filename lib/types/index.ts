export type UserRole = 'user' | 'admin' | 'moderator';

export interface UserProfile {
    id: string;
    email: string | null;
    full_name: string | null;
    avatar_url: string | null;
    role: UserRole;
    is_verified: boolean;
    verification_level: 'none' | 'email' | 'phone' | 'documents';
    created_at: string;
    updated_at: string;
}

export type ListingStatus = 'active' | 'pending' | 'rejected' | 'sold' | 'expired' | 'draft';

export interface Listing {
    id: string;
    user_id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    category_id: string;
    images: string[];
    status: ListingStatus;
    views_count: number;
    likes_count: number;
    is_promoted: boolean;
    promoted_until: string | null;
    created_at: string;
    updated_at: string;
    attributes: Record<string, any>; // For dynamic attributes
}

export interface Review {
    id: string;
    author_id: string;
    recipient_id: string;
    listing_id: string | null;
    rating: number;
    comment: string;
    created_at: string;
}

export interface AdminAction {
    id: string;
    admin_id: string;
    target_id: string;
    target_type: 'listing' | 'user' | 'review';
    action_type: 'approve' | 'reject' | 'ban' | 'verify';
    reason: string | null;
    created_at: string;
}
