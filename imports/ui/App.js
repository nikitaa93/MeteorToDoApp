import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';

import Task from './Task.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';


// App component - represents the whole app
class App extends Component {

  constructor(props) {
    super(props);
 
    this.state = {
      hideCompleted: false,
    };
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }
  handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    Meteor.call('tasks.insert', text);
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }
 
  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    
    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;
      return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton}
        />
      );
 
      
    });
    
  }

  render() {
    return (
      <div className='container'>
        <header>
          <h4>Todo List : ({this.props.incompleteCount})</h4>
          <label className='hide-completed'>
            <input
              type='checkbox'
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Tasks
          </label>
          <AccountsUIWrapper />
         
          { this.props.currentUser ?
            <form className='new-task' onSubmit={this.handleSubmit.bind(this)} >
              <input
                type='text'
                ref='textInput'
                placeholder='Type to add new tasks'
              />
            </form> : ''
          }
        </header>
  
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}
export default withTracker(() => {
  Meteor.subscribe('tasks');
    return {
     // tasks: Tasks.find({}).fetch(),
      
      tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),

      incompleteCount: Tasks.find({ checked: {$ne: true} }).count(),
      currentUser: Meteor.user(),
      //$ne means not equal to.
      //It is preferable to use this instead of {checked: false} since it also includes the ones where 
      //the checked attribute isn't in the document {} and the case where {checked: null} as both of these are 
      //cases where checked isn't equal to true & are also not false.

      // This way if you have a fresh document without any attributes it would also be a result of the query.
    };
  })(App);
