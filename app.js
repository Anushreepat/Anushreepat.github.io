document.getElementById("myForm").addEventListener("submit", function(event) {
  event.preventDefault();

  var nameInput = document.getElementById("nameInput");
  var output = document.getElementById("output");

  if (nameInput.value !== "") {
    output.innerHTML = "Hello, " + nameInput.value + "!";
  } else {
    output.innerHTML = "Please enter your name.";
  }
});


//Function for clear button.
function clr() {

  document.getElementById("keyw").value = "";

  document.getElementById("dist").value = "10";

  document.getElementById("cat").selectedIndex = 0;

  if (document.getElementById("loc").disabled == true){

    document.getElementById("loc").disabled = false;

    document.getElementById("loc").value = "";
  }
  else if (document.getElementById("loc").disabled == false){

    document.getElementById("loc").value = "";
}

  document.getElementById("detloc").checked = false;

  document.getElementById("table1").style.visibility = "hidden";

  document.getElementById("cont2").style.visibility = "hidden";
}

//Function for when checkbox is checked.

function chk(){

  if(document.getElementById("detloc").checked == true){

    document.getElementById("loc").value = "";

    document.getElementById("loc").disabled = true;
  }
  else if (document.getElementById("detloc").checked == false){

    document.getElementById("loc").disabled = false;
  }
}

//Function getloc() gets Latitude and Longitude from Google Geocoding API. Referenced from lecture 6 slide 5.

function getloc(){

  ad = document.getElementById("loc").value;
  urlreq = new XMLHttpRequest();
  urlreq.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?address="+ad+"&key=AIzaSyA2IAh_cieCxaRr-puzmKIuRwORKsXl7rs", true);
  urlreq.onreadystatechange = getcoord;
  urlreq.send(null);
}

//Callback fucntion for getloc().

function getcoord(){

  if (urlreq.readyState == 4) {
    if (urlreq.status == 200) {
    doc = eval('(' + urlreq.responseText + ')');
    x = doc.results[0].geometry.location.lat;
    y = doc.results[0].geometry.location.lng;
    getvalues(x,y);
}
}
}

/*Gets the latitude and longitude of a place if the checkbox is checked.
Referenced from https://dev.to/ramonak/javascript-how-to-access-the-return-value-of-a-promise-object-1bck
and https://ipinfo.io/blog/ip-geolocation-in-javascript/.*/

function chkhere(){

  getc = fetch('https://ipinfo.io/json?token=1e14512127bdfa')
    .then((res) => res.json())
    .then((data) => {return(data.loc);})
  const printgetc = async () => {
  const a = await getc;
    b = a.split(',')
    x = b[0];
    //console.log(latitude);
    y = b[1];
    //console.log(longitude);
    getvalues(x,y);
  };
  printgetc();
}

//Function to be executed on clicking submit button.

function submit(){

  if (document.getElementById("detloc").checked == true){
    chkhere();
  }
  else if (document.getElementById("detloc").checked == false){
    getloc();
  }
}

/*Function to get all the values and store in a list to be sent to flask for Yelp information retrieval and establish connection
between Javascript and Flask.*/


function getvalues(x,y){

  keyw = document.getElementById("keyw").value;
  dist = document.getElementById("dist").value;
  cat = document.getElementById("cat").value;
  loc = document.getElementById("loc").value;

  a = x;
  b = y;
  par = [keyw, dist, cat, a, b];
  //console.log(par);
  vals = new XMLHttpRequest();
  vals.open("GET", `/val/${JSON.stringify(par)}`,true);
  vals.onreadystatechange = hgetvalues;
  vals.send(null);
  console.log("Request sent");
}

//Callback function for getvalues()

function hgetvalues(){
  if (vals.readyState == 4 && vals.status == 200){
  c_res = eval('(' + vals.responseText + ')');
  maketable(c_res);
}
}

//Function to make table with JSON data retrieved from Yelp.

function maketable(c_res){

  document.getElementById("table1").style.visibility = "visible";
  document.getElementById("table1").scrollIntoView(true);
  //console.log(c_res);
  c_id = [];
  c_name = [];
  c_image = [];
  c_distance = [];
  c_rating = [];
  c_length = Object.keys(c_res).length;


  for (let i = 0; i < c_length; i++){
  c_id[i] = c_res[i]['id'];
  c_name[i] = c_res[i]['name'];
  c_image[i] = c_res[i]['image_url'];
  c_distance[i] = c_res[i]['distance'];
  c_rating[i] = c_res[i]['rating'];
  }

  for(let i=0;i < c_length;i++){

    cell1="p"+String(i+1)+"1";
    val1 = document.getElementById(cell1);
    val1.src = c_image[i];

    cell2="p"+String(i+1)+"2";
    val2 = document.getElementById(cell2);
    val2.innerHTML = c_name[i];

    cell3="p"+String(i+1)+"3";
    val3 = document.getElementById(cell3);
    val3.innerHTML = c_rating[i];

    cell4="p"+String(i+1)+"4";
    val4 = document.getElementById(cell4);
    val4.innerHTML = c_distance[i];
  }
}

//Function to send details to Flask for second API call and get business details for a particular business.

function getdetails(name){

  for (let i = 0; i < c_length; i++){
  if (c_name[i] == name){
    y_id = c_id[i];
  }
}

  deets = new XMLHttpRequest();
  deets.open("GET", `/deets/${JSON.stringify(y_id)}`,true);
  deets.onreadystatechange = hgetdeets;
  deets.send();
  console.log("Request sent");
}

//Callback function for getdetails().

function hgetdeets(){

  if (deets.readyState == 4 && deets.status == 200){
  c_deets= eval('(' + deets.responseText + ')');
  makecard(c_deets);
}
}

function makecard(c_deets){

  document.getElementById("cont2").scrollIntoView(true);
  cats = "";
  y_name = c_deets['name'];
  y_status = c_deets['status'];
  y_categories = c_deets['categories'][0];
  y_address = c_deets['address'];
  y_phone = c_deets['phone'];
  y_tran = c_deets['transactions'];
  y_price = c_deets['price'];
  y_url = c_deets['url'];
  y_images = c_deets['photos'];


  document.getElementById("name").innerHTML = y_name;


  if (y_status != null && y_status != undefined){
  stat = y_status[0];
  if (stat == true){
    document.getElementById("status").textContent = "Open Now";
    document.getElementById("status").style.background = "#008000";
  }

  else if(stat == false){
    document.getElementById("status").textContent = "Closed";
    document.getElementById("status").style.background = "#ff0000";
  }
 }
 else {
   document.getElementById("s").style.visibility = "hidden";
 }

   clen =Object.keys(y_categories).length;
  if(clen != 0 && y_categories != null && y_categories != undefined){
    for (let i = 0; i < y_categories.length - 1; i++){
      cats += y_categories[i]['title'] + " | ";
    }
    cats += y_categories[y_categories.length-1]['title']

    document.getElementById("category").innerHTML = cats;
    document.getElementById("c").innerHTML = "Category"
  }
  else if(clen == 0 || y_categories == null || y_categories == undefined){
    document.getElementById("c").innerHTML = " ";
  }

  if(y_address != null && y_address != undefined){
    document.getElementById("address").innerHTML = y_address;
  }

  else{
    document.getElementById("a").style.visibility = "hidden"
  }

  if(Object.keys(y_phone[0]).length != 0 && y_phone[0] != null && y_phone[0] != undefined){
    document.getElementById("phone").textContent = y_phone;
  document.getElementById("label_p").textContent = "Phone Number";
  }

  else {
  document.getElementById("phone").textContent = " ";
  document.getElementById("label_p").textContent= " ";
  console.log("ph hidd")
  }



  if(Object.keys(y_tran[0]).length != 0 && y_tran != null && y_tran != undefined){

    function capitalizeWords(a) {
      return a.map(element => {
        return element.charAt(0).toUpperCase() + element.slice(1).toLowerCase();
      });
    }
    trans = capitalizeWords(y_tran[0]).join(' | ');
    document.getElementById("trans").textContent = trans;
    document.getElementById("t").textContent = "Transactions Supported";
  }

  else if(Object.keys(y_tran[0]).length == 0 || y_tran == null || y_tran == undefined){
    console.log("hello");
    document.getElementById("trans").textContent = " ";
    document.getElementById("t").textContent = " ";
  }

  if(y_price.length !=0 && y_price != null && y_price != undefined){
    document.getElementById("price").textContent = y_price;
    document.getElementById("pr").textContent = "Price";
  }
  else{
    document.getElementById("price").textContent = " ";
    document.getElementById("pr").textContent = " ";
  }


  document.getElementById("more").href = y_url;

  document.getElementById("i1").src = y_images[0][0];

  document.getElementById("i2").src = y_images[0][1];

  document.getElementById("i3").src = y_images[0][2];

  document.getElementById("cont2").style.visibility = "visible";
}

//Both sorting functions referenced from https://www.w3schools.com/howto/howto_js_sort_table.asp .

function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("table1");
  switching = true;
  dir = "asc";
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("td")[n];
      y = rows[i + 1].getElementsByTagName("td")[n];
      if (dir == "asc") {
        if (Number(x.textContent) > Number(y.textContent)) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (Number(x.textContent) < Number(y.textContent)) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount ++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

function sortTable1(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("table1");
  switching = true;
  dir = "asc";
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      if (dir == "asc") {
        if (x.textContent.toLowerCase() > y.textContent.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.textContent.toLowerCase() < y.textContent.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount ++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
