import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/lib/i18n';
import { MessageInputProps } from './types';

export function MessageInput({ value, onChange, onSend, disabled, isSending }: MessageInputProps) {
    const { t } = useTranslation(['messages']);

    return (
        <div className="p-4 bg-background/80 border-t border-border backdrop-blur-md">
            <div className="max-w-4xl mx-auto flex gap-3 items-end">
                <Input
                    placeholder={t('messages:typeMessage')}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && onSend()}
                    className="flex-1 min-h-[44px] bg-muted/30 border-border/60 focus:bg-background focus:border-primary/50 transition-all rounded-xl"
                />
                <Button
                    onClick={onSend}
                    disabled={disabled || !value.trim() || isSending}
                    size="icon"
                    className="h-11 w-11 rounded-xl shrink-0 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                    <Send className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}
