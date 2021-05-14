const makeTable = (data) =>{
  var store;
  $("table").remove() // Remove existing table
  $("#noresults").hide()
  if(data.length === 0){
    $("#noresults").show()
    $("#noresults").html("No results found")
    data = defaultdata
  }
  console.log(data)
  $("#noresults").show()
    $("#noresults").html(data.length+" results found")
  var tabledata = "<table style='width: 100%; color: white'><tr><th style='max-width: 100px'>Expiration Date</th><th>Fridge</th><th>Name</th></tr>"
  data.map((x,id) =>{
    if(x.STORED == 1)
      store = 'Not Refridgerated'
    else
      store = 'Fridge' 
    tabledata += "<tr><td>"+x.EXPIRATION+"</td><td>"+store+"</td><td><a href='/recipe/"+x.PRODUCT+"'>"+x.PRODUCT+"</a></td><td><i class='fas fa-pen-square'></i><vr><i class='fas fa-times'></i></td></tr>"
  })
  tabledata+="</table>"
  //console.log(tabledata)
  document.getElementById("table").innerHTML = tabledata
}

fetch('https://ttt-server.jadenleake.repl.co/data')
.then(response => response.json())
.then(data => {makeTable(data)});



$('#submit').click(function(){
  window.location.href = "https://ttt-server.jadenleake.repl.co/home";
})


var data=[
  {
    "id": 1,
    "name": "Not-Refrigerated"
  }
];



//javascript needs to wait after DOMContentLoaded
document.addEventListener("DOMContentLoaded", ready);

function ready() {
    //alert('Wait until DOM is ready for js to interfact with HTML via DOM!');
  
    let dropdown = document.getElementById('where');  
    console.log(dropdown);

    populatelist(dropdown);

    
    dropdown.onclick = function () {
      var index = document.getElementById("where").value;

     console.log(index,"debug");

    if (dropdown.selectedIndex==-1)
      ab=""
    else
      ab=data
    }
 
}

function populatelist(dropdown)
{
    dropdown.length = 0;

    let defaultOption = document.createElement('option');
    defaultOption.text = 'Refrigerated';
    defaultOption.value= 0;
    dropdown.add(defaultOption);
    dropdown.selectedIndex = 0;

    let option;
    for (let i = 0; i < data.length; i++) {
          option = document.createElement('option');

          option.text = data[i].name;
          option.value = data[i].id;

          dropdown.add(option);
        } 
}


var dt = new Date();
document.getElementById("datetime").innerHTML = (("0"+(dt.getMonth()+1)).slice(-2)) +"/"+ (("0"+dt.getDate()).slice(-2)) +"/"+ (dt.getFullYear());
