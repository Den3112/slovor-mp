interface FormProgressProps {
    step: number
    showPreview: boolean
}

export function FormProgress({ step, showPreview }: FormProgressProps) {
    return (
        <div className="absolute left-0 top-0 hidden h-1.5 w-full bg-white/5 md:block">
            <div
                className="h-full bg-gradient-to-r from-primary/50 to-primary transition-all duration-700 ease-out box-shadow-glow"
                style={{ width: `${showPreview ? 100 : (step / 3) * 100}%` }}
            />
        </div>
    )
}
