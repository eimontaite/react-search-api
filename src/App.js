import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

const DEFAULT_QUERY = 'redux';
// const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
// const PARAM_HPP = 'hitsPerPage='

class App extends Component {

  state = {
    results: null,
    searchKey: '',
    searchTerm: DEFAULT_QUERY,
    error: null,
  };
  // ES6
  // using arrow function here in order to avoid binding to the constructor (commented out at the top). If I want to use the constructor binding, then: onDismiss(id) =
  onDismiss = (id) => {
    const {searchKey, results} = this.state;
    const {hits, page} = results[searchKey];

    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);
    this.setState({
      // using the spread operator instead of Object.assign(). NB! Although already used, the object spread operator is not a part of JS ES6. 
      results: { 
        ...results, 
        [searchKey]: {hits: updatedHits, page }
      }
    });
  }

  needsToSearchTopStories = (searchTerm) => {
    return !this.state.results[searchTerm];
  }

  // remove oldHits to not add newHits to the old ones
  setSearchTopStories = (result) => {
    const {hits, page} = result;
    const {searchKey, results} = this.state;

    const oldHits = results && results[searchKey] ? results[searchKey].hits : [];

    const updatedHits = [
      ...oldHits,
      ...hits
  ]; 

    this.setState({
      results: {
        ...results, 
        [searchKey]: {hits: updatedHits, page}
    }
    });
  }
// add  + "&" + PARAM_HPP + DEFAULT_HPP to fetch more results
  fetchSearchTopStories = (searchTerm, page = 0) => {
   // don't make promises you can't keep! But make a promise you must.
   axios.get(PATH_BASE + PATH_SEARCH + '?' + PARAM_SEARCH + searchTerm + "&" + PARAM_PAGE + page).then(result => this.setSearchTopStories(result.data)).catch(error => this.setState({error}));
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({searchKey: searchTerm});
    this.fetchSearchTopStories(searchTerm);   
  }

  onSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value });
  }

  // pass event when using event.preventDefault();
  onSearchSubmit = (event) => {
    const {searchTerm} = this.state
    this.setState({searchKey: searchTerm});
    
    if(this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm)
    }
    event.preventDefault();
  }

  render() {
    const { searchTerm, results, searchKey, error } = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];
    if (!results) { return null; }
    console.log(this.state);
    console.log(PATH_BASE + PATH_SEARCH + '?' + PARAM_SEARCH + searchTerm + "&" + PARAM_PAGE + page);
    if (error) {
      return <p>Something went wrong.</p>
    }
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
        {error ? <div className="interactions">
        <p>Something went wrong.</p>
        </div> : 
          <Table
            list={list}
            onDismiss={this.onDismiss} />
        }
        <div className="interactions">
        <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>More</Button>
        </div>

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

const Table = ({ list, onDismiss }) =>
  <div className="table">
    {list.map(item =>
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
