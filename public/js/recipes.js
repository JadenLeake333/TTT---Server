var list = ''
var count = 0

const display = (data) =>{
  console.log(data)
    for(var i = 0; i < data[0].missedIngredients.length; i++){
      list += '<li>'+data[0].missedIngredients[i].originalString+'</li><br>'
    }
    for(var i = 0; i < data[0].usedIngredients.length; i++){
      list += '<li>'+data[0].usedIngredients[i].originalString+'</li><br>'
    }
 var layout = `
 <tr><th><h3>${data[0].title}</h3></th></tr>
 <tr><td><img src='${data[0].image}'/><td></tr>
 <tr><td><ul>
  ${list}
 </ul><td></tr>
 `
 document.getElementById("recipe").innerHTML += layout
}

async function getData() {
  const response = await fetch('https://ttt-server.jadenleake.repl.co/data');
  const data = await response.json();
  return data;
}

async function useData(data){
  const spoon = await fetch('https://api.spoonacular.com/recipes/findByIngredients?apiKey=f49ea6b65aa64211bf59e9b863733057&ingredients='+data.PRODUCT+'&number=1',
    {
      headers: {
        'Content-Type': 'application/json'
      }
})
  var spoonJson = await spoon.json()
  return spoonJson;
}

getData().then(data =>{
  for(var i =0; i < data.length; i++){
  useData(data[i]).then(values =>{
    display(values)
  })
}

})



