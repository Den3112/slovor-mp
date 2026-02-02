-- Migration: Fix Message Notification Links
-- Description: Updates the notification link from /profile/messages to /messages

CREATE OR REPLACE FUNCTION public.handle_new_message_notification()
RETURNS TRIGGER AS \$\$
DECLARE
    recipient_id UUID;
    sender_name TEXT;
BEGIN
    -- 1. Determine the recipient (the other participant in the conversation)
    SELECT
        CASE
            WHEN buyer_id = NEW.sender_id THEN seller_id
            ELSE buyer_id
        END INTO recipient_id
    FROM public.conversations
    WHERE id = NEW.conversation_id;

    -- 2. Get sender name for the notification title
    SELECT display_name INTO sender_name
    FROM public.profiles
    WHERE id = NEW.sender_id;

    -- 3. Insert notification
    INSERT INTO public.notifications (
        user_id,
        type,
        title,
        content,
        link,
        metadata
    ) VALUES (
        recipient_id,
        'message',
        COALESCE(sender_name, 'New Message'),
        CASE
            WHEN length(NEW.content) > 100 THEN left(NEW.content, 97) || '...'
            ELSE NEW.content
        END,
        '/messages/' || NEW.conversation_id,
        jsonb_build_object('conversation_id', NEW.conversation_id, 'message_id', NEW.id)
    );

    RETURN NEW;
END;
\$\$ LANGUAGE plpgsql SECURITY DEFINER;
