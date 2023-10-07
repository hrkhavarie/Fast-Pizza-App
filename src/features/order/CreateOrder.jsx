import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant';
import Button from '../../ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, getCart, getTotalCartPrice } from '../cart/cartSlice';
import EmptyCart from '../cart/EmptyCart';
import store from '../../store';
import { formatCurrency } from '../../utils/helpers';
import { useState } from 'react';
import { fetchAddress, getPhone, updateName } from '../user/userSlice';
import { getAddress } from '../../services/apiGeocoding';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

// const fakeCart = [
//   {
//     pizzaId: 12,
//     name: 'Mediterranean',
//     quantity: 2,
//     unitPrice: 16,
//     totalPrice: 32,
//   },
//   {
//     pizzaId: 6,
//     name: 'Vegetale',
//     quantity: 1,
//     unitPrice: 13,
//     totalPrice: 13,
//   },
//   {
//     pizzaId: 11,
//     name: 'Spinach and Mushroom',
//     quantity: 1,
//     unitPrice: 15,
//     totalPrice: 15,
//   },
// ];

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  // const [phone , setphone] = useState('');
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
const {phone, username,  status: addressStatus , position , address , 
  error: errorAddress
} = useSelector(state => state.user);

const isLoadingAddress = addressStatus ==='loading'
const fullfilledAddress = address === 'idle'

const cart = useSelector(getCart); 
const totalCartPrice = useSelector(getTotalCartPrice);
// const finalPay = totalCartPrice <30 ? totalCartPrice +3: totalCartPrice;
const priorityPrice = withPriority ? totalCartPrice* 0.2 : 0 ;
const totalPrice = totalCartPrice + priorityPrice ;
// const totalPrice = finalPay + priorityPrice ;
  const formErrors = useActionData();
  const dispatch = useDispatch();

  // const handleSubmit= (e)=>{
  //   e.preventDefault();

  //     dispatch(updateName(username))
  //     dispatch(getPhone(phone))
      
    
  // }


  // const cart = fakeCart;

  if(!cart.length) return <EmptyCart/>

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>


      {/* <Form method="POST" action="/order/new"> */}
      <Form method="POST" >
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input className="input grow" defaultValue={username} 
          type="text" name="customer" required />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input className="input w-full" type="tel" name="phone" required
            defaultValue={phone}
              // onChange={(e)=>dispatch(getPhone(phone))} 
             />
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center relative">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              className="input w-full space-x-0 whitespace-normal"
              type="text"
              name="address"
              disabled={isLoadingAddress}
              required
              defaultValue={address}
            />
             {addressStatus === 'error' && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {errorAddress}
              </p>
            )}
          </div>
          {!position.latitude && !position.longitude &&( <span className='absolute right-[3px] top-[35px] sm:right-    [5px] sm:top-[5px] z-50'>

      <Button
      disabled={isLoadingAddress}
       type='small'  
       onClick={(e)=>{ 
        e.preventDefault()
          dispatch(fetchAddress())
      }}>Get Location</Button>
          </span>) }

        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <Button disabled={isSubmitting || fullfilledAddress} type="primary" >
            {isSubmitting  ? 'Placing order....' : `Order now from ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request} ) {


  
      

  const formData = await request.formData();
  const data = Object.fromEntries(formData);

 
  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'true',
  };

  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      'Please give us your correct phone number. We might need it to contact you.';

  if (Object.keys(errors).length > 0) return errors;

  // If everything is okay, create new order and redirect


  const newOrder = await createOrder(order)
  store.dispatch(updateName(order.customer))
  store.dispatch(getPhone(order.phone))

  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
