import Button from '../../ui/Button'
import { useDispatch } from 'react-redux'
import { deleteItem } from './cartSlice';

const DeleteItem = ({pizzaId}) => {
  const dispatch = useDispatch();
//   const  handleDeleteItem= ()=>{
//     dispatch(deleteItem(pizzaId))
//   }

//   ()=>dispatch(deleteItem(pizzaId))
  return (
    <Button 
        onClick={()=>dispatch(deleteItem(pizzaId))} 
        type="small">Delete</Button>

  )
}

export default DeleteItem