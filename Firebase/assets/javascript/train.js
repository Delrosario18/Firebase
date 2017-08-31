// Initialize Firebase
  var config = {
    apiKey: "AIzaSyB0TWr3YTEA7PtuKZVAuMAU2TmK3WRY688",
    authDomain: "trainproject-15f07.firebaseapp.com",
    databaseURL: "https://trainproject-15f07.firebaseio.com",
    projectId: "trainproject-15f07",
    storageBucket: "",
    messagingSenderId: "836052246505"
  };
  
firebase.initializeApp(config);
console.log(firebase);

signIn();

var database = firebase.database();
var ref=database.ref("trains");

startApp();

function startApp(){
	$(".tbody").empty();
	ref.on("value",gotData,errorOccurred);
}

function signIn(){
	var provider = new firebase.auth.GoogleAuthProvider();

	firebase.auth().signInWithPopup(provider).then(function(result) {
	  // This gives you a Google Access Token. You can use it to access the Google API.
	  var token = result.credential.accessToken;
	  // The signed-in user info.
	  var user = result.user;
	
	  // ...
	}).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  // The email of the user's account used.
	  var email = error.email;
	  // The firebase.auth.AuthCredential type that was used.
	  var credential = error.credential;
	  // ...
	});
		
}

function gotData(data){
	console.log("data",data.val());
	var trains=data.val();
	var keyTrains=Object.keys(trains);
	
	var date = new Date();
	var d = new Date();
	var h = d.getHours();
	var m = d.getMinutes();
	
	var nowHoursToMinutes=h*60;
	
	var totalMinutesNow=parseInt(nowHoursToMinutes)+parseInt(m);
	
		
	for(var i=0;i<keyTrains.length;i++){
		var k=keyTrains[i];
		var First_Train_Time=trains[k].First_Train_Time;
		var Frequency=parseInt(trains[k].Frequency);
		
		var array_firstTime=First_Train_Time.split(':');
		
		var startingHours=parseInt(array_firstTime[0]);
		var startingMinutes=parseInt(array_firstTime[1]);
		
		var converTHoursToMinutes=startingHours*60;
		
		var TotalStartingMinutes=converTHoursToMinutes+startingMinutes;
		
		var timeDifference=totalMinutesNow-TotalStartingMinutes;
		
		
		var numberOfTrainsPassed=parseInt(timeDifference/Frequency);
		
		var minutesSpentByTrainsPassing=numberOfTrainsPassed*Frequency;
		
		var lastTrainTime=TotalStartingMinutes+minutesSpentByTrainsPassing;
		
		
		var nextArrival=lastTrainTime+Frequency;
		
		var awayTime=(nextArrival-totalMinutesNow);
		
		
		var dd=new Date();
		
		var TimeFornextArrival=dd.setMinutes(dd.getMinutes() + awayTime);
		
		TimeFornextArrival=new Date(TimeFornextArrival);
				
		var row= "<tr class='trow'>"+
					"<td id='tkey'>"+keyTrains[i]+"</td>"+
					"<td id='tname'>"+trains[k].Train_Name+"</td>"+
					"<td id='tdestination'>"+trains[k].Destination+"</td>"+
					"<td id='tfrequency'>"+trains[k].Frequency+"</td>"+
					"<td id='tarrival'>"+TimeFornextArrival+"</td>"+
					"<td id='taway'>"+awayTime+"</td>"+
				  "</tr>";
		
		$(".tbody").append(row);
	}
}

function errorOccurred(error){
	console.log("Error",error);
}

function addTrain(){
	var trainName=document.getElementById("trainName").value;
	var destination=document.getElementById("destination").value;
	var firstTrainTime=document.getElementById("firstTrainTime").value;
	var frequency=parseInt(document.getElementById("frequency").value);
	
	if(trainName!=null || destination!=null || firstTrainTime!=null || frequency!=null){
		var train={
			Train_Name : trainName,
			Destination : destination,
			First_Train_Time : firstTrainTime,
			Frequency : frequency	
		}
		if(ref.push(train)){
			$(".tbody").empty();
			return alert("Train added successfully");
		}else{
			return alert("unable to submit data");
		}
	}else{
		return alert("please provide all required inputs");
	}
	
}

window.setInterval(function(){ 
	startApp(); 
	
}, 60000);


// Get the modal
	var modal = document.getElementById('myModal');


$('.table').on('click', '.trow', function() {
		  modal.style.display = "block"; 
		  
		  document.getElementById('key').value=$(this).children('td#tkey').text();
		  document.getElementById('edit_trainName').value=$(this).children('td#tname').text();
		  document.getElementById('edit_destination').value=$(this).children('td#tdestination').text();
		  document.getElementById('edit_frequency').value=$(this).children('td#tfrequency').text();
	});
	
function updateTrain(){
	var tKey=document.getElementById("key").value;
	var trainName=document.getElementById("edit_trainName").value;
	var destination=document.getElementById("edit_destination").value;
	var frequency=document.getElementById("edit_frequency").value;
	
	if(trainName!=null || destination!=null || frequency!=null){
		var db = firebase.database();
		db.ref("trains/"+tKey+"/Train_Name").set(trainName);
		db.ref("trains/"+tKey+"/Destination").set(destination);
		db.ref("trains/"+tKey+"/Frequency").set(frequency);
		
		alert("Train updated successfully");
		modal.style.display = "none";
		startApp();
	}else{
		alert("please provide all required inputs");
	}
	
}

function removeTrain(){
	var tKey=document.getElementById("key").value;

	ref.child(tKey).remove();
	alert("Train Removed successfully");
	startApp();
	modal.style.display = "none";
}


	
$(".close").click(function(){
		
	modal.style.display = "none";		
		
});

window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}


/*
 * Rules
 * {
  "rules": {
    ".read": true,
    ".write": true
  }
}

 * 
 */
