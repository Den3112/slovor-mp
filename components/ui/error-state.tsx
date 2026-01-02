interface ErrorStateProps {
  message?: string
}

export function ErrorState({
  message = 'Something went wrong',
}: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <p className="font-medium text-red-600">{message}</p>
        <p className="mt-2 text-sm text-gray-500">Please try again later</p>
      </div>
    </div>
  )
}
