import {
  moduleForModel,
  test
} from 'ember-qunit';
import { stubRequest } from "../../helpers/fake-server";
import modelDeps from '../../support/common-model-dependencies';

import Ember from 'ember';

moduleForModel('app', 'App', {
  needs: modelDeps.concat([
    'adapter:app',
    'adapter:operation', // for 'operation', to avoid getting the fixture adapter
  ])
});

test('finding uses correct url', function(){
  expect(2);

  var appId = 'my-app-id';

  stubRequest('get', '/apps/' + appId, function(request){
    ok(true, 'calls with correct URL');

    return this.success({
      id: appId,
      handle: 'my-cool-app',
      _links: {
        account: { href: '/accounts/1' }
      }
    });
  });

  var store = this.store();

  return Ember.run(function(){
    return store.find('app', appId).then(function(){
      ok(true, 'app did find');
    });
  });
});

test('creating POSTs to correct url', function(){
  expect(2);

  var store = this.store();
  var app, stack;
  Ember.run(function(){
    stack = store.createRecord('stack', {id: '1'});
    app = store.createRecord('app', {handle:'my-cool-app', stack:stack});
  });

  stubRequest('post', '/accounts/1/apps', function(request){
    ok(true, 'calls with correct URL');

    return this.success(201, {
      id: 'my-app-id',
      handle: 'my-cool-app'
    });
  });

  return Ember.run(function(){
    return app.save().then(function(){
      ok(true, 'app did save');
    });
  });
});

test('#isDeprovisioned', function(){
  var app = this.subject();

  ok(!app.get('isDeprovisioned'));

  Ember.run(function(){
    app.set('status', 'deprovisioned');
  });

  ok(app.get('isDeprovisioned'));
});

test('embedded lastDeployOperation is sideloaded', function(){
  expect(4);

  var store = this.store();
  var appId = '1',
      opId = 'last-deploy-op';

  stubRequest('get', '/apps/:app_id', function(){
    ok(true, 'gets app by id');
    return this.success({
      id: appId,
      _embedded: {
        last_deploy_operation: {
          id: opId
        }
      }
    });
  });

  return Ember.run(function(){
    return store.find('app', 1).then(function(app){
      ok(app, 'gets app');

      return app.get('lastDeployOperation');
    }).then(function(op){
      ok(op, 'gets op');
      equal(op.get('id'), opId);
    });
  });
});

test('embedded currentImage is sideloaded', function(){
  expect(4);

  var store = this.store();
  var appId = '1',
      imageId = 'image-id';

  stubRequest('get', '/apps/:app_id', function(){
    ok(true, 'gets app by id');
    return this.success({
      id: appId,
      _embedded: {
        current_image: {
          id: imageId
        }
      }
    });
  });

  return Ember.run(function(){
    return store.find('app', 1).then(function(app){
      ok(app, 'gets app');

      return app.get('currentImage');
    }).then(function(image){
      ok(image, 'gets image');
      equal(image.get('id'), imageId);
    });
  });
});
