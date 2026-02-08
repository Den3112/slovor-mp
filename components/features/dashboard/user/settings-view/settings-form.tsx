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
          <div className="relative">
            <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              className="h-11 rounded-lg pl-9"
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
          <div className="relative">
            <MapPin className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              className="h-11 rounded-lg pl-9"
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
          <div className="relative">
            <Phone className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              className="h-11 rounded-lg pl-9"
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
          <div className="relative">
            <Coins className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Select
              value={currency}
              onValueChange={(value) => setCurrency(value as CurrencyCode)}
            >
              <SelectTrigger className="h-11 w-full pl-9">
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
            <Mail className="text-muted-foreground/50 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              className="bg-muted/20 text-muted-foreground h-11 rounded-lg pl-9"
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
          <div className="relative">
            <AlignLeft className="text-muted-foreground absolute top-3.5 left-3 h-4 w-4" />
            <Textarea
              data-testid="profile-settings-bio"
              className="min-h-[120px] resize-y py-3 pl-9"
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
          className="min-w-[140px] rounded-lg font-bold tracking-widest uppercase"
        >
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
