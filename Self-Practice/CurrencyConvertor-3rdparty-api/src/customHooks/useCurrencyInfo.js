import { useEffect, useState } from 'react';


//https://github.com/fawazahmed0/exchange-api/blob/main/other/currencies2.json
//  https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@{date}/v1/{endpoint}
// https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json //usd
// https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/inr.json //inr


function useCurrencyInfo (currency) {
    const [data, setData] = useState({})
  
    useEffect(() => {
        fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency}.json`)
        // console.log(currency);
        .then((res)=> res.json())
        .then((res) => setData(res[currency]))
        console.log(data);
  }, [currency])
  console.log(data);
  return data;
}
export default useCurrencyInfo;