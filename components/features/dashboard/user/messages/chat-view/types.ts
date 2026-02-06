import { Message, Conversation } from '@/lib/api/messages';

export interface ChatHeaderProps {
    conversation: Conversation;
    otherUserStatus: 'online' | 'offline';
    isOtherTyping: boolean;
    currentUserId: string;
}

export interface MessageListProps {
    messages: Message[];
    currentUserId: string;
    otherUser: Conversation['buyer'] | Conversation['seller'];
    bottomRef: React.RefObject<HTMLDivElement | null>;
}

export interface MessageInputProps {
    value: string;
    onChange: (val: string) => void;
    onSend: () => void;
    disabled: boolean;
    isSending: boolean;
}
