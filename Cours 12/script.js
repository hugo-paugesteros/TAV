function svg() {
  document.querySelectorAll("svg foreignObject.rs").forEach(function(foreignObject) {
    var firstChild = foreignObject.firstElementChild;
    if (firstChild) {
      var width = firstChild.offsetWidth;
      var height = firstChild.offsetHeight;
      foreignObject.setAttribute("width", width);
      foreignObject.setAttribute("height", height);
      foreignObject.setAttribute("style", `transform: translateX(${-width/2}px) translateY(-${height/2}px)`);
    }
  });
}