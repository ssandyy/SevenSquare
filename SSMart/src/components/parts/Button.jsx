const Button = (props) => {
    const {
        name,
        onClick,
        style = '',
        type = 'button',
        children,
        href,
        toggled = false,
        toggledStyle = '',
        ...rest
    } = props;
    return (
        <button
            className={`bg-blue-500 text-white px-4 py-2 rounded-md ${style} ${toggled ? toggledStyle : ''}`}
            type={type}
            onClick={onClick}
            {...rest}
            href={href}
        >
            {children ? children : name}
        </button>
    );
};

export default Button;