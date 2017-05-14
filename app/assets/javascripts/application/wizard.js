var counter = 0;

formControls = {
  tags: {
    control: 'qb',
    modal: 'modal',
    tables: 'tables',
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

function wizardGenerator(prefix, element, modal, title, perform){
  $.post('/wizard/connections',{
    connecitons: 'true'
  }).done(function(response) {
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
    control+= '\t<i class="browser large icon"></i>\n';
    control+= '\t</div>\n';
    control+= '</div>\n';

    html ='\n<div class="modal fade" id="{modal_id}" tabindex="-1" role="dialog" aria-labelledby="{modal_id}Title" aria-hidden="true">\n'.supplant({
      modal_id: modalId
    });
    html+='\t<div class="modal-dialog modal-lg" role="document">\n';
    html+='\t\t<div class="modal-content">\n';
    html+='\t\t\t<div class="modal-header">\n';
    html+='\t\t\t\t<div class="fields">\n'
    html+='\t\t\t\t\t<div class="two wide field">\n'
    html+='\t\t\t\t\t\t<label id="{modal_id}Title">{title}</label>\n'.supplant({
      title: title
    });
    html+='\t\t\t\t\t</div>\n'
    html+='\t\t\t\t\t<div class="four wide field">\n'
    select_id = "select{prefix}1".supplant({
      prefix: sanitize(prefix)
    })
    html+= '\t\t\t\t\t\t<select class="{class}" name="{name}" onchange="wizardContentGenerator(\'{prefix}\', this, \'{modal}\')" id="{id}">\n'.supplant({
      name: prefixStr(prefix, "[source]"),
      prefix: prefix,
      modal: modal,
      class: "ui dropdown",
      id: select_id
    });
    html+= '\t\t\t\t\t\t\t<option value="">Source</option>\n'
    for (source of response) {
      html+= '\t\t\t\t\t\t\t<option value="{value}">{name}</option>\n'.supplant({
        value: source[0],
        name: source[1],
      });
    }
    html+='\t\t\t\t\t\t</select>\n'
    html+='\t\t\t\t\t</div>\n'
    html+='\t\t\t\t\t<div class="ten wide field" id="{id}"></div>\n'.supplant({
      id: "{prefix}{sufix}".supplant({
        sufix: formControls.tags.tables,
        prefix: sanitize(prefix)
      })
    });
    html+='\t\t\t\t</div>\n';
    html+='\t\t\t\t<div class="modal-body">\n';
    if(perform){
      html+='\t\t\t\t\t<input type="hidden" name="prefix" value="{prefix}">\n'.supplant({
        prefix: prefix
      });
    }

    html+='\t\t\t\t\t<div id="{id}"></div>\n'.supplant({
      id: prefixStr(sanitize(prefix), formControls.tags.content)
    });

    html+='\t\t\t\t</div>\n';
    html+='\t\t\t\t<div class="modal-footer">\n';
    html+='\t\t\t\t\t<button type="button" class="btn btn-secondary" data-dismiss="modal">Hide</button>\n';
    if (perform) {
      html+='\t\t\t\t\t<input type="submit" class="btn btn-secondary" value="Submit"> \n';
    }
    html+='\t\t\t\t</div>\n';
    html+='\t\t\t</div>\n';
    html+='\t\t</div>\n';
    html+='\t</div>\n';
    html+='</div>\n';

    $('#{id}'.supplant({id: element})).append(control);
    $('#{id}'.supplant({id: modal})).append(html);
    $('#{id}'.supplant({id:select_id})).dropdown();

  });
}

function wizardContentGenerator(prefix, element, modal){
  $.post('/wizard/tables', {
    id: element.selectedIndex.value,
    data: false
  }).done(function (response) {
    select_id = "select{prefix}2".supplant({
      prefix: sanitize(prefix)
    })
    html = '\t<select class="{class}" name="{name}" onchange="wizardContentDataGenerator(\'{prefix}\', this, \'{modal}\')" multiple="true" id="{id}">\n'.supplant({
      name: prefixStr(prefix, "[tables][]"),
      prefix: prefix,
      modal: modal,
      class: "ui dropdown",
      id: select_id
    });
    html+= '\t\t\t\t\t\t\t<option value="">Tables</option>'
    for (table of response) {
      html+= '\t\t<option value="{value}">{value}</option>\n'.supplant({
        value: table,
      });
    }
    html+= '\t</select>\n';
    html2= '\t<div id="{id}"></div>'.supplant({
      id: prefixStr(sanitize(prefix), formControls.tags.contentData)
    });

    document.getElementById(prefixStr(sanitize(prefix), formControls.tags.tables)).innerHTML = html;
    document.getElementById(prefixStr(sanitize(prefix), formControls.tags.content)).innerHTML = html2;
    $('#{id}'.supplant({id: select_id})).dropdown();
  });
}

function wizardContentDataGenerator(prefix, element, modal){
  // COLUMNS
  html = '\t<div class="{class}">\n'.supplant({
    class: "ui small basic icon buttons"
  });
  html+= '\t\t<div onclick="simpleColumnGenerate(\'{prefix}\', \'{metadata}\')" class="ui button">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    name: '<i class="align left icon"></i>',
    prefix: prefix
  });
  html+= '\t\t<div onclick="functionColumnGenerate(\'{prefix}\', \'{metadata}\')" class="ui button">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    name: '<i class="align left icon"></i>',
    prefix: prefix
  });
  html+= '\t\t<div onclick="aliasColumnGenerate(\'{prefix}\', \'{metadata}\')" class="ui button">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    prefix: prefix,
    name: '<i class="align left icon"></i>'
  });
  html+= '\t</div>\n';
  html+= '\t<div id="{id}"></div>\n'.supplant({
    id: prefixStr(sanitize(prefix), formControls.tags.columns)
  });
  // CONDITIONS
  html+= '\t<div class="{class}">\n'.supplant({
    class: "ui small basic icon buttons"
  });
  html+= '\t\t<div onclick="simpleConditionGenerate(\'{prefix}\', \'{metadata}\')" class="ui button">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    name: '<i class="align left icon"></i>',
    prefix: prefix
  });
  html+= '\t\t<div onclick="betweenConditionGenerate(\'{prefix}\', \'{metadata}\')" class="ui button">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    name: '<i class="align left icon"></i>',
    prefix: prefix
  });
  html+= '\t\t<div onclick="includeConditionGenerate(\'{prefix}\', \'{metadata}\')" class="ui button">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    prefix: prefix,
    name: '<i class="align left icon"></i>',
  });
  html+= '\t\t<div onclick="includeConditionGenerate2(\'{prefix}\', \'{metadata}\', \'{modal}\')" class="ui button">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    name: '<i class="align left icon"></i>',
    prefix: prefix,
    modal: modal
  });
  html+= '\t</div>\n';
  html+= '\t<div id="{id}"></div>\n'.supplant({
    id: prefixStr(sanitize(prefix), formControls.tags.conditions)
  });
  // GROUPS
  html+= '\t<div class="{class}">\n'.supplant({
    class: "ui small basic icon buttons"
  });
  html+= '\t\t<div onclick="groupGenerate(\'{prefix}\', \'{metadata}\')" class="ui button">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    prefix: prefix,
    name: '<i class="align left icon"></i>'
  });
  html+= '\t</div>\n';
  html+= '\t<div id="{id}"></div>\n'.supplant({
    id: prefixStr(sanitize(prefix), formControls.tags.groups)
  });
  // HAVING
  html+= '\t<div class="{class}">\n'.supplant({
    class: "ui small basic icon buttons"
  });
  html+= '\t\t<div onclick="havingGenerate(\'{prefix}\', \'{metadata}\')" class="ui button">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    prefix: prefix,
    name: '<i class="align left icon"></i>'
  });
  html+= '\t</div>\n';
  html+= '\t<div id="{id}"></div>\n'.supplant({
    id: prefixStr(sanitize(prefix), formControls.tags.having)
  });
  // ORDERS
  html+= '\t<div class="{class}">\n'.supplant({
    class: "ui small basic icon buttons"
  });
  html+= '\t\t<div onclick="orderGenerate(\'{prefix}\', \'{metadata}\')" class="ui button">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    prefix: prefix,
    name: '<i class="align left icon"></i>'
  });
  html+= '\t</div>\n';
  html+= '\t<div id="{id}"></div>\n'.supplant({
    id: prefixStr(sanitize(prefix), formControls.tags.orders)
  });
  // LIMIT
  html+= '\t<div class="{class}">\n'.supplant({
    class: "ui small basic icon buttons"
  });
  html+= '\t\t<div onclick="limitGenerate(\'{prefix}\', \'{metadata}\')" class="ui button">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    prefix: prefix,
    name: '<i class="align left icon"></i>'
  });
  html+= '\t</div>\n';
  html+= '\t<div id="{id}"></div>\n'.supplant({
    id: prefixStr(sanitize(prefix), formControls.tags.limit)
  });

  document.getElementById(prefixStr(sanitize(prefix), formControls.tags.contentData)).innerHTML = html

}


function optionsGenerator(data){
  html = '\t';
  html+= '<option value="">Column</option>'
  for (table of data) {
    html+= '\t\t\t<option disabled="true">{name}</option>\n'.supplant({
      name: table[0]
    })
    for (column of table[1]) {
      html+= '\t\t\t<option value="{value}" data-type="{type}">{name}</option>\n'.supplant({
        value: [table[0], column[0]].join('.'),
        name: column[0],
        type: column[1]
      })
    }
  }
  return html;
}

function insertInput(element, id, name){
  function inputString(name) {
    return '\t<input type="text" name="{name}[value]" placeholder="Value">'.supplant({
      name: name
    })
  }

  dataType = 'string';
  html = "";

  switch (dataType) {
    case "string":
      html+= inputString(name);
      break;
    default:
  }

  html+= '\t\t<input type="hidden" name="{name}[value_type]" value="{type}">\n'.supplant({
    type: dataType,
    name: name
  });

  document.getElementById(id).innerHTML = html;
}

function insertBetweenInput(element, id, name){
  function inputString(name, counter) {
    return '\t<input type="text" name="{name}[value{counter}][value]" placeholder="Value">'.supplant({
      counter: counter,
      name: name
    })
  }

  dataType = 'string';
  html = "";

  switch (dataType) {
    case "string":
      html+= inputString(name, 1);
      html+= inputString(name, 2);
      break;
    default:
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


function simpleColumnGenerate(prefix, metadata){
  $.post('/wizard/columns', {
    tables: metadata
  }).done(function (response) {
    html = '\t<div class="{class}">\n'.supplant({
      class: "fields"
    });
    html = '\t\t<div class="{class}">\n'.supplant({
      class: "five wide field"
    });
    select_id = 'select{prefix}3'.supplant({
      prefix: sanitize(prefix)
    })
    html+= '\t\t\t<select name="{name}" class="{class}" id="{id}">\n'.supplant({
      name: "{prefix}[columns][column{counter}][column]".supplant({
        counter: counter,
        prefix: prefix
      }),
      class: "ui dropdown",
      id: select_id
    });
    html+= optionsGenerator(response[0], 'method');
    html+= '\t\t\t</select>\n'
    html+= '\t\t\t<input type="hidden" name="{name}" value="single">\n'.supplant({
      name: '{prefix}[columns][column{counter}][type]'.supplant({
        counter: counter,
        prefix: prefix
      })
    });

    html+= '\t\t</div>\n'
    html+= '\t</div>\n'
    $('#{id}'.supplant({id: prefixStr(sanitize(prefix), formControls.tags.columns)})).append(html);
    $('#{id}'.supplant({id: select_id})).dropdown();
    counter++;
  })
}

function functionColumnGenerate(prefix, metadata){
  $.post('/wizard/columns', {
    tables: metadata
  }).done(function (response) {
    html = '\t<div class="{class}">\n'.supplant({
      class: "equal width fields"
    });
    select_id = "select{prefix}4".supplant({
      prefix: sanitize(prefix)
    })
    html+= '<div class="field">'
    html+= '\t\t<select name="{name}" class="{class}" id="{id}">\n'.supplant({
      name: '{prefix}[columns][column{counter}][func]'.supplant({
        counter: counter,
        prefix: prefix
      }),
      class: "ui dropdown",
      id: select_id
    });
    for (func of response[2]) {
      html+= '\t\t\t<option value="{func}">{func}</option>'.supplant({
        func: func
      });
    }
    html+= '\t\t</select>\n';
    html+= '</div>'
    select_id2 = "select{prefix}5".supplant({
      prefix: sanitize(prefix)
    })
    html+= '<div class="field">'
    html+= '\t\t<select name="{name}" class="{class}" id="{id}">\n'.supplant({
      name: "{prefix}[columns][column{counter}][column]".supplant({
        counter: counter,
        prefix: prefix
      }),
      class: "ui dropdown",
      id: select_id2
    });
    html+= optionsGenerator(response[0], 'method');
    html+= '\t\t</select>\n';
    html+= '</div>'
    html+= '\t\t<input type="hidden" name="{name}" value="function">\n'.supplant({
      name: '{prefix}[columns][column{counter}][type]'.supplant({
        counter: counter,
        prefix: prefix
      })
    });

    html+= '\t</div>\n'
    $('#{id}'.supplant({id: prefixStr(sanitize(prefix), formControls.tags.columns)})).append(html);
    $('#{id}'.supplant({id: select_id})).dropdown();
    $('#{id}'.supplant({id: select_id2})).dropdown();
    counter++;
  })
}

function aliasColumnGenerate(prefix, metadata){
  $.post('/wizard/columns', {
    tables: metadata
  }).done(function (response) {
    html = '\t<div class="{class}">\n'.supplant({
      class: "equal width fields"
    });
    select_id = "select{prefix}6".supplant({
      prefix: sanitize(prefix)
    })
    html+='<div class="field">'
    html+= '\t\t<select name="{name}" class="{class}" id="{id}">\n'.supplant({
      name: '{prefix}[columns][column{counter}][func]'.supplant({
        counter: counter,
        prefix: prefix
      }),
      class: "ui dropdown",
      id: select_id
    });
    for (func of response[2]) {
      html+= '\t\t\t<option value="{func}">{func}</option>'.supplant({
        func: func
      });
    }
    html+= '\t\t</select>\n';
    html+= '</div>'
    html+= '<div class="field">'
    select_id2 = "select{prefix}7".supplant({
      prefix: sanitize(prefix)
    })
    html+= '\t\t<select name="{name}" class="{class}" id="{id}">\n'.supplant({
      name: "{prefix}[columns][column{counter}][column]".supplant({
        counter: counter,
        prefix: prefix
      }),
      class: "ui dropdown",
      id: select_id2
    });
    html+= optionsGenerator(response[0], 'method');
    html+= '</select>\n'
    html+= '</div>'
    html+= '<div class="field">\n';
    html+= '\t\t<input type="text" name="{name}" placeholder="Alias">'.supplant({
      name: '{prefix}[columns][column{counter}][alias]'.supplant({
        counter: counter,
        prefix: prefix
      })
    })
    html+= '</div>\n'
    html+= '\t\t<input type="hidden" name="{name}" value="function">\n'.supplant({
      name: '{prefix}[columns][column{counter}][type]'.supplant({
        counter: counter,
        prefix: prefix
      })
    });

    html+= '\t</div>\n'
    $('#{id}'.supplant({id: prefixStr(sanitize(prefix), formControls.tags.columns)})).append(html);
    $('#{id}'.supplant({id: select_id})).dropdown();
    $('#{id}'.supplant({id: select_id2})).dropdown();
    counter++;
  })
}

function simpleConditionGenerate(prefix, metadata){
  $.post('/wizard/columns', {
    tables: metadata
  }).done(function (response) {
    html = '\t<div class="{class}">\n'.supplant({
      class: ""
    });
    html+= '\t\t<select name="{name}" class="{class}" onchange="insertInput(this, \'{id}\', \'{prefix}\')">\n'.supplant({
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
      class: ""
    });
    html+= optionsGenerator(response[0], 'method');
    html+= '\t\t</select>\n';
    html+= '\t\t<select name="{name}">\n'.supplant({
      name: '{prefix}[conditions][condition{counter}][type]'.supplant({
        counter: counter,
        prefix: prefix
      })
    });
    for (operator of response[1]) {
      html+= '\t\t\t<option value="{operator}">{operator}</option>'.supplant({
        operator: operator
      });
    }
    html+= '\t\t</select>\n';
    html+= '\t\n<div id="{id}"></div>'.supplant({
      id: "{name}{counter}".supplant({
        name: formControls.tags.conditions,
        counter: counter,
        prefix: prefix
      })
    });
    html+= '\t</div>\n'
    $('#{id}'.supplant({id: prefixStr(sanitize(prefix), formControls.tags.conditions)})).append(html);

    counter++;
  })
}

function betweenConditionGenerate(prefix, metadata){
  $.post('/wizard/columns', {
    tables: metadata
  }).done(function (response) {
    html = '\t<div class="{class}">\n'.supplant({
      class: ""
    });
    html+= '\t\t<select name="{name}" class="{class}" onchange="insertBetweenInput(this, \'{id}\', \'{prefix}\')">\n'.supplant({
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
      class: ""
    });
    html+= optionsGenerator(response[0], 'method');
    html+= '\t\t</select>\n';
    html+= '\t\t<input type="hidden" name="{name}" value="between">\n'.supplant({
      name: '{prefix}[conditions][condition{counter}][type]'.supplant({
        counter: counter,
        prefix: prefix
      })
    });
    html+= '\t\n<div id="{id}"></div>'.supplant({
      id: "{name}{counter}".supplant({
        name: formControls.tags.conditions,
        counter: counter,
        prefix: prefix
      })
    });
    html+= '\t</div>\n'
    $('#{id}'.supplant({id: prefixStr(sanitize(prefix), formControls.tags.conditions)})).append(html);
    counter++;
  })
}

function includeConditionGenerate2(prefix, metadata, modal){
  $.post('/wizard/columns', {
    tables: metadata
  }).done(function (response) {
    html = '\t<div class="{class}">\n'.supplant({
      class: ""
    });
    html+= '\t\t<select name="{name}" class="{class}">\n'.supplant({
      name: "{prefix}[conditions][condition{counter}][column]".supplant({
        counter: counter,
        prefix: prefix
      }),
      class: ""
    });
    html+= optionsGenerator(response[0], 'method');
    html+= '\t\t</select>\n'
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
    html+= '\t\t<div id="{id}"></div>'.supplant({
      id: prefixStr('nestedQuery', counter)
    });
    html+= '\t</div>\n'

    next_prefix = '{prefix}[conditions][condition{counter}][value]'.supplant({
      counter: counter,
      prefix: prefix
    });

    $('#{id}'.supplant({id: prefixStr(sanitize(prefix), formControls.tags.conditions)})).append(html);
    wizardGenerator(next_prefix, prefixStr('nestedQuery', counter), modal, 'Nested Query', false);

    counter++;
  })
}

function groupGenerate(prefix, metadata){
  $.post('/wizard/columns', {
    tables: metadata
  }).done(function (response) {
    html = '\t<div class="{class}">\n'.supplant({
      class: ""
    });
    html+= '\t\t<select name="{name}" class="{class}">\n'.supplant({
      name: "{prefix}[groups][group{counter}][column]".supplant({
        counter: counter,
        prefix: prefix
      }),
      class: ""
    });
    html+= optionsGenerator(response[0], 'method');
    html+= '\t\t</select>\n'

    html+= '\t</div>\n'
    $('#{id}'.supplant({id: prefixStr(sanitize(prefix), formControls.tags.groups)})).append(html);

    counter++;
  })
}

function havingGenerate(prefix, metadata){
  $.post('/wizard/columns', {
    tables: metadata
  }).done(function (response) {
    html = '\t<div class="{class}">\n'.supplant({
      class: ""
    });
    html+= '\t\t<select name="{name}">\n'.supplant({
      name: '{prefix}[having][having{counter}][func]'.supplant({
        counter: counter,
        prefix: prefix
      })
    });
    for (func of response[2]) {
      html+= '\t\t\t<option value="{func}">{func}</option>'.supplant({
        func: func
      });
    }
    html+= '\t\t</select>\n';
    html+= '\t\t<select name="{name}" class="{class}" onchange="insertInput(this, \'{id}\', \'{prefix}\')">\n'.supplant({
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
      class: ""
    });
    html+= optionsGenerator(response[0], 'method');
    html+= '\t\t</select>\n';
    html+= '\t\t<select name="{name}">\n'.supplant({
      name: '{prefix}[having][having{counter}][type]'.supplant({
        counter: counter,
        prefix: prefix
      })
    });
    for (operator of response[1]) {
      html+= '\t\t\t<option value="{operator}">{operator}</option>'.supplant({
        operator: operator
      });
    }
    html+= '\t\t</select>\n';
    html+= '\t\n<div id="{id}"></div>'.supplant({
      id: "{name}{counter}".supplant({
        name: formControls.tags.having,
        counter: counter,
        prefix: prefix
      })
    });
    html+= '\t</div>\n'
    $('#{id}'.supplant({id: prefixStr(sanitize(prefix), formControls.tags.having)})).append(html);
    counter++;
  })
}

function orderGenerate(prefix, metadata){
  $.post('/wizard/columns', {
    tables: metadata
  }).done(function (response) {
    html = '\t<div class="{class}">\n'.supplant({
      class: ""
    });

    html+= '\t\t<select name="{name}" class="{class}">\n'.supplant({
      name: "{prefix}[orders][order{counter}][column]".supplant({
        counter: counter,
        prefix: prefix
      }),
      class: ""
    });
    html+= optionsGenerator(response[0], 'method');
    html+= '\t\t</select>\n'
    html+= '\t\t<select name="{name}" class="{class}">\n'.supplant({
      name: "{prefix}[orders][order{counter}][type]".supplant({
        counter: counter,
        prefix: prefix
      }),
      class: ""
    });
    html+= '\t\t\t<option value="ASC" selected="true">Ascending</option>\n';
    html+= '\t\t\t<option value="DESC">Descending</option>\n';
    html+= '\t\t</select>\n';

    html+= '\t</div>\n'
    $('#{id}'.supplant({id: prefixStr(sanitize(prefix), formControls.tags.orders)})).append(html);
    counter++;
  })
}

function limitGenerate(prefix, metadata){
  html = '\t<div class="{class}">\n'.supplant({
    class: ""
  });
  html+= '\t<input type="text" name="{name}">'.supplant({
    name: prefixStr(prefix, '[limit]')
  });
  html+= '\t</div>\n'
  document.getElementById(prefixStr(sanitize(prefix), formControls.tags.limit)).innerHTML = html;
}
