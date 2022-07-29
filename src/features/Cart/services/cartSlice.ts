import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cartUserApi } from 'api';
import { Product } from 'models';
import { Cart } from 'models/Cart';
import { RootState } from 'redux/store';
export interface CartState {
  cartProducts: Cart[];
}
export interface CartUser {
  quantity: number;
  product: Product;
}
const initialState: CartState = {
  cartProducts: [],
};
export const addCartUsers = createAsyncThunk('user/addCartToUser', async (payload: CartUser) => {
  const { results } = await cartUserApi.addCartUser(payload);
  return results;
});
export const removeProductInCart = createAsyncThunk('user/deleteCartToUser', async (payload: any) => {
  const { results } = await cartUserApi.removeProductInCart(payload);
  return results;
});
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    removeProductInCart(state, action) {
      const productRemove = state.cartProducts.findIndex((item) => item.product._id === action.payload);
      state.cartProducts.splice(productRemove, 1);
    },
    removeAllCart(state) {
      state.cartProducts = [];
    },
    setCartUser(state, action) {
      state.cartProducts = action.payload.cart;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCartUsers.fulfilled, (state, action) => {
        state.cartProducts = action.payload;
      })
      .addCase(removeProductInCart.fulfilled, (state, action) => {
        state.cartProducts = action.payload;
      })
  },
});

// Actions
export const cartActions = cartSlice.actions;

export const selectQuantityCart = (state: RootState) =>
  state.cart.cartProducts.reduce((count, item) => count + item.quantity, 0);
export const selectTotalPrice = (state: RootState) =>
  state.cart.cartProducts.reduce((count, item) => count + Math.floor(item.quantity * item.product.price), 0);
export const selectProductCart = (state: RootState) => state.cart.cartProducts;

// Reducer
const cartReducer = cartSlice.reducer;
export default cartReducer;
