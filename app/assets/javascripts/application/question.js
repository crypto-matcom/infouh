qcounter = 0;

function loadForm(select_id, content_id) {
  $.post('/wizard/connections',{
    connecitons: 'true'
  }).done(function(response) {
    html ='';
    // html+='\t<option value="">Source</option>\n';
    for (source of response) {
      html+= '\t<option value="{value}">{name}</option>\n'.supplant({
        value: source[0],
        name: source[1],
      });
    }

    document.getElementById(select_id).innerHTML = html;
    $('#{id}'.supplant({id: select_id})).dropdown();
  });
}

function setLabel(content_id, type, placeholder, name) {
  container_id = "container{qcounter}".supplant({
    qcounter: qcounter
  });

  html = '<div class="fields" id="{id}">\n'.supplant({
    id: container_id
  });
  html+= '\t<div class="field">\n';
  html+= '\t\t<input type="hidden" name="question[question][input{qcounter}][type]" value="{type}">\n'.supplant({
    qcounter: qcounter,
    type: type
  });
  html+= '\t\t<input type="text" name="question[question][input{qcounter}]{name}" placeholder="{place}">\n'.supplant({
    qcounter: qcounter,
    place: placeholder.supplant({qcounter: qcounter}),
    name: name
  });
  html+= '\t</div>\n';
  html+= '\t<div class="field">\n';
  html+= '\t\t<i class="grey delete icon" onclick="Remove(\'{id}\')"></i>\n'.supplant({
    id: container_id
  })
  html+= '\t</div>\n';
  html+= '</div>\n';

  $('#{id}'.supplant({id: content_id})).append(html);
  qcounter++;
}

function setField(content_id, type) {
  container_id = "container{qcounter}".supplant({
    qcounter: qcounter
  });

  html = '<div class="fields" id="{id}">\n'.supplant({
    id: container_id
  });
  html+= '\t<div class="field">\n';
  html+= '\t\t<input type="hidden" name="question[question][input{qcounter}][type]" value="{type}">\n'.supplant({
    qcounter: qcounter,
    type: type
  });
  html+= '\t\t<input type="text" name="question[question][input{qcounter}][value]" value="{type} input{qcounter}" disabled="true">\n'.supplant({
    qcounter: qcounter,
    type: type
  });
  html+= '\t</div>\n';
  html+= '\t<div class="one wide field">\n';
  html+= '\t\t<i class="grey delete icon" onclick="Remove(\'{id}\')"></i>\n'.supplant({
    id: container_id
  })
  html+= '\t</div>\n';
  html+= '</div>\n';

  $('#{id}'.supplant({id: content_id})).append(html);
  qcounter++;
}


function showQuestion(id, name) {
  $.post('/question/show', {
    id: id
  }).done(function(response) {
    document.getElementById('showModalTitle').innerHTML = name;
    document.getElementById('showForm').innerHTML = response;
    $('.backendDropdown').dropdown();
  });
}

function buildQuery(form_id, query_id) {
  query = $('#{id}'.supplant({id:query_id})).attr('value');
  json_data = objectifyForm(form_id);
  alert(query.supplant(json_data));
}

function objectifyForm(id) {//serialize data function
  formArray = document.getElementById(id);
  var returnArray = {};
  for (var i = 0; i < formArray.length; i++){
    returnArray[formArray[i]['name']] = formArray[i]['value'];
  }
  return returnArray;
}
