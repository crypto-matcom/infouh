var counter = 0;

formControls = {
  tags: {
    mainForm: 'form',
    content: 'formcontent',
    contentData: 'formcontentdata',
    columns: 'formcolumns',
    conditions: 'formconditions',
    groups: 'formgroups',
    having: 'formhaving',
    orders: 'formorders',
    limit: 'formlimit',
  }
}

function formGenerator(prefix, element){
  $.post('/wizard/connections',{
    connecitons: 'true'
  }).done(function(response) {
    html = '<form class="{class}" action="{action}" method="post" id="{id}">\n'.supplant({
      id: prefixStr(prefix,formControls.tags.mainForm),
      action: 'wizard/test',
      class: 'ui form'
    });
    html+= '\t<input type="hidden" name="prefix" value="{prefix}">\n'.supplant({
      prefix: prefix
    });
    html+= '\t<select class="{class}" name="{name}" onclick="formContentGenerator(\'{prefix}\', this)">\n'.supplant({
      name: prefixStr(prefix, "[source]"),
      prefix: prefix,
      class: ""
    });
    for (source of response) {
      html+= '\t\t<option value="{value}">{name}</option>\n'.supplant({
        value: source[0],
        name: source[1],
      });
    }
    html+= '\t</select>\n'
    html+= '\t<div id="{id}"></div>\n'.supplant({
      id: prefixStr(prefix, formControls.tags.content)
    });
    html+= '\t<input type="submit" value="{button}">\n'.supplant({
      button: "Submit"
    });
    html+= '</form>';

    document.getElementById(element).innerHTML = html;
    // console.log(html);
  });
}

function formContentGenerator(prefix, element){
  $.post('/wizard/tables', {
    id: element.selectedIndex.value
  }).done(function (response) {
    html = '<select class="{class}" name="{name}" onchange="formContentDataGenerator(\'{prefix}\', this)" multiple="true">\n'.supplant({
      name: prefixStr(prefix, "[tables][]"),
      prefix: prefix,
      class: ""
    });
    for (table of response) {
      html+= '\t<option value="{value}">{value}</option>\n'.supplant({
        value: table,
      });
    }
    html+= '</select>\n';
    html+= '<div id="{id}"></div>'.supplant({
      id: prefixStr(prefix, formControls.tags.contentData)
    });

    document.getElementById(prefixStr(prefix, formControls.tags.content)).innerHTML = html;
    // console.log(html);
  });
}

function formContentDataGenerator(prefix, element){
  // COLUMNS
  html = '<div class="{class}">\n'.supplant({
    class: ""
  });
  html+= '\t<div onclick="simpleColumnGenerate(\'{prefix}\', \'{metadata}\')">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    name: "Simple",
    prefix: prefix
  });
  html+= '\t<div onclick="functionColumnGenerate(\'{prefix}\', \'{metadata}\')">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    name: "Function",
    prefix: prefix
  });
  html+= '\t<div onclick="aliasColumnGenerate(\'{prefix}\', \'{metadata}\')">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    prefix: prefix,
    name: "Alias"
  });
  html+= '</div>\n';
  html+= '<div id="{id}"></div>\n'.supplant({
    id: prefixStr(prefix, formControls.tags.columns)
  });
  // CONDITIONS
  html+= '<div class="{class}">\n'.supplant({
    class: ""
  });
  html+= '\t<div onclick="simpleConditionGenerate(\'{prefix}\', \'{metadata}\')">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    name: "Simple",
    prefix: prefix
  });
  html+= '\t<div onclick="betweenConditionGenerate(\'{prefix}\', \'{metadata}\')">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    name: "Between",
    prefix: prefix
  });
  html+= '\t<div onclick="includeConditionGenerate(\'{prefix}\', \'{metadata}\')">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    prefix: prefix,
    name: "Inclusion"
  });
  html+= '\t<div onclick="includeConditionGenerate2(\'{prefix}\', \'{metadata}\')">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    prefix: prefix,
    name: "Nested Query"
  });
  html+= '</div>\n';
  html+= '<div id="{id}"></div>\n'.supplant({
    id: prefixStr(prefix, formControls.tags.conditions)
  });
  // GROUPS
  html+= '<div class="{class}">\n'.supplant({
    class: ""
  });
  html+= '\t<div onclick="groupGenerate(\'{prefix}\', \'{metadata}\')">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    prefix: prefix,
    name: "Group"
  });
  html+= '</div>\n';
  html+= '<div id="{id}"></div>\n'.supplant({
    id: prefixStr(prefix, formControls.tags.groups)
  });
  // HAVING
  html+= '<div class="{class}">\n'.supplant({
    class: ""
  });
  html+= '\t<div onclick="havingGenerate(\'{prefix}\', \'{metadata}\')">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    prefix: prefix,
    name: "Having"
  });
  html+= '</div>\n';
  html+= '<div id="{id}"></div>\n'.supplant({
    id: prefixStr(prefix, formControls.tags.having)
  });
  // ORDERS
  html+= '<div class="{class}">\n'.supplant({
    class: ""
  });
  html+= '\t<div onclick="orderGenerate(\'{prefix}\', \'{metadata}\')">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    prefix: prefix,
    name: "Order"
  });
  html+= '</div>\n';
  html+= '<div id="{id}"></div>\n'.supplant({
    id: prefixStr(prefix, formControls.tags.orders)
  });
  // LIMIT
  html+= '<div class="{class}">\n'.supplant({
    class: ""
  });
  html+= '\t<div onclick="limitGenerate(\'{prefix}\', \'{metadata}\')">{name}</div>\n'.supplant({
    metadata: selectedOptions(element),
    prefix: prefix,
    name: "Limit"
  });
  html+= '</div>\n';
  html+= '<div id="{id}"></div>\n'.supplant({
    id: prefixStr(prefix, formControls.tags.limit)
  });

  document.getElementById(prefixStr(prefix, formControls.tags.contentData)).innerHTML = html
  // console.log(html);
}


function columnsDropDown(data){
  html = '';
  for (table of data) {
    html+= '\t\t<option disabled="true">{name}</option>\n'.supplant({
      name: table[0]
    })
    for (column of table[1]) {
      html+= '\t\t<option value="{value}" data-type="{type}">{name}</option>\n'.supplant({
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

  html+= '\t<input type="hidden" name="{name}[value_type]" value="{type}">\n'.supplant({
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

  html+= '\t<input type="hidden" name="{name}[value1][type]" value="{type}">\n'.supplant({
    type: dataType,
    name: name
  });
  html+= '\t<input type="hidden" name="{name}[value2][type]" value="{type}">\n'.supplant({
    type: dataType,
    name: name
  });

  document.getElementById(id).innerHTML = html;
}


function simpleColumnGenerate(prefix, metadata){
  $.post('wizard/columns', {
    tables: metadata
  }).done(function (response) {
    html = '<div class="{class}">\n'.supplant({
      class: ""
    });
    html+= '\t<select name="{name}" class="{class}">\n'.supplant({
      name: "{prefix}[columns][column{counter}][column]".supplant({
        counter: counter,
        prefix: prefix
      }),
      class: ""
    });
    html+= columnsDropDown(response[0], 'method');
    html+= '\t</select>\n'
    html+= '\t<input type="hidden" name="{name}" value="single">\n'.supplant({
      name: '{prefix}[columns][column{counter}][type]'.supplant({
        counter: counter,
        prefix: prefix
      })
    });

    html+= '</div>\n'
    $('#{id}'.supplant({id: prefixStr(prefix, formControls.tags.columns)})).append(html);
    // console.log(html);
    counter++;
  })
}

function functionColumnGenerate(prefix, metadata){
  $.post('wizard/columns', {
    tables: metadata
  }).done(function (response) {
    html = '<div class="{class}">\n'.supplant({
      class: ""
    });
    html+= '\t<select name="{name}" class="{class}">\n'.supplant({
      name: "{prefix}[columns][column{counter}][column]".supplant({
        counter: counter,
        prefix: prefix
      }),
      class: ""
    });
    html+= columnsDropDown(response[0], 'method');
    html+= '\t</select>\n';
    html+= '\t<select name="{name}">\n'.supplant({
      name: '{prefix}[columns][column{counter}][func]'.supplant({
        counter: counter,
        prefix: prefix
      })
    });
    for (func of response[2]) {
      html+= '\t\t<option value="{func}">{func}</option>'.supplant({
        func: func
      });
    }
    html+= '\t</select>\n';
    html+= '\t<input type="hidden" name="{name}" value="function">\n'.supplant({
      name: '{prefix}[columns][column{counter}][type]'.supplant({
        counter: counter,
        prefix: prefix
      })
    });

    html+= '</div>\n'
    $('#{id}'.supplant({id: prefixStr(prefix, formControls.tags.columns)})).append(html);
    // console.log(html);
    counter++;
  })
}

function aliasColumnGenerate(prefix, metadata){
  $.post('wizard/columns', {
    tables: metadata
  }).done(function (response) {
    html = '<div class="{class}">\n'.supplant({
      class: ""
    });
    html+= '\t<select name="{name}" class="{class}">\n'.supplant({
      name: "{prefix}[columns][column{counter}][column]".supplant({
        counter: counter,
        prefix: prefix
      }),
      class: ""
    });
    html+= columnsDropDown(response[0], 'method');
    html+= '\t</select>\n';
    html+= '\t<select name="{name}">\n'.supplant({
      name: '{prefix}[columns][column{counter}][func]'.supplant({
        counter: counter,
        prefix: prefix
      })
    });
    for (func of response[2]) {
      html+= '\t\t<option value="{func}">{func}</option>'.supplant({
        func: func
      });
    }
    html+= '\t</select>\n';
    html+= '\t<input type="text" name="{name}" placeholder="Alias">'.supplant({
      name: '{prefix}[columns][column{counter}][alias]'.supplant({
        counter: counter,
        prefix: prefix
      })
    })
    html+= '\t<input type="hidden" name="{name}" value="function">\n'.supplant({
      name: '{prefix}[columns][column{counter}][type]'.supplant({
        counter: counter,
        prefix: prefix
      })
    });

    html+= '</div>\n'
    $('#{id}'.supplant({id: prefixStr(prefix, formControls.tags.columns)})).append(html);
    // console.log(html);
    counter++;
  })
}

function simpleConditionGenerate(prefix, metadata){
  $.post('wizard/columns', {
    tables: metadata
  }).done(function (response) {
    html = '<div class="{class}">\n'.supplant({
      class: ""
    });
    html+= '\t<select name="{name}" class="{class}" onchange="insertInput(this, \'{id}\', \'{prefix}\')">\n'.supplant({
      name: "{prefix}[conditions][condition{counter}][column]".supplant({
        counter: counter,
        prefix: prefix
      }),
      prefix: "{prefix}[conditions][condition{counter}]".supplant({
        counter: counter,
        prefix: prefix
      }),
      id: "{prefix}{counter}{name}".supplant({
        name: formControls.tags.conditions,
        counter: counter,
        prefix: prefix
      }),
      class: ""
    });
    html+= columnsDropDown(response[0], 'method');
    html+= '\t</select>\n';
    html+= '\t<select name="{name}">\n'.supplant({
      name: '{prefix}[conditions][condition{counter}][type]'.supplant({
        counter: counter,
        prefix: prefix
      })
    });
    for (operator of response[1]) {
      html+= '\t\t<option value="{operator}">{operator}</option>'.supplant({
        operator: operator
      });
    }
    html+= '\t</select>\n';
    html+= '\n<div id="{id}"></div>'.supplant({
      id: "{prefix}{counter}{name}".supplant({
        name: formControls.tags.conditions,
        counter: counter,
        prefix: prefix
      })
    });
    html+= '</div>\n'
    $('#{id}'.supplant({id: prefixStr(prefix, formControls.tags.conditions)})).append(html);
    // console.log(html);
    counter++;
  })
}

function betweenConditionGenerate(prefix, metadata){
  $.post('wizard/columns', {
    tables: metadata
  }).done(function (response) {
    html = '<div class="{class}">\n'.supplant({
      class: ""
    });
    html+= '\t<select name="{name}" class="{class}" onchange="insertBetweenInput(this, \'{id}\', \'{prefix}\')">\n'.supplant({
      name: "{prefix}[conditions][condition{counter}][column]".supplant({
        counter: counter,
        prefix: prefix
      }),
      prefix: "{prefix}[conditions][condition{counter}][value]".supplant({
        counter: counter,
        prefix: prefix
      }),
      id: "{prefix}{counter}{name}".supplant({
        name: formControls.tags.conditions,
        counter: counter,
        prefix: prefix
      }),
      class: ""
    });
    html+= columnsDropDown(response[0], 'method');
    html+= '\t</select>\n';
    html+= '\t<input type="hidden" name="{name}" value="between">\n'.supplant({
      name: '{prefix}[conditions][condition{counter}][type]'.supplant({
        counter: counter,
        prefix: prefix
      })
    });
    html+= '\n<div id="{id}"></div>'.supplant({
      id: "{prefix}{counter}{name}".supplant({
        name: formControls.tags.conditions,
        counter: counter,
        prefix: prefix
      })
    });
    html+= '</div>\n'
    $('#{id}'.supplant({id: prefixStr(prefix, formControls.tags.conditions)})).append(html);
    console.log(html);
    counter++;
  })
}
