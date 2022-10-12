import React from 'react';
import './Filters.css';
import { withRouter } from 'react-router-dom';

class Filters extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const filters = this.getFilters();

    const selectedFilters = this.getSelectedFiltersFromURL(filters);

    this.setState({
      filters: filters,
      selectedFilters: selectedFilters,
    });
    this.props.onFiltersChange(selectedFilters);
  }

  componentDidUpdate(prevProps) {
    let filters;
    const changed = this.checkProductsChanged(
      this.props.products,
      prevProps.products
    );
    if (changed) {
      filters = this.getFilters();
    }

    if (this.props.location.search === prevProps.location.search) {
      if (changed) {
        this.setState({
          filters: filters,
        });
      }
      return;
    }

    const selectedFilters = this.getSelectedFiltersFromURL(
      changed ? filters : this.state.filters
    );

    this.setState((prevState) => {
      return {
        filters: changed ? filters : prevState.filters,
        selectedFilters: selectedFilters,
      };
    });
    this.props.onFiltersChange(selectedFilters);
  }

  handleChange = (attribute, itemId) => {
    const item = attribute.items.find((item) => item.id === itemId);

    const selectedFilters = this.state.selectedFilters;
    if (item) {
      selectedFilters[attribute.id] = item.id;
    } else {
      delete selectedFilters[attribute.id];
    }

    this.updateQueryParams();

    this.setState((prevState) => {
      return {
        ...prevState,
        selectedFilters: this.state.selectedFilters,
      };
    });

    this.props.onFiltersChange(this.state.selectedFilters);
  };

  handleSwatchChange = (attribute, itemId) => {
    const item = attribute.items.find((item) => item.id === itemId);

    const selectedFilters = this.state.selectedFilters;
    if (item) {
      const oldValues = selectedFilters[attribute.id];
      if (oldValues && oldValues.some((value) => value === item.id)) {
        const newValues = oldValues.filter((value) => value !== item.id);
        if (newValues.length === 0) {
          delete selectedFilters[attribute.id];
        } else {
          selectedFilters[attribute.id] = newValues;
        }
      } else {
        selectedFilters[attribute.id] = oldValues
          ? [...oldValues, item.id]
          : [item.id];
      }
    }

    this.updateQueryParams();

    this.setState((prevState) => {
      return {
        ...prevState,
        selectedFilters: this.state.selectedFilters,
      };
    });

    this.props.onFiltersChange(this.state.selectedFilters);
  };

  handleCheckBoxClick = (checked, attribute, itemId) => {
    const item = attribute.items.find((item) => item.id === itemId);

    const selectedFilters = this.state.selectedFilters;
    if (checked) {
      selectedFilters[attribute.id] = item.id;
    } else {
      delete selectedFilters[attribute.id];
    }

    this.updateQueryParams();

    this.setState((prevState) => {
      return {
        ...prevState,
        selectedFilters: this.state.selectedFilters,
      };
    });

    this.props.onFiltersChange(this.state.selectedFilters);
  };

  getFilters = () => {
    const filtersMap = new Map();
    this.props.products.forEach((product) => {
      product.attributes.forEach((attribute) => {
        if (filtersMap.has(attribute.id)) {
          let value = filtersMap.get(attribute.id);
          attribute.items.forEach((item) => value.items.set(item.id, item));
          filtersMap.set(attribute.id, value);
        } else {
          const itemsMap = new Map();
          attribute.items.forEach((item) => itemsMap.set(item.id, item));
          filtersMap.set(attribute.id, { ...attribute, items: itemsMap });
        }
      });
    });

    const filters = [];
    filtersMap.forEach((value, key) => {
      value.items = Array.from(value.items.values());
      if (
        value.items.length === 2 &&
        value.items.some((item) => item.id === 'Yes') &&
        value.items.some((item) => item.id === 'No')
      ) {
        value.type = 'YesNoType';
      }
      filters.push(value);
    });

    return filters;
  };

  getSelectedFiltersFromURL = (filters) => {
    const selectedFilters = {};
    if (!this.props.location.search) {
      return selectedFilters;
    }
    let queryParams = decodeURIComponent(this.props.location.search).split('&');
    queryParams[0] = queryParams[0].substring(1);

    queryParams.forEach((params) => {
      const res = params.split('=');
      const filter = filters.find((item) => item.id === res[0]);
      const value = res.slice(1).join();
      if (filter.type === 'swatch') {
        selectedFilters[res[0]] = value.split(',');
      } else {
        selectedFilters[res[0]] = value;
      }
    });

    return selectedFilters;
  };

  checkProductsChanged = (products, prevProducts) => {
    if (products.length !== prevProducts.length) {
      return true;
    }

    let changed = false;
    products.forEach((product) => {
      if (!prevProducts.some((item) => item.id === product.id)) {
        changed = true;
      }
    });

    return changed;
  };

  reset = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        selectedFilters: {},
        selectedColor: undefined,
      };
    }, this.updateQueryParams);

    this.props.onFiltersChange({});
  };

  updateQueryParams = () => {
    let queryParams = '';
    for (const property in this.state.selectedFilters) {
      const newParams = property + '=' + this.state.selectedFilters[property];
      queryParams += queryParams ? '&' + newParams : newParams;
    }
    this.props.history.push({
      pathName: this.props.location.path,
      search: queryParams,
    });
  };

  isSwatchSelected = (filterId, itemId) => {
    const value = this.state.selectedFilters[filterId];
    if (!value) {
      return false;
    }

    return value.find((item) => item === itemId);
  };

  render() {
    return (
      <div className='filters'>
        <div className='filters-title'>Filter items</div>
        {this.state.filters &&
          this.state.filters.map((filter) => (
            <div className='filter' key={filter.id}>
              <div className='filter-name'>{filter.name}:</div>
              {filter.type === 'text' && (
                <select
                  onChange={(event) =>
                    this.handleChange(filter, event.target.value)
                  }
                  value={this.state.selectedFilters[filter.id] ?? 'default'}
                >
                  <option value='default'></option>
                  {filter.items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.value}
                    </option>
                  ))}
                </select>
              )}
              {filter.type === 'swatch' && (
                <div
                  style={{ display: 'flex', justifyContent: 'space-around' }}
                >
                  {filter.items.map((item) => (
                    <div
                      key={item.id}
                      className='color-filter'
                      style={{
                        border: this.isSwatchSelected(filter.id, item.id)
                          ? '1px solid #5ECE7B'
                          : '',
                      }}
                      onClick={() => this.handleSwatchChange(filter, item.id)}
                    >
                      <div
                        style={{
                          backgroundColor: item.value,
                          width: '24px',
                          height: '24px',
                          border:
                            this.state.selectedFilters[filter.id] !== item.id &&
                              item.value === '#FFFFFF'
                              ? '1px solid black'
                              : '',
                        }}
                      ></div>
                    </div>
                  ))}
                </div>
              )}
              {filter.type === 'YesNoType' && (
                <div
                  style={{ display: 'flex', justifyContent: 'space-around' }}
                >
                  {filter.items.map((item) => (
                    <div key={item.id}>
                      <label>{item.displayValue}</label>
                      <input
                        type='checkbox'
                        checked={
                          this.state.selectedFilters[filter.id] === item.id
                        }
                        onChange={(event) =>
                          this.handleCheckBoxClick(
                            event.target.checked,
                            filter,
                            item.id
                          )
                        }
                      ></input>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

        <button className='reset-button' onClick={this.reset}>
          Reset filters
        </button>
      </div>
    );
  }
}

export default withRouter(Filters);
