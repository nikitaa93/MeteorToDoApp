import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import './main.html';
import App from '../imports/ui/App.js';

import '../imports/startup/accounts-config.js';



  

  Meteor.startup(() => {
    render(<App />, document.getElementById('render-target')); });

