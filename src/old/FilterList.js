import React, { Component } from 'react';
import './App.css';
// defining a higher-order function 

// function isSearched(searchTerm) {
//   return function(item) {
//     // condition to be matched when filtering. Returns true if matched
//     return item.title.toLowerCase().includes(searchTerm.toLowerCase());
//   }
// }
// ES6 
const isSearched = searchTerm => item =>
  // condition to be matched when filtering. Returns true if matched
  item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.num_comments.toString().includes(searchTerm) ||
  item.points.toString().includes(searchTerm);

class App extends Component {
  // constructor(props) {
  //   super(props);

  state = {
    list: [
      {
        title: 'React',
        url: "https://facebook.github.io/react/",
        author: "Jordan Walke",
        num_comments: 35408175547,
        points: 4,
        objectID: 0,
      },
      {
        title: 'Redux',
        url: "https://github.com/reactjs/redux",
        author: "Dan Abramov",
        num_comments: 47803178547,
        points: 5,
        objectID: 1,
      },
      {
        title: 'Whatever',
        url: "https://www.google.com",
        author: "ME",
        num_comments: 4910531111,
        points: 100,
        objectID: 2,
      }
    ],
    searchTerm: ""
  }
  // to define as a class method, bind to the constructor
  // this.onDismiss = this.onDismiss.bind(this);}


  // onDismiss(id) {
  //   function isNotId(item){
  //     return item.objectID !== id;
  //   }
  //   const updatedList = this.state.list.filter(isNotId);
  // }
  // ES6
  // using arrow function here in order to avoid binding to the constructor (commented out at the top). If I want to use the constructor binding, then: onDismis(id) = 
  onDismiss = (id) => {
    const isNotId = item => item.objectID !== id;
    const updatedList = this.state.list.filter(isNotId);
    this.setState({ list: updatedList });
  }

  onSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value });

  }

  // object initializer
  render() {
    const { searchTerm, list } = this.state;

    return (
      <div className="page">
      <div className="interactions">
        <Search
          value={searchTerm}
          onChange={this.onSearchChange}>
          Search
       </Search>
       </div>
        <Table
          list={list}
          pattern={searchTerm}
          onDismiss={this.onDismiss} />

      </div>
    );
  }
}
/* {this.state.list.map(item =>
          // You have to assign a key attribute to each list element. That way React is able to identify added, changed and removed items when the list changes. 
          <div key={item.objectID}>
            <span>
              <a href={item.url}>{item.title}</a>
            </span>
            <span> {item.author} </span>
            <span>{item.num_comments} </span>
            <span>{item.points}</span>
            <span>
              <button onClick={() => this.onDismiss(item.objectID)} >Dismiss</button>
            </span>
          </div> */

          //functional stateless component: const name = (props or named props) => function body. No need to use render, return, curly braces (i.e. the block can be removed)
const Search = ( {value, onChange, children }) => 
      <form>
        {children}
        <input type="text" value={value} onChange={onChange} />
      </form> 
  
const Table = ({list, pattern, onDismiss}) => 
      <div className = "table">
        {list.filter(isSearched(pattern)).map(item =>
              <div className="table-row" key={item.objectID}>
                <span style={{width: '40%'}}>
                  <a href={item.url}>{item.title}</a>
                </span>
                <span style={{width: '30%'}}> {item.author} </span>
                <span style={{width: '10%'}}>{item.num_comments} </span>
                <span style={{width: '10%'}}>{item.points}</span>
                <span style={{width: '10%'}}>
                  <Button className="button-inline" onClick={() => onDismiss(item.objectID)} >Dismiss</Button>
                </span>
                </div>
       )}
       </div>
      


const Button = ({onClick, className, children}) =>
      <button onClick={onClick}
      className=""
      type="button">
      {children}
      </button>

export default FilterList;
