interface ErrorStateProps {
  message?: string
}

export function ErrorState({ message = 'Something went wrong' }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <p className="text-red-600 font-medium">{message}</p>
        <p className="text-sm text-gray-500 mt-2">Please try again later</p>
      </div>
    </div>
  )
}
