import React from 'react';
import './CurrencySelector.css';
import { getCurrencies } from '../api/base';
import { SharedContext } from './../contexts/shared-context';

class CurrencySelector extends React.Component {
  constructor() {
    super();

    this.state = {
      currencies: [],
      selectedCurrency: undefined,
    };
  }

  componentDidMount = async () => {
    const currencies = await getCurrencies();
    let selectedCurrency = localStorage.getItem('currency');
    if (selectedCurrency) {
      selectedCurrency = JSON.parse(selectedCurrency);
    } else {
      selectedCurrency = currencies[0];
    }

    this.context.currency.selectCurrency(selectedCurrency);
    this.setState({
      currencies: currencies,
      selectedCurrency: selectedCurrency,
    });
  };

  handleChange = (event) => {
    const currency = this.state.currencies.find(
      (item) => item.label === event.target.value
    );
    this.context.currency.selectCurrency(currency);
    this.setState((prevState) => {
      return {
        ...prevState,
        selectedCurrency: currency,
      };
    });
  };

  render() {
    return (
      <select
        className='currency-selector'
        value={this.state.selectedCurrency?.label}
        onChange={this.handleChange}
      >
        {this.state.currencies.map((currency) => (
          <option key={currency.label} value={currency.label}>
            {currency.symbol + ' ' + currency.label}
          </option>
        ))}
      </select>
    );
  }
}

CurrencySelector.contextType = SharedContext;

export default CurrencySelector;
