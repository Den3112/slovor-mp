interface ErrorStateProps {
  message?: string
}

export function ErrorState({
  message = 'Something went wrong',
}: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <p className="font-medium text-destructive">{message}</p>
        <p className="mt-2 text-sm text-muted-foreground">{message || 'Please try again later'}</p>
      </div>
    </div>
  )
}
