import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTranslation } from '@/lib/i18n'
import { MessageInputProps } from './types'

export function MessageInput({
  value,
  onChange,
  onSend,
  disabled,
  isSending,
}: MessageInputProps) {
  const { t } = useTranslation(['messages'])

  return (
    <div className="bg-background/80 border-border border-t p-4 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-end gap-3">
        <Input
          placeholder={t('messages:typeMessage')}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && onSend()}
          className="bg-muted/30 border-border/60 focus:bg-background focus:border-primary/50 min-h-[44px] flex-1 rounded-lg transition-all"
        />
        <Button
          onClick={onSend}
          disabled={disabled || !value.trim() || isSending}
          size="icon"
          className="shadow-primary/20 h-11 w-11 shrink-0 rounded-lg shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
