import './dashboard-heading.jade';
import { Template } from 'meteor/templating';
import { Harvests } from '/imports/api/harvests/harvests.js';
import { Attempts } from '/imports/api/attempts/attempts.js';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { pageState } from '../../pages/harvests/harvests.js';

Template.expandedDashboard.events({
  'click #errors'(){
    if(!_.isUndefined(this._id)) {
      FlowRouter.go('records', {harvestId: this._id}, {"sort": "errors"});
    }
  },
  'click #records'() {
    if(!_.isUndefined(this._id)) {
      FlowRouter.go('records', {harvestId: this._id});
    }
  },
  'click button'(event) {
    event.preventDefault();
    event.stopPropagation();
    pageState.set('editMode', true);
    pageState.set('harvestId', null);
  }
});

Template.normalDashboard.events({
  'click button'(event) {
    event.preventDefault();
    event.stopPropagation();
    pageState.set('editMode', true);
    pageState.set('harvestId', null);
  }
});

Template.dashboardHeading.helpers({
  dataSources() {
    return Template.instance().state.get('harvests.count');
  },
  records() {
    return this.last_record_count;
  },
  attempts() {
    return 0;
  },
  errors() {
    return this.last_bad_count;
  }
});

Template.dashboardHeading.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.set('harvests.count', null);
  this.state.set('harvests.total_datasets', null);
  Meteor.call('harvests.count', (err, res) => {
    if(err) {
      console.error(err);
    } else {
      this.state.set('harvests.count', res);
    }
  });
});


Template.expandedDashboard.onRendered(function() {
  this.$('.showtip').tooltip();
});

Template.normalDashboard.helpers({
  totalDatasets() {
    let retval = Template.instance().state.get('harvests.total_datasets');
    return retval;
  }
});

Template.normalDashboard.onRendered(function() {
  this.$('.showtip').tooltip();
});

Template.normalDashboard.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.set('harvests.total_datasets', null);
  Meteor.call('harvests.total_datasets', (err, res) => {
    if(err) {
      console.error(err);
    } else {
      this.state.set('harvests.total_datasets', res);
    }
  });
});

