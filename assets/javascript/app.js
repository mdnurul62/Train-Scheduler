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


	//Initial variables to contain data in form
  	var trainName 	= "";
  	var destination = "";
  	var firstTime 	= "";
  	var frequency 	= "";


	//jQuery on click statement to capture input data by clicking a button with ID "add-train-name" to store data in variables
  	$("#add-train-name").on("click", function(event) {
  		event.preventDefault();

	//To grab values from text-boxes
  	var trainName 	= $("#train-name-input").val().trim();
  	var destination = $("#destination-input").val().trim();
  	var firstTime 	= $("#time-input").val().trim();
  	var frequency 	= $("#frequency-input").val().trim();
	// Create a new variable as object containing sets of property and value
  	var train = {
  		name: trainName,
  		destination: destination,
  		time: firstTime,
  		frequency: frequency,
  		dateAdded: firebase.database.ServerValue.TIMESTAMP
  	};

  	console.log(trainName);
  	console.log(destination);
  	console.log(firstTime);
  	console.log(frequency);
  	//return false;
  	
	//Uploading train data to the database by using push method to store data everytime in the database
  	database.ref().push(train);
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

  // Firebase watcher + initial loader which is to grab the data and post into user area by using firebase listerner
  database.ref().on("child_added", function(snapshot) {
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
	//All user input will be posted in the user area
  	$("tbody").append("<tr><td>" + newTrain.name + "</td><td>" + newTrain.destination + "</td><td>" + newTrain.frequency + "</td><td>" + moment(nextTrain).format("hh:mm") + "</td><td>" + tMinutesTillTrain + "</td></tr>");
    });