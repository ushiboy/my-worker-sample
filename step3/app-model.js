var models = {};
addEventListener('message', function(evt) {
  var message = JSON.parse(evt.data),
  model = models[message.modelName];
  model[message.name].apply(model, message.args);
}, false);

/**
 * Observable mixin
 * @param {String} modelName model name 
 * @param {Object} o object
 */
function Observable(modelName, o) {
  models[modelName] = o;   
  o.trigger = function(name) {
    var args = Array.prototype.slice.apply(arguments, [1]);
    postMessage(JSON.stringify({
      modelName : modelName,
      name : name,
      args : args
    }));
  };
  return o;
}

var xhr = new XMLHttpRequest();
xhr.open('GET', 'icecream.json', false);
xhr.send();

// Model Impl ************************************************
var icecreamModel = Observable('icecreamModel', {
  list : JSON.parse(xhr.responseText),
  getAll : function() {
    return this.list;
  },
  findById : function(id) {
    return this.list.filter(function(val) {
      return id === val.id;
    })[0];
  }
}),
selectionModel = Observable('selectionModel', {
  list : [],
  icecreamNumber : 2,
  add : function(item) {
    var list = this.list;
    list.push(item);
    if (list.length > this.icecreamNumber) {
      list.shift();
    }
    this.trigger('update', this);
  },
  addById : function(id) {
    this.add(icecreamModel.findById(id));
  },
  contain : function(icecream) {
    return this.list.indexOf(icecream) >= 0;
  },
  containById : function(id) {
    return this.contain(icecreamModel.findById(id));
  },
  getIcecreams : function() {
    return this.list;
  }
});
icecreamModel.trigger('fetch', icecreamModel);
// Model Impl ************************************************
