import { Send } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { useTranslation } from '@/shared/lib/i18n'
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
    <div className="bg-background border-border pb-safe border-t p-4">
      <div className="mx-auto flex max-w-4xl items-end gap-3">
        <Input
          placeholder={t('messages:typeMessage')}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && onSend()}
          className="bg-muted/40 border-border/60 focus:bg-background focus:border-primary/50 focus:ring-primary/10 min-h-[48px] flex-1 rounded-xl px-4 text-sm shadow-sm transition-all focus:ring-4"
        />
        <Button
          onClick={onSend}
          disabled={disabled || !value.trim() || isSending}
          size="icon"
          className="shadow-primary/25 bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-12 shrink-0 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          <Send className="h-5 w-5" strokeWidth={2.5} />
        </Button>
      </div>
    </div>
  )
}
