var counter = 0;

formControls = {
  tags: {
    control: 'qb',
    modal: 'modal',
    source: 'sourcesSelect',
    tables: 'tables',
    table: 'tableSelect',
    content: 'qbcontent',
    contentData: 'qbcontentdata',
    columns: 'qbcolumns',
    conditions: 'qbconditions',
    groups: 'qbgroups',
    having: 'qbhaving',
    orders: 'qborders',
    limit: 'qblimit',
  }
}

function wizardGenerator(prefix, element, modal, title, perform, parent){
  $.post('/wizard/connections',{
    connecitons: 'true'
  }).done(function(response) {
    select_id = "{prefix}{tag}".supplant({
      tag: formControls.tags.source,
      prefix: sanitize(prefix)
    });
    controlId = '{prefix}{tag}'.supplant({
      tag: formControls.tags.control,
      prefix: sanitize(prefix)
    })
    modalId = '{prefix}{tag}'.supplant({
      tag: formControls.tags.modal,
      prefix: sanitize(prefix)
    })

    control = '<div id="{id}">\n'.supplant({
      id: controlId
    });
    control+= '\t<div type="button" class="circular ui icon button" data-toggle="modal" data-target="#{modal_id}">\n'.supplant({
      modal_id: modalId
    });
    control+= '\t\t<i class="wizard large icon"></i>\n';
    control+= '\t</div>\n';
    control+= '</div>\n';

    html ='<div class="modal fade" id="{modal_id}" tabindex="-1" role="dialog" aria-labelledby="{modal_id}Title" aria-hidden="true">\n'.supplant({
      modal_id: modalId
    });
    html+='\t<div class="modal-dialog modal-lg" role="document">\n';
    html+='\t\t<div class="modal-content">\n';
    html+='\t\t\t<div class="modal-body">\n';
    html+='\t\t\t\t<div class="fields">\n'
    html+='\t\t\t\t\t<div class="two wide field">\n'
    html+='\t\t\t\t\t\t{title}\n'.supplant({
      title: title
    });
    html+='\t\t\t\t\t</div>\n'
    html+='\t\t\t\t\t<div class="three wide field">\n'
    html+='\t\t\t\t\t\t<select class="{class}" name="{name}" onchange="wizardContentGenerator(\'{prefix}\', this, \'{modal}\',{perform})" id="{id}">\n'.supplant({
      name: prefixStr(prefix, "[source]"),
      class: "ui fluid search dropdown",
      perform: perform.toString(),
      prefix: prefix,
      id: select_id,
      modal: modal
    });
    html+='\t\t\t\t\t\t\t<option value="">Source</option>\n';
    for (source of response) {
      html+= '\t\t\t\t\t\t\t<option value="{value}">{name}</option>\n'.supplant({
        value: source[0],
        name: source[1],
      });
    }
    html+='\t\t\t\t\t\t</select>\n';
    html+='\t\t\t\t\t</div>\n'
    html+='\t\t\t\t\t<div class="nine wide field" id="{id}"></div>\n'.supplant({
      id: "{prefix}{sufix}".supplant({
        sufix: formControls.tags.tables,
        prefix: sanitize(prefix)
      })
    });
    html+='\t\t\t\t\t<div class="three wide field" id="{id}"></div>\n'.supplant({
      id: prefixStr(sanitize(prefix), formControls.tags.limit)
    });
    html+='\t\t\t\t</div>\n';
    if(perform){ html+='\t\t\t\t<input type="hidden" name="prefix" value="{prefix}">\n'.supplant({
        prefix: prefix
      }); }
    html+='\t\t\t\t<div id="{id}"></div>\n'.supplant({
      id: prefixStr(sanitize(prefix), formControls.tags.content)
    });
    html+='\t\t\t</div>\n';
    html+='\t\t\t<div class="modal-footer">\n';
    html+='\t\t\t\t<button type="button" class="{class}" data-dismiss="modal" onclick="ModalRefresh(\'{parent}\')">Hide</button>\n'.supplant({
      class: "btn btn-secondary",
      parent: parent
    });
    if(perform){
      html+='\t\t\t\t<input type="submit" class="btn btn-secondary">\n';
    }
    html+='\t\t\t</div>\n';
    html+='\t\t</div>\n';
    html+='\t</div>\n';
    html+='</div>\n';
    $('#{id}'.supplant({id: element})).append(control);
    $('#{id}'.supplant({id: modal})).append(html);
    $('#{id}'.supplant({id:select_id})).dropdown();

  });
}

function wizardContentGenerator(prefix, element, modal, perform){
  $.post('/wizard/tables', {
    id: element.options[element.selectedIndex].value,
    data: false
  }).done(function (response) {
    select_id = "{prefix}{tag}".supplant({
      tag: formControls.tags.table,
      prefix: sanitize(prefix)
    });
    html = '\t<select class="{class}" name="{name}" onchange="wizardContentDataGenerator(\'{prefix}\', this, \'{modal}\', {perform})" multiple="true" id="{id}">\n'.supplant({
      name: prefixStr(prefix, "[tables][]"),
      class: "ui dropdown",
      perform: perform.toString(),
      prefix: prefix,
      modal: modal,
      id: select_id
    });
    html+= '\t\t<option value="">Tables</option>\n'
    for (table of response) {
      html+= '\t\t<option value="{value}">{value}</option>\n'.supplant({
        value: table,
      });
    }
    html+= '\t</select>\n';
    html2= '\t<div id="{id}"></div>\n'.supplant({
      id: prefixStr(sanitize(prefix), formControls.tags.contentData)
    });

    document.getElementById(prefixStr(sanitize(prefix), formControls.tags.tables)).innerHTML = html;
    document.getElementById(prefixStr(sanitize(prefix), formControls.tags.content)).innerHTML = html2;
    $('#{id}'.supplant({id: select_id})).dropdown();
  });
}

function wizardContentDataGenerator(prefix, element, modal, perform){
  html = '\t<div class="ui secondary pointing menu">\n';
  html+= '\t\t<a class="item active" data-tab="tab1{prefix}">Columns</a>\n'.supplant({
    prefix: sanitize(prefix)
  });
  html+= '\t\t<a class="item" data-tab="tab2{prefix}">Conditions</a>\n'.supplant({
    prefix: sanitize(prefix)
  });
  html+= '\t\t<a class="item" data-tab="tab3{prefix}">Groups</a>\n'.supplant({
    prefix: sanitize(prefix)
  });
  html+= '\t\t<a class="item" data-tab="tab4{prefix}">Having</a>\n'.supplant({
    prefix: sanitize(prefix)
  });
  html+= '\t\t<a class="item" data-tab="tab5{prefix}">Orders</a>\n'.supplant({
    prefix: sanitize(prefix)
  });
  html+= '\t</div>\n';

  // COLUMNS

  html+= '\t\t<div class="ui bottom attached tab active" data-tab="tab1{prefix}">\n'.supplant({
    prefix: sanitize(prefix)
  });
  html+= '\t\t\t<div class="{class}">\n'.supplant({
    class: "ui small basic buttons loc-btn-10"
  });
  html+= '\t\t\t\t<div onclick="simpleColumnGenerate(\'{prefix}\', \'{metadata}\')" class="ui button">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    name: 'column',
    prefix: prefix
  });
  html+= '\t\t\t\t<div onclick="functionColumnGenerate(\'{prefix}\', \'{metadata}\')" class="ui button">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    name: 'function',
    prefix: prefix
  });
  html+= '\t\t\t\t<div onclick="aliasColumnGenerate(\'{prefix}\', \'{metadata}\')" class="ui button">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    prefix: prefix,
    name: 'alias'
  });
  html+= '\t\t\t</div>\n';
  html+= '\t\t\t<div id="{id}"></div>\n'.supplant({
    id: prefixStr(sanitize(prefix), formControls.tags.columns)
  });
  html+= '\t\t</div>\n';


  // CONDITIONS
  html+= '\t\t<div class="ui bottom attached tab" data-tab="tab2{prefix}">\n'.supplant({
    prefix: sanitize(prefix)
  });
  html+= '\t\t\t<div class="{class}">\n'.supplant({
    class: "ui small basic buttons loc-btn-10"
  });
  html+= '\t\t\t\t<div onclick="simpleConditionGenerate(\'{prefix}\', \'{metadata}\')" class="ui button">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    name: 'condition',
    prefix: prefix
  });
  html+= '\t\t\t\t<div onclick="betweenConditionGenerate(\'{prefix}\', \'{metadata}\')" class="ui button">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    name: 'between',
    prefix: prefix
  });
  html+= '\t\t\t\t<div onclick="includeConditionGenerate2(\'{prefix}\', \'{metadata}\', \'{modal}\')" class="ui button">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    name: 'nested query',
    prefix: prefix,
    modal: modal
  });
  html+= '\t\t\t</div>\n';
  html+= '\t\t\t<div id="{id}"></div>\n'.supplant({
    id: prefixStr(sanitize(prefix), formControls.tags.conditions)
  });
  html+= '\t\t</div>\n';

  // GROUPS
  html+= '\t\t<div class="ui bottom attached tab" data-tab="tab3{prefix}">\n'.supplant({
    prefix: sanitize(prefix)
  });
  html+= '\t\t\t<div class="{class}">\n'.supplant({
    class: "ui small basic buttons loc-btn-10"
  });
  html+= '\t\t\t\t<div onclick="groupGenerate(\'{prefix}\', \'{metadata}\')" class="ui button">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    prefix: prefix,
    name: 'group'
  });
  html+= '\t\t\t</div>\n';
  html+= '\t\t\t<div id="{id}"></div>\n'.supplant({
    id: prefixStr(sanitize(prefix), formControls.tags.groups)
  });
  html+= '\t\t</div>\n';

  // HAVING
  html+= '\t\t<div class="ui bottom attached tab" data-tab="tab4{prefix}">\n'.supplant({
    prefix: sanitize(prefix)
  });
  html+= '\t\t\t<div class="{class}">\n'.supplant({
    class: "ui small basic buttons loc-btn-10"
  });
  html+= '\t\t\t\t<div onclick="havingGenerate(\'{prefix}\', \'{metadata}\')" class="ui button">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    prefix: prefix,
    name: 'having'
  });
  html+= '\t\t\t</div>\n';
  html+= '\t\t\t<div id="{id}"></div>\n'.supplant({
    id: prefixStr(sanitize(prefix), formControls.tags.having)
  });
  html+= '\t\t</div>\n';

  // ORDERS
  html+= '\t\t<div class="ui bottom attached tab" data-tab="tab5{prefix}">\n'.supplant({
    prefix: sanitize(prefix)
  });
  html+= '\t\t\t<div class="{class}">\n'.supplant({
    class: "ui small basic buttons loc-btn-10"
  });
  html+= '\t\t\t\t<div onclick="orderGenerate(\'{prefix}\', \'{metadata}\')" class="ui button">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    prefix: prefix,
    name: 'order'
  });
  html+= '\t\t\t</div>\n';
  html+= '\t\t\t<div id="{id}"></div>\n'.supplant({
    id: prefixStr(sanitize(prefix), formControls.tags.orders)
  });
  html+= '\t\t</div>\n';
  html+= '\t</div>\n';


  document.getElementById(prefixStr(sanitize(prefix), formControls.tags.contentData)).innerHTML = html
  limitGenerate(prefix, selectedOptions(element));
  $('.menu .item').tab();
}

function simpleColumnGenerate(prefix, metadata){
  $.post('/wizard/columns', {
    tables: $("#{prefix}{tag}".supplant({
        tag: formControls.tags.table,
        prefix: sanitize(prefix)
      })).val(),
    id: $("#{prefix}{tag}".supplant({
        tag: formControls.tags.source,
        prefix: sanitize(prefix)
      })).val()
  }).done(function (response) {
    select_id = 'select{prefix}{counter}'.supplant({
      prefix: sanitize(prefix),
      counter: counter
    })
    container_id = "container{counter}".supplant({
      counter: counter
    });

    html = '\t<div class="{class}" id="{id}">\n'.supplant({
      class: "fields",
      id: container_id
    });
    html+= '\t\t<div class="{class}">\n'.supplant({
      class: "five wide field"
    });
    html+= '\t\t\t<select name="{name}" class="{class}" id="{id}">\n'.supplant({
      name: "{prefix}[columns][column{counter}][column]".supplant({
        counter: counter,
        prefix: prefix
      }),
      class: "ui dropdown",
      id: select_id
    });
    html+= optionsGenerator(response[0], 'Columns');
    html+= '\t\t\t</select>\n'
    html+= '\t\t\t<input type="hidden" name="{name}" value="single">\n'.supplant({
      name: '{prefix}[columns][column{counter}][type]'.supplant({
        counter: counter,
        prefix: prefix
      })
    });

    html+= '\t\t</div>\n'
    html+= '\t\t<div class="field">\n';
    html+= '\t\t\t<i class="grey delete icon" onclick="Remove(\'{id}\')"></i>\n'.supplant({
      id: container_id
    })
    html+= '\t\t</div>\n';
    html+= '\t</div>\n'
    $('#{id}'.supplant({id: prefixStr(sanitize(prefix), formControls.tags.columns)})).append(html);
    $('#{id}'.supplant({id: select_id})).dropdown();
    counter++;
  })
}

function functionColumnGenerate(prefix, metadata){
  $.post('/wizard/columns', {
    tables: $("#{prefix}{tag}".supplant({
        tag: formControls.tags.table,
        prefix: sanitize(prefix)
      })).val(),
    id: $("#{prefix}{tag}".supplant({
        tag: formControls.tags.source,
        prefix: sanitize(prefix)
      })).val()
  }).done(function (response) {
    select_id = "select{prefix}{counter}".supplant({
      prefix: sanitize(prefix),
      counter: counter
    })
    select_id2 = "select{counter}{prefix}{counter}".supplant({
      prefix: sanitize(prefix),
      counter: counter
    })
    container_id = "container{counter}".supplant({
      counter: counter
    });

    html = '\t<div class="{class}" id="{id}">\n'.supplant({
      class: "fields",
      id: container_id
    });
    html+= '\t\t<div class="two wide field">\n'
    html+= '\t\t\t<select name="{name}" class="{class}" id="{id}">\n'.supplant({
      name: '{prefix}[columns][column{counter}][func]'.supplant({
        counter: counter,
        prefix: prefix
      }),
      class: "ui fluid search dropdown",
      id: select_id
    });
    for (func of response[2]) {
      html+= '\t\t\t\t<option value="{func}">{func}</option>\n'.supplant({
        func: func
      });
    }
    html+= '\t\t\t</select>\n';
    html+= '\t\t</div>\n'
    html+= '\t\t<div class="five wide field">\n'
    html+= '\t\t\t<select name="{name}" class="{class}" id="{id}">\n'.supplant({
      name: "{prefix}[columns][column{counter}][column]".supplant({
        counter: counter,
        prefix: prefix
      }),
      class: "ui dropdown",
      id: select_id2
    });
    html+= optionsGenerator(response[0], 'Columns');
    html+= '\t\t\t</select>\n';
    html+= '\t\t</div>\n'
    html+= '\t\t<input type="hidden" name="{name}" value="function">\n'.supplant({
      name: '{prefix}[columns][column{counter}][type]'.supplant({
        counter: counter,
        prefix: prefix
      })
    });
    html+= '\t\t<div class="field">\n';
    html+= '\t\t\t<i class="grey delete icon" onclick="Remove(\'{id}\')"></i>\n'.supplant({
      id: container_id
    })
    html+= '\t\t</div>\n';
    html+= '\t</div>\n';

    $('#{id}'.supplant({id: prefixStr(sanitize(prefix), formControls.tags.columns)})).append(html);
    $('#{id}'.supplant({id: select_id})).dropdown();
    $('#{id}'.supplant({id: select_id2})).dropdown();
    counter++;
  })
}

function aliasColumnGenerate(prefix, metadata){
  $.post('/wizard/columns', {
    tables: $("#{prefix}{tag}".supplant({
        tag: formControls.tags.table,
        prefix: sanitize(prefix)
      })).val(),
    id: $("#{prefix}{tag}".supplant({
        tag: formControls.tags.source,
        prefix: sanitize(prefix)
      })).val()
  }).done(function (response) {
    select_id = "select{prefix}{counter}".supplant({
      prefix: sanitize(prefix),
      counter: counter
    })
    select_id2 = "select{counter}{prefix}{counter}".supplant({
      prefix: sanitize(prefix),
      counter: counter
    })
    container_id = "container{counter}".supplant({
      counter: counter
    });

    html ='\t<div class="{class}" id="{id}">\n'.supplant({
      class: "fields",
      id: container_id
    });
    html+='\t\t<div class="two wide field">\n'
    html+='\t\t\t<select name="{name}" class="{class}" id="{id}">\n'.supplant({
      name: '{prefix}[columns][column{counter}][func]'.supplant({
        counter: counter,
        prefix: prefix
      }),
      class: "ui fluid search dropdown",
      id: select_id
    });
    for (func of response[2]) {
      html+='\t\t\t\t<option value="{func}">{func}</option>\n'.supplant({
        func: func
      });
    }
    html+='\t\t\t</select>\n';
    html+='\t\t</div>\n'
    html+='\t\t<div class="five wide field">\n'
    html+='\t\t\t<select name="{name}" class="{class}" id="{id}">\n'.supplant({
      name: "{prefix}[columns][column{counter}][column]".supplant({
        counter: counter,
        prefix: prefix
      }),
      class: "ui dropdown",
      id: select_id2
    });
    html+=optionsGenerator(response[0], 'Columns');
    html+='\t\t\t</select>\n'
    html+='\t\t</div>\n'
    html+='\t\t<div class="five wide field">\n';
    html+='\t\t\t<input type="text" name="{name}" placeholder="Alias">\n'.supplant({
      name: '{prefix}[columns][column{counter}][alias]'.supplant({
        counter: counter,
        prefix: prefix
      })
    })
    html+='\t\t</div>\n'
    html+='\t\t<input type="hidden" name="{name}" value="function">\n'.supplant({
      name: '{prefix}[columns][column{counter}][type]'.supplant({
        counter: counter,
        prefix: prefix
      })
    });
    html+= '\t\t<div class="field">\n';
    html+= '\t\t\t<i class="grey delete icon" onclick="Remove(\'{id}\')"></i>\n'.supplant({
      id: container_id
    })
    html+= '\t\t</div>\n';
    html+='\t</div>\n'

    $('#{id}'.supplant({id: prefixStr(sanitize(prefix), formControls.tags.columns)})).append(html);
    $('#{id}'.supplant({id: select_id})).dropdown();
    $('#{id}'.supplant({id: select_id2})).dropdown();
    counter++;
  })
}

function simpleConditionGenerate(prefix, metadata){
  $.post('/wizard/columns', {
    tables: $("#{prefix}{tag}".supplant({
        tag: formControls.tags.table,
        prefix: sanitize(prefix)
      })).val(),
    id: $("#{prefix}{tag}".supplant({
        tag: formControls.tags.source,
        prefix: sanitize(prefix)
      })).val()
  }).done(function (response) {
    select_id = "select{prefix}{counter}".supplant({
      prefix: sanitize(prefix),
      counter: counter
    });
    select_id2 = "select{counter}{prefix}{counter}".supplant({
      prefix: sanitize(prefix),
      counter: counter
    });
    container_id = "container{counter}".supplant({
      counter: counter
    });

    html = '\t<div class="{class}" id="{id}">\n'.supplant({
      class: "fields",
      id: container_id
    });
    html+= '\t\t<div class="five wide field">\n';
    html+= '\t\t\t<select name="{name}" class="{class}" id="{sid}" onchange="insertInput(this, \'{id}\', \'{prefix}\')">\n'.supplant({
      name: "{prefix}[conditions][condition{counter}][column]".supplant({
        counter: counter,
        prefix: prefix
      }),
      prefix: "{prefix}[conditions][condition{counter}]".supplant({
        counter: counter,
        prefix: prefix
      }),
      id: "{name}{counter}".supplant({
        name: formControls.tags.conditions,
        counter: counter,
        prefix: prefix
      }),
      class: "ui fluid search dropdown",
      sid: select_id
    });
    html+= optionsGenerator(response[0], 'Columns');
    html+= '\t\t\t</select>\n';
    html+= '\t\t</div>\n';
    html+= '\t\t<div class="two wide field">\n';
    html+= '\t\t\t<select name="{name}" class="{class}" id="{sid}">\n'.supplant({
      name: '{prefix}[conditions][condition{counter}][type]'.supplant({
        counter: counter,
        prefix: prefix
      }),
      class: "ui fluid search dropdown",
      sid: select_id2
    });
    for (operator of response[1]) {
      html+= '\t\t\t\t<option value="{operator}">{operator}</option>\n'.supplant({
        operator: operator
      });
    }
    html+= '\t\t\t</select>\n';
    html+= '\t\t</div>\n';
    html+= '\t\t<div id="{id}"></div>\n'.supplant({
      id: "{name}{counter}".supplant({
        name: formControls.tags.conditions,
        counter: counter,
        prefix: prefix
      })
    });
    html+= '\t\t<div class="field">\n';
    html+= '\t\t\t<i class="grey delete icon" onclick="Remove(\'{id}\')"></i>\n'.supplant({
      id: container_id
    })
    html+= '\t\t</div>\n';
    html+= '\t</div>\n'
    $('#{id}'.supplant({id: prefixStr(sanitize(prefix), formControls.tags.conditions)})).append(html);
    $('#{id}'.supplant({id:select_id2})).dropdown();
    $('#{id}'.supplant({id:select_id})).dropdown();
    counter++;
  })
}

function betweenConditionGenerate(prefix, metadata){
  $.post('/wizard/columns', {
    tables: $("#{prefix}{tag}".supplant({
        tag: formControls.tags.table,
        prefix: sanitize(prefix)
      })).val(),
    id: $("#{prefix}{tag}".supplant({
        tag: formControls.tags.source,
        prefix: sanitize(prefix)
      })).val()
  }).done(function (response) {
    select_id = "select{prefix}{counter}".supplant({
      prefix: sanitize(prefix),
      counter: counter
    });
    container_id = "container{counter}".supplant({
      counter: counter
    });

    html = '\t<div class="{class}" id="{id}">\n'.supplant({
      class: "inline fields",
      id: container_id
    });
    html+= '\t\t<div class="field">\n'
    html+= '\t\t\t<select name="{name}" class="{class}" id="{sid}" onchange="insertBetweenInput(this, \'{id}\', \'{prefix}\')">\n'.supplant({
      name: "{prefix}[conditions][condition{counter}][column]".supplant({
        counter: counter,
        prefix: prefix
      }),
      prefix: "{prefix}[conditions][condition{counter}][value]".supplant({
        counter: counter,
        prefix: prefix
      }),
      id: "{name}{counter}".supplant({
        name: formControls.tags.conditions,
        counter: counter,
        prefix: prefix
      }),
      class: "ui dropdown",
      sid: select_id
    });
    html+= optionsGenerator(response[0], 'Columns');
    html+= '\t\t\t</select>\n';
    html+= '\t\t</div>\n';
    html+= '\t\t<label stype="padding: 10px;">BETWEEN</label>\n';
    html+= '\t\t<input type="hidden" name="{name}" value="between">\n'.supplant({
      name: '{prefix}[conditions][condition{counter}][type]'.supplant({
        counter: counter,
        prefix: prefix
      })
    });
    html+= '\t\t<div id="{id}" class="{class}"></div>\n'.supplant({
      id: "{name}{counter}".supplant({
        name: formControls.tags.conditions,
        counter: counter,
        prefix: prefix
      }),
      class: "inline fields loc-btn-0"
    });
    html+= '\t\t<div class="field">\n';
    html+= '\t\t\t<i class="grey delete icon" onclick="Remove(\'{id}\')"></i>\n'.supplant({
      id: container_id
    })
    html+= '\t\t</div>\n';
    html+= '\t</div>\n'
    $('#{id}'.supplant({id: prefixStr(sanitize(prefix), formControls.tags.conditions)})).append(html);
    $('#{id}'.supplant({id:select_id})).dropdown();
    counter++;
  })
}

function includeConditionGenerate2(prefix, metadata, modal){
  $.post('/wizard/columns', {
    tables: $("#{prefix}{tag}".supplant({
        tag: formControls.tags.table,
        prefix: sanitize(prefix)
      })).val(),
    id: $("#{prefix}{tag}".supplant({
        tag: formControls.tags.source,
        prefix: sanitize(prefix)
      })).val()
  }).done(function (response) {
    select_id = "select{prefix}{counter}".supplant({
      prefix: sanitize(prefix),
      counter: counter
    });
    modal_id = '{prefix}{tag}'.supplant({
      tag: formControls.tags.modal,
      prefix: sanitize(prefix)
    })
    container_id = "container{counter}".supplant({
      counter: counter
    });

    html = '\t<div class="{class}" id="{id}">\n'.supplant({
      class: "fields",
      id: container_id
    });
    html+= '\t\t<div class="five wide field">\n';
    html+= '\t\t\t<select name="{name}" class="{class}" id="{sid}">\n'.supplant({
      name: "{prefix}[conditions][condition{counter}][column]".supplant({
        counter: counter,
        prefix: prefix
      }),
      class: "ui dropdown",
      sid: select_id
    });
    html+= optionsGenerator(response[0], 'Columns');
    html+= '\t\t\t</select>\n';
    html+= '\t\t</div>\n';
    html+= '\t\t<input type="hidden" name="{name}" value="inclusion">\n'.supplant({
      name: '{prefix}[conditions][condition{counter}][type]'.supplant({
        counter: counter,
        prefix: prefix
      })
    });
    html+= '\t\t<input type="hidden" name="{name}" value="query">\n'.supplant({
      name: '{prefix}[conditions][condition{counter}][value_type]'.supplant({
        counter: counter,
        prefix: prefix
      })
    });
    html+= '\t\t<div class="field">\n';
    html+= '\t\t\t<div id="{id}"></div>\n'.supplant({
      id: prefixStr('nestedQuery', counter)
    });
    html+= '\t\t</div>\n';
    html+= '\t\t<div class="field">\n';
    html+= '\t\t\t<i class="grey delete icon" onclick="Remove(\'{id}\')"></i>\n'.supplant({
      id: container_id
    })
    html+= '\t\t</div>\n';
    html+= '\t</div>\n';

    next_prefix = '{prefix}[conditions][condition{counter}][value]'.supplant({
      counter: counter,
      prefix: prefix
    });

    $('#{id}'.supplant({id: prefixStr(sanitize(prefix), formControls.tags.conditions)})).append(html);
    wizardGenerator(next_prefix, prefixStr('nestedQuery', counter), modal, 'Nested Query', false, modal_id);
    $('#{id}'.supplant({id:select_id})).dropdown();

    counter++;
  })
}

function groupGenerate(prefix, metadata){
  $.post('/wizard/columns', {
    tables: $("#{prefix}{tag}".supplant({
        tag: formControls.tags.table,
        prefix: sanitize(prefix)
      })).val(),
    id: $("#{prefix}{tag}".supplant({
        tag: formControls.tags.source,
        prefix: sanitize(prefix)
      })).val()
  }).done(function (response) {
    select_id = "select{prefix}{counter}".supplant({
      prefix: sanitize(prefix),
      counter: counter
    });
    container_id = "container{counter}".supplant({
      counter: counter
    });

    html = '\t<div class="{class}" id="{id}">\n'.supplant({
      class: "fields",
      id: container_id
    });
    html+= '\t\t<div class="five wide field">\n'
    html+= '\t\t\t<select name="{name}" class="{class}" id="{id}">\n'.supplant({
      name: "{prefix}[groups][group{counter}][column]".supplant({
        counter: counter,
        prefix: prefix
      }),
      class: "ui dropdown",
      id: select_id
    });
    html+= optionsGenerator(response[0], 'Columns');
    html+= '\t\t\t</select>\n'
    html+= '\t\t</div>\n'
    html+= '\t\t<div class="field">\n';
    html+= '\t\t\t<i class="grey delete icon" onclick="Remove(\'{id}\')"></i>\n'.supplant({
      id: container_id
    })
    html+= '\t\t</div>\n';
    html+= '\t</div>\n'

    $('#{id}'.supplant({id: prefixStr(sanitize(prefix), formControls.tags.groups)})).append(html);
    $('#{id}'.supplant({id:select_id})).dropdown();

    counter++;
  })
}

function havingGenerate(prefix, metadata){
  $.post('/wizard/columns', {
    tables: $("#{prefix}{tag}".supplant({
        tag: formControls.tags.table,
        prefix: sanitize(prefix)
      })).val(),
    id: $("#{prefix}{tag}".supplant({
        tag: formControls.tags.source,
        prefix: sanitize(prefix)
      })).val()
  }).done(function (response) {
    select_id = "select{prefix}{counter}".supplant({
      prefix: sanitize(prefix),
      counter: counter
    });
    select_id2 = "select{counter}{prefix}{counter}".supplant({
      prefix: sanitize(prefix),
      counter: counter
    });
    select_id3 = "s{counter}select{prefix}{counter}".supplant({
      prefix: sanitize(prefix),
      counter: counter
    });
    container_id = "container{counter}".supplant({
      counter: counter
    });

    html = '\t<div class="{class}" id="{id}">\n'.supplant({
      class: "fields",
      id: container_id
    });
    html+= '\t\t<div class="two wide field">\n';
    html+= '\t\t\t<select name="{name}" id="{sid}" class="{class}">\n'.supplant({
      name: '{prefix}[having][having{counter}][func]'.supplant({
        counter: counter,
        prefix: prefix
      }),
      class: "ui fluid search dropdown",
      sid: select_id
    });
    for (func of response[2]) {
      html+= '\t\t\t\t<option value="{func}">{func}</option>\n'.supplant({
        func: func
      });
    }
    html+= '\t\t\t</select>\n';
    html+= '\t\t</div>\n';
    html+= '\t\t<div class="five wide field">\n';
    html+= '\t\t\t<select name="{name}" class="{class}" id="{sid}" onchange="insertInput(this, \'{id}\', \'{prefix}\')">\n'.supplant({
      name: "{prefix}[having][having{counter}][column]".supplant({
        counter: counter,
        prefix: prefix
      }),
      prefix: "{prefix}[having][having{counter}]".supplant({
        counter: counter,
        prefix: prefix
      }),
      id: "{name}{counter}".supplant({
        name: formControls.tags.having,
        counter: counter,
        prefix: prefix
      }),
      class: "ui fluid search dropdown",
      sid: select_id2
    });
    html+= optionsGenerator(response[0], 'Columns');
    html+= '\t\t\t</select>\n';
    html+= '\t\t</div>\n';
    html+= '\t\t<div class="two wide field">\n';
    html+= '\t\t\t<select name="{name}" id="{sid}" class="{class}">\n'.supplant({
      name: '{prefix}[having][having{counter}][type]'.supplant({
        counter: counter,
        prefix: prefix
      }),
      class: "ui fluid search dropdown",
      sid: select_id3
    });
    for (operator of response[1]) {
      html+= '\t\t\t\t<option value="{operator}">{operator}</option>\n'.supplant({
        operator: operator
      });
    }
    html+= '\t\t\t</select>\n';
    html+= '\t\t</div>\n';
    html+= '\t\t<div id="{id}"></div>\n'.supplant({
      id: "{name}{counter}".supplant({
        name: formControls.tags.having,
        counter: counter,
        prefix: prefix
      })
    });
    html+= '\t\t<div class="field">\n';
    html+= '\t\t\t<i class="grey delete icon" onclick="Remove(\'{id}\')"></i>\n'.supplant({
      id: container_id
    })
    html+= '\t\t</div>\n';
    html+= '\t</div>\n';

    $('#{id}'.supplant({id: prefixStr(sanitize(prefix), formControls.tags.having)})).append(html);
    $('#{id}'.supplant({id:select_id3})).dropdown();
    $('#{id}'.supplant({id:select_id2})).dropdown();
    $('#{id}'.supplant({id:select_id})).dropdown();
    counter++;
  })
}

function orderGenerate(prefix, metadata){
  $.post('/wizard/columns', {
    tables: $("#{prefix}{tag}".supplant({
        tag: formControls.tags.table,
        prefix: sanitize(prefix)
      })).val(),
    id: $("#{prefix}{tag}".supplant({
        tag: formControls.tags.source,
        prefix: sanitize(prefix)
      })).val()
  }).done(function (response) {
    select_id = "select{prefix}{counter}".supplant({
      prefix: sanitize(prefix),
      counter: counter
    });
    select_id2 = "select{counter}{prefix}{counter}".supplant({
      prefix: sanitize(prefix),
      counter: counter
    });
    container_id = "container{counter}".supplant({
      counter: counter
    });

    html = '\t<div class="{class}" id="{id}">\n'.supplant({
      class: "fields",
      id: container_id
    });
    html+= '\t\t<div class="five wide field">\n';
    html+= '\t\t\t<select name="{name}" class="{class}" id="{sid}">\n'.supplant({
      name: "{prefix}[orders][order{counter}][column]".supplant({
        counter: counter,
        prefix: prefix
      }),
      class: "ui dropdown",
      sid: select_id
    });
    html+= optionsGenerator(response[0], 'Columns');
    html+= '\t\t\t</select>\n'
    html+= '\t\t</div>\n';
    html+= '\t\t<div class="four wide field">\n';
    html+= '\t\t\t<select name="{name}" class="{class}" id="{sid}">\n'.supplant({
      name: "{prefix}[orders][order{counter}][type]".supplant({
        counter: counter,
        prefix: prefix
      }),
      class: "ui dropdown",
      sid: select_id2
    });
    html+= '\t\t\t\t<option value="ASC" selected="true">Ascending</option>\n';
    html+= '\t\t\t\t<option value="DESC">Descending</option>\n';
    html+= '\t\t\t</select>\n';
    html+= '\t\t</div>\n';
    html+= '\t\t<div class="field">\n';
    html+= '\t\t\t<i class="grey delete icon" onclick="Remove(\'{id}\')"></i>\n'.supplant({
      id: container_id
    })
    html+= '\t\t</div>\n';
    html+= '\t</div>\n';

    $('#{id}'.supplant({id: prefixStr(sanitize(prefix), formControls.tags.orders)})).append(html);
    $('#{id}'.supplant({id:select_id2})).dropdown();
    $('#{id}'.supplant({id:select_id})).dropdown();

    counter++;
  })
}

function limitGenerate(prefix, metadata){
  html= '\t\t\t<input type="text" name="{name}" placeholder="Limit">\n'.supplant({
    name: prefixStr(prefix, '[limit]')
  });
  document.getElementById(prefixStr(sanitize(prefix), formControls.tags.limit)).innerHTML = html;
}



function optionsGenerator(data, head){
  html = '\t';
  html+= '<option value="">{head}</option>\n'.supplant({head:head})
  for (table of data) {
    html+= '\t\t\t<option disabled="true">{name}</option>\n'.supplant({
      name: table[0]
    })
    for (column of table[1]) {
      html+= '\t\t\t<option value="{value}" dtype="{type}">{name}</option>\n'.supplant({
        value: [table[0], column[0]].join('.'),
        name: column[0],
        type: column[1]
      })
    }
  }
  return html;
}

function inputString(name) {
  return '\t<input type="text" name="{name}[value]" placeholder="Value">\n'.supplant({
    name: name
  })
}

function insertInput(element, id, name){

  dataType = $(element.options[element.selectedIndex]).attr('dtype');
  html = "";

  switch (dataType) {
    default:
      html+= inputString(name);
  }

  html+= '\t\t<input type="hidden" name="{name}[value_type]" value="{type}">\n'.supplant({
    type: dataType,
    name: name
  });

  document.getElementById(id).innerHTML = html;
}

function insertBetweenInput(element, id, name){

  var dataType = $(element.options[element.selectedIndex]).attr('dtype');
  var html = '';

  switch (dataType) {
    default:
      html+= inputString(prefixStr(name,'[value1]'), 1);
      html+= '\t\t<label stype="padding: 10px;">AND</label>\n';
      html+= inputString(prefixStr(name,'[value2'), 2);
  }

  html+= '\t\t<input type="hidden" name="{name}[value1][type]" value="{type}">\n'.supplant({
    type: dataType,
    name: name
  });
  html+= '\t\t<input type="hidden" name="{name}[value2][type]" value="{type}">\n'.supplant({
    type: dataType,
    name: name
  });

  document.getElementById(id).innerHTML = html;
}


function selectedOptions(element){
  return 'deprecated';
}

function Remove(id) {
  document.getElementById(id).remove();
}

function ModalRefresh(id) {
  $('#{id}'.supplant({id:id})).focus()
}
