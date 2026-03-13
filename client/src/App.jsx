import React from 'react'
import { Button } from "@/components/ui/button"
import { useDispatch,useSelector } from 'react-redux'
import { increment,decrement,incrementByAmount } from './store/slices/counter'
export default function App() {
  const value = useSelector((state)=>state.counter.value);
  const dispatch = useDispatch();
console.log(value)
  return (
    <div>
      <h1>{value}</h1>
      <Button variant="outline" onClick={()=>dispatch(increment())}>increment</Button>
      <Button variant="outline" onClick={()=>dispatch(decrement())}>increment</Button>
      <Button variant="outline" onClick={()=>dispatch(incrementByAmount(20))}>incrementByAmount</Button>

      
    </div>
  )
}
