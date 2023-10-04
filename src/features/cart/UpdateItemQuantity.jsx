import React from 'react'
import Button from '../../ui/Button'
import { useDispatch,  } from 'react-redux'
import { decreaseItemQuantity,  increaseItemQuantity } from './cartSlice';

const UpdateItemQuantity = ({pizzaId , currentQuantity}) => {
    // const currentQuantity = useSelector(getCurrentQuantityById(pizzaId))
    const dispatch = useDispatch();
  return (
    <div className=' flex gap-3 items-center justify-center'>
        <Button type="round" onClick={()=>dispatch(decreaseItemQuantity(pizzaId))} >-</Button>
       <span className='text-sm font-semibold'>{currentQuantity}</span>
        <Button type="round" onClick={()=> dispatch(increaseItemQuantity(pizzaId))}>+</Button>
    </div>
  )
}

export default UpdateItemQuantity