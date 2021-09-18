/**
 * List of Calendars to include in Email
 */

function WeeklySeminars(){

// List of Calendars to include in Email
 
var calendarIdList = [ 'uganumbertheory@gmail.com', // NT
'ugaanalysis@gmail.com', // Analysis
'gk8klfjh7i9pthrv1cp8c8bj8c@group.calendar.google.com' // Topology 
];



// Defines Days to Display 

var firstDay = 3; // Number of days until first displayed day of events
var duration = 7; // Number of days of events to display

var now = new Date();
var startDay = new Date();
var counterDay = new Date();
var endOfCounterDay = new Date();

startDay.setDate(now.getDate()+firstDay); // First day of events to display

var NumberOfCalendars = calendarIdList.length;
Logger.log("There are " + NumberOfCalendars + " calendars.");

var TotalNumberOfEvents = 0;

var Message = '';
var NewLine = '';

// Header

Message = "<br><div><span style='font-weight: 600;'>Week of </span><span style='font-weight: 600; color: navy;'> " + Utilities.formatDate(startDay, 'America/New_York', 'MMMM dd, yyyy') + "</span></div><br>";

// Start of Table

Message += "<table class='agenda-table'>"

// Parsing of Data

for(var h=0; h<duration; h++){

counterDay.setDate(startDay.getDate()+h);
endOfCounterDay.setDate(counterDay.getDate());
counterDay.setHours(0,0,0,0); // Includes all events starting at Midnight
endOfCounterDay.setHours(23,59,0,0); // Includes all events starting up to 23:59

var multiple = 0;

Logger.log("Day # " + h + ", date: " + Utilities.formatDate(counterDay, 'America/New_York', 'EEE MMMM dd, yyyy'));

for (var i = 0; i < NumberOfCalendars; i++) {

 var calendarId = calendarIdList[i];

  var events = Calendar.Events.list(calendarId, {
    timeMin: counterDay.toISOString(),
    timeMax: endOfCounterDay.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 12
  });

  if (events.items && events.items.length > 0) {
  
    Logger.log("   Calendar # " + i + " has " + events.items.length + " events.");
    
    for (var j = 0; j < events.items.length; j++) { 

      multiple += 1 ;
      TotalNumberOfEvents +=1 ;

      var event = events.items[j];
      var splitEventId = event.getId().split('@');
      var eventURLlink= "<A href='https://calendar.google.com/calendar/event?eid=" + Utilities.base64Encode(splitEventId[0] + " " + calendarId) + "'>" + event.summary +" </A> "

      var whenDay = '';
      var whenTime = '';

      if (event.start.date) {
        // All-day event.
        // var start = new Date(event.start.date);
        whenTime = "<span style='color: grey;'>all day</span>";

      } else {
        var start = new Date(event.start.dateTime);
        whenTime = Utilities.formatDate(start, 'America/New_York', 'h:mm a');
      }
      
      whenDay = Utilities.formatDate(counterDay, 'America/New_York', 'EEE MMM dd');

      var venue = '';

      // Displays Location if Defined

      if (event.location != undefined) {
        venue = " <span style='color: gray;'>in</span> " + event.location; 
      } else {
      }

      // Hides day when there are multiple events

      if (multiple>1) {
        whenDay = "";  
      } else {
        Message += "<br>";      // Add a blank line and display Day 
      }

      // Builds Table Row with Event Data

      NewLine =  "<tr><td style='padding-right:40px;'>";
      NewLine +=  whenDay ;
      NewLine += "</td><td style='padding-right:40px;'>" ;
      NewLine += whenTime; 
      NewLine += "</td><td style='padding-right:40px;'>" ;
      NewLine += eventURLlink ;
      NewLine += "</td><td style='padding-right:40px;'>" ;
      NewLine +=  venue;
      NewLine += "</td></tr>";

      Message += NewLine;

  
    }
  } else {
    // No events this week for this calendar
    } 
}
}

// End of Table

Message += "</table>"
// Message += "<p><img style='display: block; margin-left: 0px; width: 100px;' alt='***' src='http://jimmy.klacto.net/pix/calvin.png'><br>"

Logger.log('There are ' + TotalNumberOfEvents + ' events this week.')

keepMePosted(Message);

}


/**
 * Email Digest
 */

function keepMePosted(courier) {
    var emailAddress = 'destinataire@gmail.com'; // To whom the email should be sent
    var message = courier; 
    var subject = 'Math seminar weekly digest '; // Email Subject
    MailApp.sendEmail({to:emailAddress, subject: subject, htmlBody: message});
}


// The End
