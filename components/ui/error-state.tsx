interface ErrorStateProps {
  message?: string
}

export function ErrorState({
  message = 'Something went wrong',
}: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <p className="text-destructive font-medium">{message}</p>
        <p className="text-muted-foreground mt-2 text-sm">
          {message || 'Please try again later'}
        </p>
      </div>
    </div>
  )
}
