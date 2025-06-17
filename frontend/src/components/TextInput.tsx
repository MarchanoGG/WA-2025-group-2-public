import { ChangeEvent } from 'react';

interface TextInputProps {
	value: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	label?: string;
	type?: React.HTMLInputTypeAttribute;
	name?: string;
	classes?: string;
}

export default function TextInput({
	value,
	onChange,
	placeholder = '',
	label,
	type = 'text',
	name,
	classes = '',
}: TextInputProps) {
	return (
		<div className="w-full flex flex-col gap-1">
			{label && (
				<label
					htmlFor={name}
					className="text-sm font-medium text-gray-700"
				>
					{label}
				</label>
			)}

			<input
				id={name}
				name={name}
				type={type}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				className={`
          w-full rounded-xl border-2 border-gray-300
          bg-white px-4 py-3 text-center tracking-widest
          text-slate-600 placeholder:text-slate-400
          focus:outline-none focus:border-blue-500
          focus:ring-2 focus:ring-blue-200
          transition
          ${classes}
        `}
			/>
		</div>
	);
}
