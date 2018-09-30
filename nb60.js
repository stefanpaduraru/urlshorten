exports.toSxg = function(nr) {
  var d, m, s;
  m = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ_abcdefghijkmnopqrstuvwxyz";
  s = "";
  
  if (nr === 0 || nr === undefined  ) {
    return 0;
  }

  while (nr > 0) {
    d = nr % 60;
    s = m[d] + s;
    nr = (nr - d) / 60;
  }

  return s;
};