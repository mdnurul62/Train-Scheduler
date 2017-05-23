//alert("Hello");

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

  //Initial variables
  var trainName 	= "Acela";
  var destination = "DC";
  var firstTime 	= "00:30";
  var frequency 	= "1";

//$(document).ready(function() {
	//Capture input by clicking a button
  	$("#add-train-name").on("click", function(event) {
  		event.preventDefault();

  	//To grab values from text-boxes
  	var trainName 	= $("#train-name-input").val().trim();
  	var destination = $("#destination-input").val().trim();
  	var firstTime 	= $("#time-input").val().trim();
  	var frequency 	= $("#frequency-input").val().trim();

  	var train = {
  		name: trainName,
  		destination: destination,
  		time: firstTime,
  		frequency: frequency
  	};

  	console.log(trainName);
  	console.log(destination);
  	console.log(firstTime);
  	console.log(frequency);
  	//return false;
  	
  	//Uploading train data to the database
  	database.ref().set(train);
  		console.log(train.name);
  		console.log(train.destination);
  		console.log(train.time);
  		console.log(train.frequency);
  		//Alert
  		//alert("Train added!");
  		//return false;
  	
  	//Clear all of the text-boxes
  	$("#train-name-input").val("");
  	$("#destination-input").val("");
  	$("#time-input").val("");
  	$("#frequency-input").val("");

  	//return false;


  });

  // Firebase watcher + initial loader
  database.ref().on("value", function(snapshot) {
  		// Log everything that's coming out of snapshot
  		console.log(snapshot.val());

  		var newTrain = snapshot.val();
  		console.log(newTrain);
  		var tFrequency = newTrain.frequency;
  		console.log(tFrequency);

        var firstTime = newTrain.time;
        console.log(firstTime);
        // First Time (pushed back 1 year to make sure it comes before current time)

        var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");

        // Current Time
        var currentTime = moment();

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

        // Time apart (remainder)
        var tRemainder = diffTime % tFrequency;

        // Minute Until Train
        var tMinutesTillTrain = tFrequency - tRemainder;

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");

  	$("tbody").html("<tr><td>" + newTrain.name + "</td><td>" + newTrain.destination + "</td><td>" + newTrain.frequency + "</td><td>" + moment(nextTrain).format("hh:mm") + "</td><td>" + tMinutesTillTrain + "</td></tr>");

  });

