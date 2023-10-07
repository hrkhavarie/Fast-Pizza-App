import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart:[] ,
    // cart:[
    //     {
    //         pizzaId: 12 ,
    //         name: 'Peperoni' , 
    //         quantity: 0 , 
    //         unitPrice: 0 , 
    //         totalPrice: 0 , 
    //     }
    // ]
  
}

const cartSlice = createSlice({
    name : 'cart',
    initialState , 
    reducers:{
        addItem(state , action){
            state.cart.push(action.payload);
        },
        deleteItem(state , action){
            //payload = pizzaId
           state.cart =  state.cart.filter((item)=> item.pizzaId !== action.payload);
            
        },
        increaseItemQuantity(state , action){
            
          const item =  state.cart.find(item=> item.pizzaId === action.payload);
          if(item.quantity < 10) 
          item.quantity ++ 
          item.totalPrice = item.quantity * item.unitPrice ; 
        },
        decreaseItemQuantity(state , action){
            const item = state.cart.find(item=> item.pizzaId === action.payload)
            item.quantity -- ; 
            item.totalPrice = item.quantity * item.unitPrice;

            if(item.quantity === 0) cartSlice.caseReducers.deleteItem(state, action)
        },
  
        clearCart(state){
            state.cart = []
        },
    } , 
});

export const {addItem, 
              deleteItem ,
              increaseItemQuantity  ,
              decreaseItemQuantity,
              clearCart
} = cartSlice.actions

export default cartSlice.reducer ;


// Methods

export let getTotalCartPrice  =  (state)=>
    state.cart.cart
    .reduce((sum , item)=> sum + item.totalPrice, 0 ) ;

    // if(total<30)
    // return total= total +3
    // // (Numner(total) <30) ? (total +=3) : total;
    //  return total
        
    
// export const getTotalCartPrice = (Number(getTotalCartPrice1)<30) ? getTotalCartPrice1 +=3: getTotalCartPrice1; 

    
  

    // export const getTotlapay = ()=>{
    //     let sum = getTotalCartPrice();
    //     Number(sum);
    //    sum = (sum<30) ? sum= sum+3 : sum;
    // }

export const getTotalCartQuantity  =((state)=>
    state.cart.cart
    .reduce((sum , item)=> sum + item.quantity, 0)
    )

export const getCart = (state=>state.cart.cart)

export const getCurrentQuantityById = (id)=> state=> state.cart.cart.find(item=>item.pizzaId === id)?.quantity ?? 0
        
    