interface ButtonProps {
  text: string
  action?: () => void
  classes?: string
}

export default function Button({ text, action, classes }: ButtonProps) {
  const baseClasses = 'rounded-md px-6 py-3 transition font-medium'

  const defaultClasses = classes?.includes('bg-')
    ? ''
    : 'text-white bg-blue-600 hover:bg-blue-700'

  return (
    <button
      onClick={action}
      className={`${baseClasses} ${defaultClasses} ${classes || ''}`.trim()}
    >
      {text}
    </button>
  )
}
