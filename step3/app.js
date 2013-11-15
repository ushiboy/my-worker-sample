!function() {

  'use strict';

  // Framework *************************************************
  var Nanigashi = (function(modelScript) {
    var worker = new Worker(modelScript),
    $eventManager = $({});
    worker.addEventListener('message', function(evt) {
      var message = JSON.parse(evt.data);
      $eventManager.trigger(message.modelName + '#' + message.name, message.args);
    }, false);

    /**
     * Controllable mixi
     * @param {Object} obj object
     */
    function Controllable(obj) {
      obj.control = control;
      return obj;
    }

    /**
     * control model
     * @param {Model} model
     * @param {String} name model method name
     */
    function control(model, name) {
      var args = Array.prototype.slice.apply(arguments, [2]);
      worker.postMessage(JSON.stringify({
        modelName : model.getName(),
        name : name,
        args : args
      }));
    }

    /**
     * Model for document layer
     * @constructor
     * @param {String} name model name
     */
    function Model(name) {
      this.name = name;
    }
    Model.prototype.getName = function() {
      return this.name;
    };
    /**
     * listen model
     * @param {String} eventName
     * @param {Function} listener
     */
    Model.prototype.on = function(eventName, listener) {
      $eventManager.on(this.name + '#' + eventName, listener);
    };

    return { 
      Model : Model,
      Controllable : Controllable 
    }
  })('app-model.js');
  // Framework *************************************************

  // Model document layer  *************************************
  var icecreamModel = new Nanigashi.Model('icecreamModel'),
  selectionModel = new Nanigashi.Model('selectionModel');
  // Model document layer  *************************************

  // View ******************************************************
  icecreamModel.on('fetch', function(evt, icecreamModel) {
    var $els = $('#icecreams');
    $.each(icecreamModel.list, function(i, icecream) {
      $els.append(
        $('<li />')
        .append($('<input type="checkbox" />').attr('name', icecream.id))
        .append($('<span />').text(icecream.name))
      );
    });
  });
  function updateViews(evt, selectionModel) {
    updateSelection(selectionModel);
    updateIcecreamList(selectionModel);
  }
  function updateSelection(selectionModel) {
    $('#icecreams input[type="checkbox"]').each(function(i, el) {
      el.checked = selectionModel.list.filter(function(icecream) {
        return icecream.id === el.name;  
      }).length > 0;
    });
  }
  function updateIcecreamList(selectionModel) {
    $('#icecream-list').text(
      $.map(selectionModel.list, function(val) {
        return val.name;
      }).join(' > ')
    );
  }
  selectionModel.on('update', updateViews);
  // View ******************************************************

  // Controller ************************************************
  var controller = Nanigashi.Controllable({
    init : function() {
      $('#icecreams').on('click', 'li', $.proxy(this.onclickIcecream, this));
      this.control(icecreamModel, 'fetch');
    },
    onclickIcecream : function(evt) {
      var $checkbox = $(evt.currentTarget).find('input[type="checkbox"]');
      if ($checkbox) {
        this.control(selectionModel, 'addById', $checkbox.attr('name'));
      }
    }
  });
  $(function() {
    controller.init();
  });
  // Controller ************************************************

}();
