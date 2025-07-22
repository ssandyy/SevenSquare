import { useState } from 'react'

const Stopwatch3 = () => {
    const [sec, setSec] = useState(0)
    const [min, setMin] = useState(57)
    const [hr, setHr] = useState(0)


    // if(sec===60){
    //                 setMin((min) => min + 1)
    //                 setSec(0)
    //                 if(min === 59 && sec === 60){
    //                     setHr((hr) => hr + 1)
    //                     setMin(0)
    //                 }
    //             }


    const StartTimer = () => {
        setInterval(() => {
              setSec((sec) => {
                  if(sec ===59){
                    setMin((min) => {
                        if(min === 59){
                            setHr((hr) => hr + 1)
                          return 0
                        }
                      return min + 1
                    }
                  )
                  return 0
                }
            return sec + 1})
          }, 10);
    }
    const stopTimer = () => {

    }
    const resetTimer = () => {

    }
    

  return (
    <>
        <div>Stopwatch3</div>
        <div>
            {`${hr} : ${min} : ${sec}`}
        </div>
        <div>
            <button onClick={StartTimer}>Start</button>
            <button onClick={stopTimer}>Stop</button>
            <button onClick={resetTimer}>Reset</button>
        </div>    
    </>
    
  )
}

export default Stopwatch3