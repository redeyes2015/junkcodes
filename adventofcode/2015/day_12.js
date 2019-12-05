'use strict';

const fs = require('fs');

let json_obj = JSON.parse(fs.readFileSync('day_12.input'));

function getNumber(x) {
  switch (typeof x) {
  case 'number': return x;
  case 'string': return 0;
  case 'object':
    if (Array.isArray(x)) {
      return x.reduce((acc, xi) => acc + getNumber(xi), 0);
    }
    else {
      const keys = Object.keys(x);
      if (keys.some(xi => x[xi] == 'red')) {
        return 0;
      }
      return keys.reduce((acc, xi) => acc + getNumber(x[xi]), 0);
    }
  }
}

console.log(getNumber(json_obj));

//console.log(getNumber([1,2,3]));
//console.log(getNumber({"a":2,"b":4}));
//console.log(getNumber([[[3]]]));
//console.log(getNumber({"a":{"b":4},"c":-1}));
//console.log(getNumber({"a":[-1,1]}));
//console.log(getNumber([-1,{"a":1}]));
//console.log(getNumber([]));
//console.log(getNumber({}));

