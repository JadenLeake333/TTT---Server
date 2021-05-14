const date = new Date();

const renderCalendar = () => {
  date.setDate(1);

  const monthDays = document.querySelector(".days");

  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  const prevLastDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    0
  ).getDate();

  const firstDayIndex = date.getDay();

  const lastDayIndex = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDay();

  const nextDays = 7 - lastDayIndex - 1;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  document.querySelector(".date h1").innerHTML = months[date.getMonth()];

  document.querySelector(".date p").innerHTML = new Date().toDateString();

//This returns the expirations dates of the user from the database. It turns calendar dates that use the date red. Try it! There is a commented line of code in 'index.js', choose any date.
fetch('https://ttt-server.jadenleake.repl.co/dates')
.then(response => response.json())
.then(data => {
  console.log(data)
  var len = data.length
  var count = 0
  let days = "";
  var expDates = []
  
  
  //Remove Duplicates
  for(var i = 0; i < len;i++){
    //console.log(new Date(data[i].EXPIRATION).getMonth())
    if(date.getMonth() == new Date(data[i].EXPIRATION).getMonth()){
      expDates.push(data[i].EXPIRATION)
    }
  }

  //console.log("exp"+expDates)
  var sortData = expDates.sort(function(a,b){
  return new Date(a) - new Date(b);
  });
  
  const start = (element) => {element = new Date(element); console.log(element.getMonth()); return element.getMonth() == date.getMonth()};

  //console.log("sortd"+sortData)
  var dupe = new Set(sortData)
  sortData = [...dupe]
  console.log("sort"+sortData)

  count = sortData.findIndex(start); 
  console.log(count)

  for (let x = firstDayIndex; x > 0; x--) {
    days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDay; i++) {
    if(count < len && i == new Date(sortData[count]).getDate()+1 && date.getMonth() == new Date    (sortData[count]).getMonth() && i === new Date().getDate() && date.getMonth() === new Date   ().getMonth()){
        days += `<div class="expiring-today">${i}</div>`;
        count++;
        continue
      }
    if (i === new Date().getDate() && date.getMonth() === new Date().getMonth()){
      days += `<div class="today">${i}</div>`;
    } else if(count < len && i == new Date(sortData[count]).getDate()+1 && date.getMonth() == new Date(sortData[count]).getMonth()) {
       days += `<div class="expiring">${i}</div>`;
      count++;
    }else{
      days += `<div>${i}</div>`;
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="next-date">${j}</div>`;
    monthDays.innerHTML = days;
  }
});

};

document.querySelector(".prev").addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
});

document.querySelector(".next").addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
});


document.querySelector(".days").addEventListener("click", () => {
window.open('/addFood');
})
/*
$(".days > div").click(function() {
  event.preventDefault();
  var dateClicked = $(this).text();
  var selectedMonth = date.getMonth()
  window.open('/addFood?date='+dateClicked+'&month='+selectedMonth);
});
*/
renderCalendar();