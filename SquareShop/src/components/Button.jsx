const Button = ({
    children,
    onClick,
    className = '',
    textColor = 'text-white',
    bgColor = 'bg-blue-500',
    type = 'button',
    disabled = false,
    style = {},
    ...props
}) => {
    return (
        <button
            onClick={onClick} // ✅ You must explicitly pass this
            type={type}
            disabled={disabled}
            style={style}
            className={`px-4 py-2 rounded hover:bg-blue-600 transition duration-200
                ${textColor} ${bgColor} ${className}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;