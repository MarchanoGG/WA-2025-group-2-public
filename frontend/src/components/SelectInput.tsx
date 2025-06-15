import { ChangeEvent, ReactNode } from 'react'

interface Option {
    value: string | number
    label: ReactNode
}

interface SelectInputProps {
    value: string | number
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void
    placeholder?: string 
    label?: string
    options: Option[]
    disabled?: boolean
    name?: string
    classes?: string
}

export default function SelectInput({
    value,
    onChange,
    placeholder = '',
    label,
    options,
    disabled = false,
    name,
    classes = '',
}: SelectInputProps) {
    return (
        <div className="w-full flex flex-col gap-1">
            {label && (
                <label htmlFor={name} className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`
          w-full rounded-xl border-2 border-gray-300 bg-white
          px-4 py-3 text-center text-slate-600
          disabled:bg-gray-100 disabled:text-gray-400
          focus:outline-none focus:border-blue-500
          focus:ring-2 focus:ring-blue-200
          transition
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          ${classes}
        `}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    )
}
