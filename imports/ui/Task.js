import React, { Component } from 'react';
import { Tasks } from '../api/tasks.js';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
// Task component - represents a single todo item
export default class Task extends Component {
  toggleChecked() {
    // Set the checked property to the opposite of its current value
   
    Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
  }
 
  deleteThisTask() {
    //Tasks.remove(this.props.task._id);
    Meteor.call('tasks.remove', this.props.task._id);
  }
  togglePrivate() {
    Meteor.call('tasks.setPrivate', this.props.task._id, ! this.props.task.private);
  }
  render() {
   // const taskClassName = this.props.task.checked ? 'checked' : '';
    const taskClassName = classnames({
      checked: this.props.task.checked,
      private: this.props.task.private,
    });
    return (
     // <li>{this.props.task.text}</li>
      <li className={taskClassName}>
        <button className='delete' onClick={this.deleteThisTask.bind(this)}>
          &times;
        </button>
 
        <input
          type='checkbox'
          readOnly
          checked={!!this.props.task.checked}
          onClick={this.toggleChecked.bind(this)}
        />
        { this.props.showPrivateButton ? (
          <button className='toggle-private' onClick={this.togglePrivate.bind(this)}>
            { this.props.task.private ? 'Private' : 'Public' }
          </button>
        ) : ''}
       
        <span className='text'>
          <strong>{this.props.task.username}</strong>: {this.props.task.text}
        </span>
      </li>
    );
  }
}