qcounter = 0;

function loadForm(select_id, content_id) {
  $.post('/wizard/connections',{
    connecitons: 'true'
  }).done(function(response) {
    html ='\t<option value="">Source</option>\n';
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

function setLabel(content_id) {
  container_id = "container{qcounter}".supplant({
    qcounter: qcounter
  });

  html = '<div class="fields" id="{id}">\n'.supplant({
    id: container_id
  });
  html+= '\t<div class="field">\n';
  html+= '\t\t<input type="hidden" name="question[question][input{qcounter}][type]" value="label">\n'.supplant({
    qcounter: qcounter
  });
  html+= '\t\t<input type="text" name="question[question][input{qcounter}][value]">\n'.supplant({
    qcounter: qcounter
  });
  html+= '\t</div>\n';
  html+= '\t<div class="field">\n';
  html+= '\t\t<i class="red delete icon" onclick="Remove(\'{id}\')"></i>\n'.supplant({
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
    type: type.toUpperCase()
  });
  html+= '\t</div>\n';
  html+= '\t<div class="one wide field">\n';
  html+= '\t\t<i class="red delete icon" onclick="Remove(\'{id}\')"></i>\n'.supplant({
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
  });
}
