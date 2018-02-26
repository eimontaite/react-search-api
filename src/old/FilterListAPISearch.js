import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

// defining a higher-order function
// ES6 
const isSearched = searchTerm => item =>
  // condition to be matched when filtering. Returns true if matched
  item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.num_comments.toString().includes(searchTerm) ||
  item.points.toString().includes(searchTerm);

class App extends Component {

  state = {
    result: null,
    searchTerm: DEFAULT_QUERY
  };
  // ES6
  // using arrow function here in order to avoid binding to the constructor (commented out at the top). If I want to use the constructor binding, then: onDismiss(id) =
  onDismiss = (id) => {
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({
      // using the spread operator instead of Object.assign(). NB! Although already used, the object spread operator is not a part of JS ES6. 
      result: { ...this.state.result, hits: updatedHits }
    });
  }

  onSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value });
  }

  onSearchSubmit = () => {
    const {searchTerm} = this.state
    this.fetchSearchTopStories(searchTerm);
  }

  setSearchTopStories = (result) => {
    this.setState({ result });
  }

  fetchSearchTopStories = (searchTerm) => {
   // don't make promises you can't keep! But make a promise you must.
   fetch(PATH_BASE + PATH_SEARCH + '?' + PARAM_SEARCH + DEFAULT_QUERY).then(response => response.json()).then(result => this.setSearchTopStories(result)).catch(error => error);
  }

  componentDidMount() {
    const { searchTerm, result } = this.state;
    this.fetchSearchTopStories(searchTerm);  
    
  }

  render() {
    const { searchTerm, result } = this.state;
    if (!result) { return null; }

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}>
               Search
       </Search>
        </div>
        {result ?
          <Table
            list={result.hits}
            pattern={searchTerm}
            onDismiss={this.onDismiss} />
          : null
        }

      </div>
    );
  }
}
//functional stateless component: const name = (props or named props) => function body. No need to use render, return, curly braces (i.e. the block can be removed)
const Search = ({ value, onChange, onSubmit, children }) =>
  <form onSubmit={onSubmit}>
    {children}
    <input type="text" value={value} onChange={onChange} />
    <button type="submit"> 
    {children}</button>
  </form>

const Table = ({ list, pattern, onDismiss }) =>
  <div className="table">
    {list.filter(isSearched(pattern)).map(item =>
      <div className="table-row" key={item.objectID}>
        <span style={{ width: '40%' }}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={{ width: '30%' }}> {item.author} </span>
        <span style={{ width: '10%' }}>{item.num_comments} </span>
        <span style={{ width: '10%' }}>{item.points}</span>
        <span style={{ width: '10%' }}>
          <Button className="button-inline" onClick={() => onDismiss(item.objectID)} >Dismiss</Button>
        </span>
      </div>
    )}
  </div>

const Button = ({ onClick, className, children }) =>
  <button onClick={onClick}
    className=""
    type="button">
    {children}
  </button>

export default App;
