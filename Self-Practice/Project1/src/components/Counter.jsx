import { useState } from "react";

const Counter = () => {
    const [count, setCount] = useState(0);

    const addValue = () => {
        setCount((count) => count+1);
    }

    const SubValue = () => {
        setCount(() => count - 1)
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