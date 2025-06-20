
const Button = ({color, btnName, setColor}) => {
  return (
    <div>
        <button className="px-4 py-3 rounded m-3 outline-none" 
            style={{backgroundColor:color}} onClick={() => setColor(color)}>
            {btnName}
        </button>
    </div>
  )
}
export default Button