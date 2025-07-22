const Input = (props) => {

    const {type, placeholder, value, onChange, style, ...rest} = props;

    return(
        <input 
        type={type} 
        value={value} 
        placeholder={placeholder} 
        onChange={onChange} 
        {...rest}  
        className={`${style} w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`} 
        />
    );
};

export default Input;