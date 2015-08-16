var d = new Date();
var hr = d.getHours();
var min = d.getMinutes();
var sec = d.getSeconds();
var dt= (d.getDate()).toString();
var mt = (d.getMonth()).toString();
var yr = (d.getFullYear()).toString();
console.log(mt+"/" +dt+"/" +yr+" @ "+ hr+":"+min+":"+sec);


