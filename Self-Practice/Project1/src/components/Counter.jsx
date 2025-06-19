import { useState } from "react";

const Counter = () => {
    const [count, setCount] = useState(0);

    const addValue = () => {
        if(count !=20){
            setCount((count) => count+1);
        }else{
            alert("you have reached the max addon value..!")
        }
    }

    const SubValue = () => {
        if(count!=0){
            setCount(() => count - 1)
        }else {
            alert("You value is 0 the minimum allowed..!")
        }
    }

  return (
    <>
        <div>
            <span>
                {count}
            </span>
        </div>
        <div>
            <button type="button"  onClick={addValue}>+ Add Value</button>
            <button type="button" onClick={SubValue}>- Substract Value</button>
        </div>
    </>
  )
}

export default Counter