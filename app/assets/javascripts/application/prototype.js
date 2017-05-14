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
