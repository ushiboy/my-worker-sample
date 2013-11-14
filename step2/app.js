!function() {

  'use strict';

  /**
   * Observable mixin
   * @param {Object} o object
   */
  function Observable(o) {
    o._$e = $({});
    o.on = function() {
      this._$e.on.apply(this._$e, arguments);
    };
    o.off = function() {
      this._$e.off.apply(this._$e, arguments);
    };
    o.trigger = function() {
      this._$e.trigger.apply(this._$e, arguments);
    };
    return o;
  }

  // Model *****************************************************
  var icecreamModel = {
    list : [
      { id : 't1', name : 'バニラ' },
      { id : 't2', name : 'チョコレートチップ' },
      { id : 't3', name : 'オレンジシャーベット' },
      { id : 't4', name : 'チョコミント' },
      { id : 't5', name : 'ストロベリー' },
      { id : 't6', name : '抹茶' }
    ],
    getAll : function() {
      return this.list;
    },
    findById : function(id) {
      return $.grep(this.list, function(val) {
        return id === val.id;
      })[0];
    }
  },
  selectionModel = Observable({
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
  // Model *****************************************************

  // View ******************************************************
  $(function() {
    var $els = $('#icecreams');
    $.each(icecreamModel.getAll(), function(i, icecream) {
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
      el.checked = selectionModel.containById(el.name);
    });
  }
  function updateIcecreamList(selectionModel) {
    $('#icecream-list').text(
      $.map(selectionModel.getIcecreams(), function(val) {
        return val.name;
      }).join(' > ')
    );
  }
  selectionModel.on('update', updateViews);
  // View ******************************************************

  // Controller ************************************************
  function onclickIcecream(evt) {
    var $checkbox = $(evt.currentTarget).find('input[type="checkbox"]');
    if ($checkbox) {
      selectionModel.add(icecreamModel.findById($checkbox.attr('name')));
    }
  }
  $(function() {
    $('#icecreams').on('click', 'li', onclickIcecream);
  });
  // Controller ************************************************

}();
