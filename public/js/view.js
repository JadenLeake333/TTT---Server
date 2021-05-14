$.delete = function(url, data, callback, type){
  if ( $.isFunction(data) ){
    type = type || callback,
        callback = data,
        data = {}
  }
  return $.ajax({
    url: url,
    type: 'DELETE',
    success: callback,
    data: data,
    contentType: type
  });
}
// Delete
$('body').on('click','.fa-times',function(){
    var $row = $(this).closest("tr")
    $tds = $row.find("td:nth-child(3)");
    $.each($tds, function() {
      var id = $(this).text()
      var values = {product:id}
      window.location.href=window.location.href
      $.delete("https://TTT-Server.jadenleake.repl.co/expired",values)
    });    
})

$.put = function(url, data, callback, type){
  if ( $.isFunction(data) ){
    type = type || callback,
    callback = data,
    data = {}
  }
 
  return $.ajax({
    url: url,
    type: 'PUT',
    success: callback,
    data: data,
    contentType: type
  });
}

$('body').on('click','.fa-pen-square',function(){
    var $row = $(this).closest("tr")
    $tds = $row.find("td:nth-child(1)");
    $.each($tds, function() {
      var id = $(this).text()
      var newName = window.prompt("Enter the new product")
        if(newName === ""){
          alert("Please enter a product!")
          return
        }
      var values = {date:id,news:newName}
      window.location.href=window.location.href
      $.put("https://TTT-Server.jadenleake.repl.co/change",values)
    });    
})