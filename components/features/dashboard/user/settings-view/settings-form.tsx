import {
  User,
  MapPin,
  Phone,
  Coins,
  Mail,
  AlignLeft,
  Loader2,
  Save,
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { useCurrency } from '@/components/providers/currency-provider'
import { CURRENCIES, type CurrencyCode } from '@/lib/types/currency'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SettingsFormProps } from './types'

export function SettingsForm({
  formData,
  setFormData,
  isLoading,
  isUploading,
  onSubmit,
  userEmail,
}: SettingsFormProps) {
  const { t } = useTranslation()
  const { currency, setCurrency } = useCurrency()

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            {t('profile:fullName')}
          </label>
          <div className="relative group">
            <User className="text-muted-foreground/50 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transition-colors group-hover:text-primary/70" />
            <Input
              className="bg-background/50 h-11 border-white/10 pl-9 transition-all focus:border-primary/30 focus:bg-background/80 focus:ring-4 focus:ring-primary/10"
              value={formData.display_name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  display_name: e.target.value,
                })
              }
              placeholder="John Doe"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            {t('profile:location')}
          </label>
          <div className="relative group">
            <MapPin className="text-muted-foreground/50 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transition-colors group-hover:text-primary/70" />
            <Input
              className="bg-background/50 h-11 border-white/10 pl-9 transition-all focus:border-primary/30 focus:bg-background/80 focus:ring-4 focus:ring-primary/10"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="Bratislava, Slovakia"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            {t('profile:phoneNumber')}
          </label>
          <div className="relative group">
            <Phone className="text-muted-foreground/50 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transition-colors group-hover:text-primary/70" />
            <Input
              className="bg-background/50 h-11 border-white/10 pl-9 transition-all focus:border-primary/30 focus:bg-background/80 focus:ring-4 focus:ring-primary/10"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="+421 900 000 000"
            />
          </div>
        </div>

        {/* Currency */}
        <div className="space-y-2">
          <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            {t('profile:preferredCurrency')}
          </label>
          <div className="relative group">
            <Coins className="text-muted-foreground/50 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transition-colors group-hover:text-primary/70" />
            <Select
              value={currency}
              onValueChange={(value) => setCurrency(value as CurrencyCode)}
            >
              <SelectTrigger className="bg-background/50 h-11 w-full border-white/10 pl-9 transition-all focus:border-primary/30 focus:bg-background/80 focus:ring-4 focus:ring-primary/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(CURRENCIES).map((curr) => (
                  <SelectItem key={curr.code} value={curr.code}>
                    {curr.symbol} {curr.name} ({curr.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            {t('profile:emailReadonly')}
          </label>
          <div className="relative">
            <Mail className="text-muted-foreground/30 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              className="bg-muted/10 text-muted-foreground/70 h-11 cursor-not-allowed rounded-lg border-white/5 pl-9 shadow-inner"
              value={userEmail || ''}
              readOnly
              disabled
            />
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            {t('profile:bio')}
          </label>
          <div className="relative group">
            <AlignLeft className="text-muted-foreground/50 absolute top-3.5 left-3 h-4 w-4 transition-colors group-hover:text-primary/70" />
            <Textarea
              data-testid="profile-settings-bio"
              className="bg-background/50 min-h-[120px] resize-y border-white/10 py-3 pl-9 transition-all focus:border-primary/30 focus:bg-background/80 focus:ring-4 focus:ring-primary/10"
              value={formData.bio}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              placeholder={t('profile:bioPlaceholder')}
            />
          </div>
        </div>
      </div>

      <div className="border-border/40 flex justify-end border-t pt-4">
        <Button
          type="submit"
          data-testid="profile-settings-save"
          disabled={isLoading || isUploading}
          className="relative min-w-[200px] overflow-hidden rounded-xl border border-primary/20 bg-primary px-8 py-6 font-bold tracking-widest text-primary-foreground uppercase shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:shadow-primary/40 active:scale-95 disabled:opacity-50"
        >
          <span className="absolute inset-0 bg-linear-to-r from-white/20 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {t('profile:saveChanges')}
        </Button>
      </div>
    </form>
  )
}
