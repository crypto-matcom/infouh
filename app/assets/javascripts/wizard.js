var counter = 0;

formControls = {
  tags: {
    control: 'qb',
    modal: 'modal',
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
    control+= '\t<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#{modal_id}">\n'.supplant({
      modal_id: modalId
    });
    control+= '\t\tView Query\n';
    control+= '\t</button>\n';
    control+= '</div>\n';

    html ='\n<div class="modal fade" id="{modal_id}" tabindex="-1" role="dialog" aria-labelledby="{modal_id}Title" aria-hidden="true">\n'.supplant({
      modal_id: modalId
    });
    html+='\t<div class="modal-dialog modal-lg" role="document">\n';
    html+='\t\t<div class="modal-content">\n';
    html+='\t\t\t<div class="modal-header">\n';
    html+='\t\t\t\t<h5 class="modal-title" id="{modal_id}Title">{title}</h5>\n'.supplant({
      title: title
    });
    html+='\t\t\t</div>\n';
    html+='\t\t\t<div class="modal-body">\n';

    if(perform){
      html+= '\t\t\t\t\t\t<input type="hidden" name="prefix" value="{prefix}">\n'.supplant({
        prefix: prefix
      });
    }
    html+= '\t\t\t\t\t\t<select class="{class}" name="{name}" onclick="wizardContentGenerator(\'{prefix}\', this, \'{modal}\')">\n'.supplant({
      name: prefixStr(prefix, "[source]"),
      prefix: prefix,
      modal: modal,
      class: ""
    });
    for (source of response) {
      html+= '\t\t\t\t\t\t\t<option value="{value}">{name}</option>\n'.supplant({
        value: source[0],
        name: source[1],
      });
    }
    html+= '\t\t\t\t\t\t</select>\n'
    html+= '\t\t\t\t\t\t<div id="{id}"></div>\n'.supplant({
      id: prefixStr(sanitize(prefix), formControls.tags.content)
    });

    html+='\t\t\t</div>\n';
    html+='\t\t\t<div class="modal-footer">\n';
    html+='\t\t\t\t<button type="button" class="btn btn-secondary" data-dismiss="modal">Hide</button>\n';
    if (perform) {
      html+='\t\t\t\t<input type="submit" class="btn btn-secondary" value="Submit"> \n';
    }
    html+='\t\t\t</div>\n';
    html+='\t\t</div>\n';
    html+='\t</div>\n';
    html+='</div>\n';

    $('#{id}'.supplant({id: element})).append(control);
    $('#{id}'.supplant({id: modal})).append(html);
  });
}

function wizardContentGenerator(prefix, element, modal){
  $.post('/wizard/tables', {
    id: element.selectedIndex.value,
    data: false
  }).done(function (response) {
    html = '\t<select class="{class}" name="{name}" onchange="wizardContentDataGenerator(\'{prefix}\', this, \'{modal}\')" multiple="true" placeholder="Select Tables">\n'.supplant({
      name: prefixStr(prefix, "[tables][]"),
      prefix: prefix,
      modal: modal,
      class: ""
    });
    for (table of response) {
      html+= '\t\t<option value="{value}">{value}</option>\n'.supplant({
        value: table,
      });
    }
    html+= '\t</select>\n';
    html+= '\t<div id="{id}"></div>'.supplant({
      id: prefixStr(sanitize(prefix), formControls.tags.contentData)
    });

    document.getElementById(prefixStr(sanitize(prefix), formControls.tags.content)).innerHTML = html;

  });
}

function wizardContentDataGenerator(prefix, element, modal){
  // COLUMNS
  html = '\t<div class="{class}">\n'.supplant({
    class: ""
  });
  html+= '\t\t<div onclick="simpleColumnGenerate(\'{prefix}\', \'{metadata}\')">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    name: "Simple",
    prefix: prefix
  });
  html+= '\t\t<div onclick="functionColumnGenerate(\'{prefix}\', \'{metadata}\')">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    name: "Function",
    prefix: prefix
  });
  html+= '\t\t<div onclick="aliasColumnGenerate(\'{prefix}\', \'{metadata}\')">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    prefix: prefix,
    name: "Alias"
  });
  html+= '\t</div>\n';
  html+= '\t<div id="{id}"></div>\n'.supplant({
    id: prefixStr(sanitize(prefix), formControls.tags.columns)
  });
  // CONDITIONS
  html+= '\t<div class="{class}">\n'.supplant({
    class: ""
  });
  html+= '\t\t<div onclick="simpleConditionGenerate(\'{prefix}\', \'{metadata}\')">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    name: "Simple",
    prefix: prefix
  });
  html+= '\t\t<div onclick="betweenConditionGenerate(\'{prefix}\', \'{metadata}\')">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    name: "Between",
    prefix: prefix
  });
  html+= '\t\t<div onclick="includeConditionGenerate(\'{prefix}\', \'{metadata}\')">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    prefix: prefix,
    name: "Inclusion"
  });
  html+= '\t\t<div onclick="includeConditionGenerate2(\'{prefix}\', \'{metadata}\', \'{modal}\')">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    name: "Nested Query",
    prefix: prefix,
    modal: modal
  });
  html+= '\t</div>\n';
  html+= '\t<div id="{id}"></div>\n'.supplant({
    id: prefixStr(sanitize(prefix), formControls.tags.conditions)
  });
  // GROUPS
  html+= '\t<div class="{class}">\n'.supplant({
    class: ""
  });
  html+= '\t\t<div onclick="groupGenerate(\'{prefix}\', \'{metadata}\')">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    prefix: prefix,
    name: "Group"
  });
  html+= '\t</div>\n';
  html+= '\t<div id="{id}"></div>\n'.supplant({
    id: prefixStr(sanitize(prefix), formControls.tags.groups)
  });
  // HAVING
  html+= '\t<div class="{class}">\n'.supplant({
    class: ""
  });
  html+= '\t\t<div onclick="havingGenerate(\'{prefix}\', \'{metadata}\')">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    prefix: prefix,
    name: "Having"
  });
  html+= '\t</div>\n';
  html+= '\t<div id="{id}"></div>\n'.supplant({
    id: prefixStr(sanitize(prefix), formControls.tags.having)
  });
  // ORDERS
  html+= '\t<div class="{class}">\n'.supplant({
    class: ""
  });
  html+= '\t\t<div onclick="orderGenerate(\'{prefix}\', \'{metadata}\')">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    prefix: prefix,
    name: "Order"
  });
  html+= '\t</div>\n';
  html+= '\t<div id="{id}"></div>\n'.supplant({
    id: prefixStr(sanitize(prefix), formControls.tags.orders)
  });
  // LIMIT
  html+= '\t<div class="{class}">\n'.supplant({
    class: ""
  });
  html+= '\t\t<div onclick="limitGenerate(\'{prefix}\', \'{metadata}\')">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    prefix: prefix,
    name: "Limit"
  });
  html+= '\t</div>\n';
  html+= '\t<div id="{id}"></div>\n'.supplant({
    id: prefixStr(sanitize(prefix), formControls.tags.limit)
  });

  document.getElementById(prefixStr(sanitize(prefix), formControls.tags.contentData)).innerHTML = html

}


function optionsGenerator(data){
  html = '\t';
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
  $.post('wizard/columns', {
    tables: metadata
  }).done(function (response) {
    html = '\t<div class="{class}">\n'.supplant({
      class: ""
    });
    html+= '\t\t<select name="{name}" class="{class}">\n'.supplant({
      name: "{prefix}[columns][column{counter}][column]".supplant({
        counter: counter,
        prefix: prefix
      }),
      class: ""
    });
    html+= optionsGenerator(response[0], 'method');
    html+= '\t\t</select>\n'
    html+= '\t\t<input type="hidden" name="{name}" value="single">\n'.supplant({
      name: '{prefix}[columns][column{counter}][type]'.supplant({
        counter: counter,
        prefix: prefix
      })
    });

    html+= '\t</div>\n'
    $('#{id}'.supplant({id: prefixStr(sanitize(prefix), formControls.tags.columns)})).append(html);

    counter++;
  })
}

function functionColumnGenerate(prefix, metadata){
  $.post('wizard/columns', {
    tables: metadata
  }).done(function (response) {
    html = '\t<div class="{class}">\n'.supplant({
      class: ""
    });
    html+= '\t\t<select name="{name}">\n'.supplant({
      name: '{prefix}[columns][column{counter}][func]'.supplant({
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
    html+= '\t\t<select name="{name}" class="{class}">\n'.supplant({
      name: "{prefix}[columns][column{counter}][column]".supplant({
        counter: counter,
        prefix: prefix
      }),
      class: ""
    });
    html+= optionsGenerator(response[0], 'method');
    html+= '\t\t</select>\n';
    html+= '\t\t<input type="hidden" name="{name}" value="function">\n'.supplant({
      name: '{prefix}[columns][column{counter}][type]'.supplant({
        counter: counter,
        prefix: prefix
      })
    });

    html+= '\t</div>\n'
    $('#{id}'.supplant({id: prefixStr(sanitize(prefix), formControls.tags.columns)})).append(html);

    counter++;
  })
}

function aliasColumnGenerate(prefix, metadata){
  $.post('wizard/columns', {
    tables: metadata
  }).done(function (response) {
    html = '\t<div class="{class}">\n'.supplant({
      class: ""
    });
    html+= '\t\t</select>\n';
    html+= '\t\t<select name="{name}">\n'.supplant({
      name: '{prefix}[columns][column{counter}][func]'.supplant({
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
    html+= '\t\t<select name="{name}" class="{class}">\n'.supplant({
      name: "{prefix}[columns][column{counter}][column]".supplant({
        counter: counter,
        prefix: prefix
      }),
      class: ""
    });
    html+= optionsGenerator(response[0], 'method');
    html+= '\t\t<input type="text" name="{name}" placeholder="Alias">'.supplant({
      name: '{prefix}[columns][column{counter}][alias]'.supplant({
        counter: counter,
        prefix: prefix
      })
    })
    html+= '\t\t<input type="hidden" name="{name}" value="function">\n'.supplant({
      name: '{prefix}[columns][column{counter}][type]'.supplant({
        counter: counter,
        prefix: prefix
      })
    });

    html+= '\t</div>\n'
    $('#{id}'.supplant({id: prefixStr(sanitize(prefix), formControls.tags.columns)})).append(html);

    counter++;
  })
}

function simpleConditionGenerate(prefix, metadata){
  $.post('wizard/columns', {
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
  $.post('wizard/columns', {
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
    console.log(html);
    counter++;
  })
}

function includeConditionGenerate2(prefix, metadata, modal){
  $.post('wizard/columns', {
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
  $.post('wizard/columns', {
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
  $.post('wizard/columns', {
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
    console.log(html);
    counter++;
  })
}

function orderGenerate(prefix, metadata){
  $.post('wizard/columns', {
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
    console.log(html);
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
