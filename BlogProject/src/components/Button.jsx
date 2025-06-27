
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
    <button className= {
        `px-4 py-2 bg-blue-500 text-white rounded
        hover:bg-blue-600 transition duration-200 
        ${className}
        ${type}
        ${textColor} ${bgColor}
        ${style}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${onClick ? onClick : () => {}}
        `} {...props}>
        {children}
    </button>
  )
}

export default Button