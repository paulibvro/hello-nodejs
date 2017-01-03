
exports.sanitize = function(arg){
  arg = String(arg);
    var string=arg.split("$")
      .join("\\$")
      .replace(/\\/g, "\\\\")
      .replace(/\$/g, "\\$")
      .replace(/'/g, "\\'")
      .replace(/"/g, "\\\"");
    return string;
  
}
