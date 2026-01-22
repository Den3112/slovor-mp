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

export function ChatInput({ newMessage, setNewMessage, handleSend, isSending }: ChatInputProps) {
    return (
        <div className="p-4 md:p-6 bg-background/40 border-t border-white/5 backdrop-blur-2xl z-20">
            <div className="max-w-4xl mx-auto flex items-end gap-3 bg-background/60 p-2 pl-3 rounded-[2rem] border border-white/10 shadow-lg focus-within:shadow-primary/10 focus-within:border-primary/20 transition-all duration-300">
                <Button variant="ghost" size="icon" className="h-10 w-10 number-full rounded-full shrink-0 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                    <ImageIcon className="h-5 w-5" />
                </Button>

                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 min-h-[44px] max-h-32 border-none bg-transparent focus-visible:ring-0 px-2 py-3 placeholder:text-muted-foreground/50 font-medium text-base"
                />

                <Button
                    onClick={handleSend}
                    size="icon"
                    disabled={!newMessage.trim() || isSending}
                    className={cn(
                        "h-11 w-11 rounded-full shrink-0 transition-all duration-300 shadow-md",
                        newMessage.trim()
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 scale-100 hover:scale-105"
                            : "bg-muted text-muted-foreground scale-95 opacity-50"
                    )}
                >
                    {isSending ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    ) : (
                        <Send className="h-5 w-5 ml-0.5" />
                    )}
                </Button>
            </div>
        </div>
    )
}
