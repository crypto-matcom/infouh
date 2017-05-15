String.prototype.supplant = function (o) {
    return this.replace(/{([^{}]*)}/g,
        function (a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
};

function sanitize(val){
  var split1 = val.split(']').join('');
  return split1.split('[').join('');
}

function prefixStr(prefix, string) {
  return prefix + string;
}

function objectifyForm(id) {//serialize data function
  formArray = document.getElementById(id);
  var returnArray = {};
  for (var i = 0; i < formArray.length; i++){
    returnArray[formArray[i]['name']] = formArray[i]['value'];
  }
  return returnArray;
}
