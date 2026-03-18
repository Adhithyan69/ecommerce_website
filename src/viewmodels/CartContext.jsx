import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const CartStateContext = createContext(undefined);
const CartDispatchContext = createContext(undefined);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(i => i.id === action.item.id);
      const items = existing
        ? state.items.map(i => i.id === action.item.id ? { ...i, quantity: i.quantity + (action.quantity || 1) } : i)
        : [...state.items, { ...action.item, quantity: action.quantity || 1 }];
      return { ...state, items };
    }
    case 'REMOVE': {
      return { ...state, items: state.items.filter(i => i.id !== action.id) };
    }
    case 'SET_QTY': {
      const { id, quantity } = action;
      const items = state.items.map(i => i.id === id ? { ...i, quantity } : i).filter(i => i.quantity > 0);
      return { ...state, items };
    }
    case 'CLEAR': {
      return { ...state, items: [] };
    }
    case 'HYDRATE': {
      return action.state || state;
    }
    default:
      return state;
  }
}

const initialState = { items: [] };

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart_state_v1');
      if (raw) dispatch({ type: 'HYDRATE', state: JSON.parse(raw) });
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('cart_state_v1', JSON.stringify(state));
    } catch {}
  }, [state]);

  const totals = useMemo(() => {
    const count = state.items.reduce((n, i) => n + i.quantity, 0);
    const subtotal = state.items.reduce((n, i) => n + i.price * i.quantity, 0);
    return { count, subtotal };
  }, [state.items]);

  const value = useMemo(() => ({ ...state, ...totals }), [state, totals]);

  return (
    <CartStateContext.Provider value={value}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartStateContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartStateContext);
  if (ctx === undefined) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export function useCartActions() {
  const dispatch = useContext(CartDispatchContext);
  if (dispatch === undefined) throw new Error('useCartActions must be used within CartProvider');
  return {
    addToCart: (item, quantity = 1) => dispatch({ type: 'ADD', item, quantity }),
    removeFromCart: (id) => dispatch({ type: 'REMOVE', id }),
    setQuantity: (id, quantity) => dispatch({ type: 'SET_QTY', id, quantity }),
    clearCart: () => dispatch({ type: 'CLEAR' })
  };
}

export default CartProvider;


