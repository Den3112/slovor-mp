export interface SettingsFormData {
    display_name: string;
    phone: string;
    bio: string;
    location: string;
    avatar_url: string;
}

export interface SettingsAvatarProps {
    avatarUrl: string;
    isUploading: boolean;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    userName?: string;
}

export interface SettingsFormProps {
    formData: SettingsFormData;
    setFormData: (data: SettingsFormData) => void;
    isLoading: boolean;
    isUploading: boolean;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    userEmail?: string;
}
