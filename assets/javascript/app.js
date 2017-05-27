//alert("Hello");
//Sets clock on the page
setInterval(function() {
	var presentTime = moment().format("HH:mm:ss");
	$("#current-time").html(presentTime);
}, 1000);
	


// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDQOHMThTs8WQeDuvkNI9dZSTm7rbRcwho",
    authDomain: "train-scheduler-2f630.firebaseapp.com",
    databaseURL: "https://train-scheduler-2f630.firebaseio.com",
    projectId: "train-scheduler-2f630",
    storageBucket: "train-scheduler-2f630.appspot.com",
    messagingSenderId: "126962781675"
  };

  firebase.initializeApp(config);

	//To create a reference database variable
  	var database = firebase.database();


	//Initial variables to contain data in form
  	var trainName 	= "Acela Express";
  	var destination = "Washington D.C";
  	var firstTime 	= "00:30";
  	var frequency 	= "15";


	//jQuery on click statement to capture input data by clicking a button with ID "add-train-name" to store data in variables
  	$("#add-train-name").on("click", function(event) {
  		event.preventDefault();

	//To grab values from text-boxes
  	var trainName 	= $("#train-name-input").val().trim();
  	var destination = $("#destination-input").val().trim();
  	var firstTime 	= $("#time-input").val().trim();
  	var frequency 	= $("#frequency-input").val().trim();
	
  	
	//Uploading train data to the database by using push method to store data everytime in the database
  	database.ref().push({
  		name: trainName,
  		destination: destination,
  		time: firstTime,
  		frequency: frequency,
  		//dateAdded: firebase.database.ServerValue.TIMESTAMP
  	});
  		console.log(name);
  		console.log(destination);
  		console.log(time);
  		console.log(frequency);
  		//alert("Train added!");
  		//return false;
  	
  	//Clear all of the text-boxes
  	$("#train-name-input").val("");
  	$("#destination-input").val("");
  	$("#time-input").val("");
  	$("#frequency-input").val("");

  });

  // Firebase watcher + initial loader which is to grab the data and post into user area by using firebase listerner
  database.ref().on("child_added", function(snapshot) {
  		// Log everything that's coming out of snapshot
  		console.log(snapshot.val());
  		var newTrainInfo = snapshot.val();
  		console.log(newTrainInfo);
  		var tFrequency = newTrainInfo.frequency;
  		console.log(tFrequency);

      var firstTime = newTrainInfo.time;
      console.log(firstTime);
      // First Time (pushed back 1 year to make sure it comes before current time)

      var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");

      // Current Time
      var currentTime = moment();

      // Difference between the times
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      console.log(diffTime);

      // Time apart (remainder)
      var tRemainder = diffTime % tFrequency;

      // Minute Until Train
      var tMinutesTillTrain = tFrequency - tRemainder;

      // Next Train
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");


      //creates a data object to run through the loop
  	  var trainSchedule = moment(firstTimeConverted).add(frequency, "minutes");
  	  var minutesAway = moment(trainSchedule).add(currentTime, 'minutes');

      //Adds frequency interval at every iteration until  the next train time is greater than the current time
 	    if (parseInt(trainSchedule) < parseInt(currentTime)){
  		  //updates the loop train object
  		  trainSchedule = moment(trainSchedule).add(frequency, 'minutes');
  		  //updates the next train string 
  		  nextTrain = moment(trainSchedule).format('HH:mm');
  	  } 

 	    var minutesAway = moment(nextTrain).diff(currentTime, 'minutes');

 	    //displays the next arrival in military format
 	    var displayNextTrain = moment(trainSchedule).format('HH:mm');
 
       
	   //All user input will be posted in the user area
  	 $("tbody").append("<tr><td>" + newTrainInfo.name + "</td><td>" + newTrainInfo.destination + "</td><td>" + newTrainInfo.frequency + "</td><td>" + displayNextTrain + "</td><td>" + minutesAway + "</td></tr>");
  });

  