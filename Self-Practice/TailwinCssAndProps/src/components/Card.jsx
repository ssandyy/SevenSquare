
const Card = ({userName, btntext="Visit me" }) => {     // pass directly and also set default value..

    // const Card = (props) => {
    // console.log(props.userName);
    
  return (
    <>
    <div className="max-w-xs rounded-md shadow-md bg-black text-gray-100">
          <img
            src="https://source.unsplash.com/301x301/?random"
            alt=""
            className="object-cover object-center w-full rounded-t-md h-50 bg-gray-500"
          />
          <div className="flex flex-col justify-between p-6 space-y-8">
            <div className="space-y-2">
              {/* <h2 className="text-3xl font-semibold tracking-wide">{props.userName}</h2> */}
              <h2 className="text-3xl font-semibold tracking-wide">{userName}</h2>
              <p className="text-green-400">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Distinctio tempora ipsum
                soluta amet corporis accusantium aliquid consectetur eaque!
              </p>
            </div>
            <button
              type="button"
              className="flex items-center justify-center w-full p-3 font-semibold tracking-wide rounded-md bg-green-800 text-amber-300"
            >
              {btntext}
            </button>
          </div> 
        </div>
    </>
  )
}

export default Card