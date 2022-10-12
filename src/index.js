import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import CartDetails from './components/CartDetails';
import { SharedContext } from './contexts/shared-context';
import Header from './components/Header';
import ShoppingCart from './components/ShoppingCart';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      cart: {
        items: [],
        show: false,
        toggleCart: this.toggleCart,
        addItem: this.addItem,
        increaseItem: this.increaseItem,
        decreaseItem: this.decreaseItem,
        totalTax: 0,
        totalQuantity: 0,
        total: 0,
      },
      currency: {
        label: null,
        symbol: null,
        selectCurrency: this.selectCurrency,
      },
    };
  }

  componentDidMount = () => {
    let cartItems = localStorage.getItem('cart-items');
    if (!cartItems) {
      return;
    }

    const cart = this.state.cart;
    cart.items = JSON.parse(cartItems);
    this.setState((prevState) => {
      return {
        ...prevState,
        cart: cart,
      };
    });
  };

  toggleCart = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        cart: {
          ...prevState.cart,
          show: !this.state.cart.show,
        },
      };
    });
  };

  addItem = (item) => {
    const existingItem = this.state.cart.items.find(
      (el) => el.id === item.id && item.attributesID === el.attributesID
    );

    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.state.cart.items.push(item);
    }

    localStorage.setItem('cart-items', JSON.stringify(this.state.cart.items));
    this.setState((prevState) => {
      return {
        ...prevState,
        cart: this.state.cart,
      };
    }, this.calculateTotal);
  };

  increaseItem = (id, attributesID) => {
    const result = this.state.cart.items.filter(
      (item) => item.id === id && item.attributesID === attributesID
    );
    result[0].quantity += 1;

    localStorage.setItem('cart-items', JSON.stringify(this.state.cart.items));
    this.setState((prevState) => {
      return {
        ...prevState,
        cart: this.state.cart,
      };
    }, this.calculateTotal);
  };

  decreaseItem = (id, attributesID) => {
    const result = this.state.cart.items.filter(
      (item) => item.id === id && item.attributesID === attributesID
    );
    if (result[0].quantity !== 1) {
      result[0].quantity -= 1;

      localStorage.setItem('cart-items', JSON.stringify(this.state.cart.items));
      this.setState((prevState) => {
        return {
          ...prevState,
          cart: this.state.cart,
        };
      }, this.calculateTotal);
    } else {
      const items = this.state.cart.items.filter(
        (item) => item.id !== id || item.attributesID !== attributesID
      );

      localStorage.setItem('cart-items', JSON.stringify(items));
      this.setState((prevState) => {
        return {
          cart: {
            ...prevState.cart,
            items: items,
          },
        };
      }, this.calculateTotal);
    }
  };

  calculateTotal = () => {
    let total = 0,
      totalQuantity = 0;

    this.state.cart.items.forEach((value) => {
      const price = value.prices.find(
        (price) => price.currency.label === this.state.currency.label
      );
      total += price.amount * value.quantity;
      totalQuantity += value.quantity;
    });

    this.setState((prevState) => {
      return {
        ...prevState,
        cart: {
          ...prevState.cart,
          total: total.toFixed(2),
          totalQuantity,
          totalTax: (total * 0.21).toFixed(2),
        },
      };
    });
  };

  selectCurrency = (currency) => {
    localStorage.setItem('currency', JSON.stringify(currency));
    this.setState((prevState) => {
      return {
        ...prevState,
        currency: {
          ...prevState.currency,
          ...currency,
        },
      };
    }, this.calculateTotal);
  };

  render() {
    return (
      <SharedContext.Provider value={this.state}>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <div>
            <Header />
            {this.state.cart.show && <ShoppingCart price={200} />}
            <Switch>
              <Route path='/category/:categoryId'>
                <ProductList
                  location={this.props.location}
                  category='Category name'
                />
              </Route>
              <Route path='/product-details/:productId'>
                <ProductDetails />
              </Route>
              <Route index path='/cart-details'>
                <CartDetails title='CART' />
              </Route>
              <Route index path='/'>
                <ProductList
                  location={this.props.location}
                  category='Category name'
                />
              </Route>
            </Switch>
          </div>
        </BrowserRouter>
      </SharedContext.Provider>
    );
  }
}

ReactDom.render(<App />, document.getElementById('root'));
