
import { Loader2, Eye, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface ListingsTableProps {
    isLoading: boolean
    listings: any[]
    actionLoading: string | null
    onApprove: (id: string) => void
    onReject: (id: string) => void
    onDelete: (id: string) => void
}

export function ListingsTable({
    isLoading,
    listings,
    actionLoading,
    onApprove,
    onReject,
    onDelete,
}: ListingsTableProps) {
    return (
        <div className="bg-card overflow-hidden rounded-xl border">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Location</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Created</th>
                            <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-border divide-y">
                        {isLoading ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-8 text-center">
                                    <Loader2 className="text-muted-foreground mx-auto h-6 w-6 animate-spin" />
                                </td>
                            </tr>
                        ) : listings.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-muted-foreground px-4 py-8 text-center">
                                    No listings found
                                </td>
                            </tr>
                        ) : (
                            listings.map((listing) => (
                                <tr key={listing.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3">
                                        <div className="max-w-xs truncate font-medium">{listing.title}</div>
                                    </td>
                                    <td className="text-muted-foreground px-4 py-3 text-sm">
                                        {(listing.category as { name?: string })?.name || '-'}
                                    </td>
                                    <td className="text-muted-foreground px-4 py-3 text-sm">
                                        {listing.location || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium">€{listing.price}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={cn(
                                                'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                                                listing.is_active
                                                    ? 'bg-green-500/10 text-green-500'
                                                    : 'bg-red-500/10 text-red-500'
                                            )}
                                        >
                                            {listing.is_active ? (
                                                <>
                                                    <CheckCircle className="h-3 w-3" />
                                                    Active
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="h-3 w-3" />
                                                    Inactive
                                                </>
                                            )}
                                        </span>
                                    </td>
                                    <td className="text-muted-foreground px-4 py-3 text-sm">
                                        {new Date(listing.created_at || '').toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/listings/${listing.id}`}
                                                target="_blank"
                                                className="hover:bg-muted rounded-lg p-2 transition-colors"
                                            >
                                                <Eye className="text-muted-foreground h-4 w-4" />
                                            </Link>

                                            {actionLoading === listing.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <>
                                                    {!listing.is_active && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => onApprove(listing.id)}
                                                            className="text-green-500 hover:bg-green-500/10 hover:text-green-600"
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {listing.is_active && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => onReject(listing.id)}
                                                            className="text-orange-500 hover:bg-orange-500/10 hover:text-orange-600"
                                                        >
                                                            <AlertTriangle className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => onDelete(listing.id)}
                                                        className="text-red-500 hover:bg-red-500/10 hover:text-red-600"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
