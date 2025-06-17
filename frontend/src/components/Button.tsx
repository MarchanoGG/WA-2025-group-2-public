interface ButtonProps {
	text: string
	action?: () => void
	classes?: string
	disabled?: boolean
}

export default function Button({ text, action, classes, disabled = false }: ButtonProps) {
	const baseClasses = 'rounded-md px-6 py-3 transition font-medium'

	const defaultClasses = classes?.includes('bg-')
		? ''
		: 'text-white bg-blue-600 hover:bg-blue-700'

	return (
		<button
			onClick={action}
			disabled={disabled}
			className={`${baseClasses} ${defaultClasses} ${classes || ''}`.trim()}
		>
			{text}
		</button>
	)
}
