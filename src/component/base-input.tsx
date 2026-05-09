export default function BaseInput({ type = "text", placeholder, value, onChange, isReadonly}: BaseInputProps) {
    return (
        <div className="w-full">
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="mt-1 bg-[#FFFCEB] h-14 w-full font-medium text-xl rounded-2xl pl-4 shadow-[inset_0px_5px_4px_0px_rgba(0,0,0,0.25)] hover:bg-[#D0D0D0] focus:outline-none"
                readOnly={isReadonly}
            />
        </div>
    );
}