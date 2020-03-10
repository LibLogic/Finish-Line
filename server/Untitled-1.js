var jsonTransformed = JSON.parse(jsonText, function(key, value) {
  if (value && typeof value === "string" && value.indexOf("function") === 0) {
    // we can only pass a function as string in JSON ==> doing a real function
    var jsFunc = new Function("return " + value)();
    return jsFunc;
  }

  return value;
});
