import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  newMessage: string
  setNewMessage: (msg: string) => void
  handleSend: () => void
  isSending: boolean
}

export function ChatInput({
  newMessage,
  setNewMessage,
  handleSend,
  isSending,
}: ChatInputProps) {
  return (
    <div className="bg-background/40 z-20 border-t border-white/5 p-4 backdrop-blur-2xl md:p-6">
      <div className="bg-background/60 focus-within:shadow-primary/10 focus-within:border-primary/20 mx-auto flex max-w-4xl items-end gap-3 rounded-4xl border border-white/10 p-2 pl-3 shadow-lg transition-all duration-300">
        <Button
          variant="ghost"
          size="icon"
          className="number-full text-muted-foreground hover:text-primary hover:bg-primary/10 h-10 w-10 shrink-0 rounded-full transition-colors"
        >
          <ImageIcon className="h-5 w-5" />
        </Button>

        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Type a message..."
          className="placeholder:text-muted-foreground/50 max-h-32 min-h-[44px] flex-1 border-none bg-transparent px-2 py-3 text-base font-medium focus-visible:ring-0"
        />

        <Button
          onClick={handleSend}
          size="icon"
          disabled={!newMessage.trim() || isSending}
          className={cn(
            'h-11 w-11 shrink-0 rounded-full shadow-md transition-all duration-300',
            newMessage.trim()
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 scale-100 hover:scale-105'
              : 'bg-muted text-muted-foreground scale-95 opacity-50'
          )}
        >
          {isSending ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          ) : (
            <Send className="ml-0.5 h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  )
}
