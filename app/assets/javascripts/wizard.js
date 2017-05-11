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
  html = '<form class="{class}" action="{action}" method="post" id="{id}">\n'.supplant({
    id: prefixStr(prefix,formControls.tags.mainForm),
    action: 'wizard/test',
    class: 'ui form'
  });
  html+= '\t<input type="hidden" name="prefix" value="{prefix}">\n'.supplant({
    prefix: prefix
  });

  $.post('/wizard/connections',{
    connecitons: 'true'
  }).done(function(response) {
    html+= '\t<select class="{class}" name="{name}" onclick="formContentGenerator(\'{prefix}\', this)">\n'.supplant({
      name: prefixStr(prefix, "[source]"),
      prefix: prefix,
      class: ""
    });
    for (source of response) {
      html+= '\t\t<option value="{value}">{name}</option>\n'.supplant({
        value: source[1],
        name: source[0],
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
    console.log(html);
  });
}

function formContentGenerator(prefix, element){
  html = '<select class="{class}" name="{name}" onchange="formContentDataGenerator(\'{prefix}\', this)" multiple="true">\n'.supplant({
    name: prefixStr(prefix, "[tables][]"),
    prefix: prefix,
    class: ""
  });
  $.post('/wizard/tables', {
    id: element.selectedIndex.value
  }).done(function (response) {

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
    console.log(html);
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
  console.log(html);
}
