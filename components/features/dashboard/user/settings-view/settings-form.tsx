import { User, MapPin, Phone, Coins, Mail, AlignLeft, Loader2, Save } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useCurrency } from '@/components/providers/currency-provider';
import { CURRENCIES, type CurrencyCode } from '@/lib/types/currency';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SettingsFormProps } from './types';

export function SettingsForm({
    formData,
    setFormData,
    isLoading,
    isUploading,
    onSubmit,
    userEmail
}: SettingsFormProps) {
    const { t } = useTranslation();
    const { currency, setCurrency } = useCurrency();

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Full Name */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('profile:fullName')}</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="pl-9 h-11 rounded-xl"
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
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('profile:location')}</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="pl-9 h-11 rounded-xl"
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
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        {t('profile:phoneNumber')}
                    </label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="pl-9 h-11 rounded-xl"
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
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        {t('profile:preferredCurrency')}
                    </label>
                    <div className="relative">
                        <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <select
                            className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                            value={currency}
                            onChange={(e) =>
                                setCurrency(e.target.value as CurrencyCode)
                            }
                        >
                            {Object.values(CURRENCIES).map((curr) => (
                                <option key={curr.code} value={curr.code}>
                                    {curr.symbol} {curr.name} ({curr.code})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        {t('profile:emailReadonly')}
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                        <Input
                            className="pl-9 h-11 bg-muted/20 text-muted-foreground rounded-xl"
                            value={userEmail || ''}
                            readOnly
                            disabled
                        />
                    </div>
                </div>

                {/* Bio */}
                <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        {t('profile:bio')}
                    </label>
                    <div className="relative">
                        <AlignLeft className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                        <Textarea
                            data-testid="profile-settings-bio"
                            className="min-h-[120px] pl-9 py-3 resize-y"
                            value={formData.bio}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                setFormData({ ...formData, bio: e.target.value })
                            }
                            placeholder={t('profile:bioPlaceholder')}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border/40">
                <Button
                    type="submit"
                    data-testid="profile-settings-save"
                    disabled={isLoading || isUploading}
                    className="min-w-[140px] rounded-xl font-bold uppercase tracking-widest"
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
    );
}
