import {
  moduleForComponent,
  test
} from 'ember-qunit';

import Ember from 'ember';

moduleForComponent('service-scaler', 'ServiceScalerComponent', {
  needs: ['component:no-ui-slider', 'component:estimated-cost']
});

test('it renders', function() {
  expect(2);

  // creates the component instance
  var component = this.subject({
    service: Ember.Object.create({
      containerCount: 1
    })
  });
  equal(component._state, 'preRender');

  // appends the component to the page
  this.render();
  equal(component._state, 'inDOM');
});
