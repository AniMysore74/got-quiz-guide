//----------------------------------------------------------------------//
//----------------------------------------------------------------------//
//																	  	//
//						ICE AND FIRE QUIZ HELPER 					  	//
//			Copyright Aniruddha Mysore - github.com/animysore74		  	//
//		This code is Open source, and licensed under the MIT license 	//
//																	  	//
//----------------------------------------------------------------------//
//----------------------------------------------------------------------//


//----------------------------------------------------------------------//
//					 1) Initializtion of Resources
//----------------------------------------------------------------------//
//Initialize Foundation
$(document).foundation();

// Global Variables to store Data
var DATA, CHARS, OBJECTS, PLACES, EVENTS, SORTED;
//Loading JSON Files
$.getJSON("https://raw.githubusercontent.com/AniMysore74/got-quiz-guide/gh-pages/assets/json/chars.json", function(data) {
    CHARS = data;
})
.done(function() {
    $.getJSON( "https://raw.githubusercontent.com/AniMysore74/got-quiz-guide/gh-pages/assets/json/chars.json", function(data) {
	  OBJECTS = data;
	}  )
	.done(function() {
		$.getJSON( "https://raw.githubusercontent.com/AniMysore74/got-quiz-guide/gh-pages/assets/json/chars.json", function(data) {
		  PLACES = data;
		})
		.done(function() {
			$.getJSON( "https://raw.githubusercontent.com/AniMysore74/got-quiz-guide/gh-pages/assets/json/chars.json", function(data) {
			  EVENTS = data;
			})
			.done(function() {
				$.getJSON( "https://raw.githubusercontent.com/AniMysore74/got-quiz-guide/gh-pages/assets/json/sorted.json", function(data) {
				  SORTED = data;
				})
				.done(function() {
					jsonloadmsg(true);
                     DATA = new Array(CHARS,OBJECTS,PLACES,EVENTS,SORTED);
				})
				.fail(function() {
					jsonloadmsg(false);
				})
			})
			.fail(function() {
				jsonloadmsg(false);
			})
		})
		.fail(function() {
			jsonloadmsg(false);
		})
	})
	.fail(function() {
		jsonloadmsg(false);
	})
})
.fail(function() {
    jsonloadmsg(false);
})

//Load message diplayer
function jsonloadmsg(flag) {
	if(flag){
		$('.lander').fadeOut(500).hide(500);
	}
	else {
		$('.lander .message').text(" Error Loading Databases. Please refresh your browser.")
	}
}
// Stop page redirects on pressing Enter key
$('.searchField').keypress(function( event ) {
  if(event.keyCode == 13){
   event.preventDefault();
 }
});
//----------------------------------------------------------------------//
//							 2) Form Handling
//----------------------------------------------------------------------//
function formHandler(form){
	//Upon receving form, clear previous reults
	$(".results .columns").empty();

	//Checks if Form is ready for processing
	if(!form.rad[0].checked && !form.rad[1].checked && !form.rad[2].checked){
		display({text:"Please choose how you want to search"});
		return;
	}
	if(!form.names.checked) {
		display({text:"Please choose what to search from"});
		return;
	}
	if(form.searchField.value===' '){
		display({text:"Please enter what to search"});
		return;
	}

	//Processing Form
	var params = new Object();
	if(form.names.checked)
		params.names=true;
	else if(form.objects.checked)
		params.objects=true;
	else if(form.places.checked)
		params.places=true;
	else if(form.events.checked)
		params.events=true;

	//Calls search functions
	for(var x in params)
	{
		if(x==="names")	category = 0;
		if(x==="objects") category = 1;
		if(x==="places") category = 2;
		if(x==="events") category = 3;
		if(x==="alias")	category = -1
		if(params[x])
		{
				if(form.rad[0].checked)
					initialsSearch(form.searchField.value,category);
				else if(form.rad[1].checked)
					hangmanSearch(form.searchField.value,category);
				else if(form.rad[2].checked)
					anagramSearch(form.searchField.value);
				return false;
		}
	}
}
//----------------------------------------------------------------------//
//					 	3) Searching For Initals
//----------------------------------------------------------------------//
function initialsSearch(initials, category)
{
	var searchCounter = 0;
	if(category < 0)
		searchCounter = aliasInitials(initials,category);
	else{
		for(var x in DATA[category]){
			var check= DATA[category][x].name.split(" ");
			var flag=true;
			if(!(initials.length!==check.length)){
				for(var y in check){
					if(check[y].charAt(0)!==initials.charAt(y).toLocaleUpperCase()){
							flag=false;
					}
		        }
		    }
		    else
		    {
		    	flag=false;
		    }
			if(flag){
				display({dataObject:true,name:true,description:true},DATA[category][x]);
				searchCounter++;
			}
		}
	}
	if(!searchCounter){
		display({noResult:true});
	}
}
function aliasInitials(initials,category)
{
	var searchCounter = 0;
	for(var x in DATA[category]){
		for(var y in DATA[category][x].alias){
			var check= DATA[category][x].alias[y].split(" ").toLocaleUpperCase;
			var flag=true;
			if(!(initials.length!==check.length)){
				for(var z in check){
					if(check[z].charAt(0)!==initials.charAt(z).toLocaleUpperCase()){
							flag=false;
					}
		        }
		    }
		    else
		    {
		    	flag=false;
		    }
			if(flag){
				display({dataObject:true,name:true,description:true},DATA[category][x].alias[y]);
				searchCounter++;
			}
		}
		return searchCounter;
	}
}
//----------------------------------------------------------------------//
//						 4) Searching for Hangman 						//
//----------------------------------------------------------------------//

//Escapes RedExp special Expressions. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegExp(string) {
	   return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
function replaceAll(string, find, replace) {
  return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
function attempt (pattern, guess)
{
    if (pattern.exec(guess) != null) return true;
    if (pattern.exec(replaceAll("The ", "",guess)) != null) return true;
    if (pattern.exec(replaceAll("&", "and",guess)) != null) return true;
    if (pattern.exec(replaceAll("'", "",guess)) != null) return true;
    if (pattern.exec(replaceAll(",", "",guess)) != null) return true;
    if (pattern.exec(replaceAll(":", "",guess)) != null) return true;
    if (pattern.exec(replaceAll("-", "",guess)) != null) return true;
    if (pattern.exec(replaceAll(".", "",guess)) != null) return true;
    if (pattern.exec(replaceAll("/", "",guess)) != null) return true;
    if (pattern.exec(replaceAll("The ", "", replaceAll("&", "and",guess)) != null)) return true;
    return false;
}

// Uses _ as blank characters, * as wildcards
function hangmanSearch(blanked,category)
{
	var searchCounter = 0;
	if(category < 0)
		return;
	else{
	   	// Build into regex
	    blanked = replaceAll("_", "[a-z]",blanked);
	    pattern = new RegExp(blanked, "i");
	    console.log(pattern);
	    for (var i in DATA[category])
	    {
	        var guess = DATA[category][i].name;
	        if (blanked.length >= guess.length)
	        {
	        	console.log(attempt(pattern,guess));
	            if (attempt(pattern, guess))
	            {
	            	display({dataObject:true,name:true},DATA[category][i].name);
	            	searchCounter++;
	            }
	        }
	    }
	}
	if(!searchCounter)
	    display({noResult:true})
}
//----------------------------------------------------------------------//
//					 	5) Searching for Anagrams 						//
//----------------------------------------------------------------------//
function anagramSearch(inputAnagram)
{
	var searchCounter=0;
	var anagramSorted= inputAnagram.toLocaleUpperCase().split('').sort().join('').trim();
	for(var x in SORTED)
	{
		if(SORTED[x].sort===anagramSorted)
		{
			display({dataObject:true,name:true},SORTED[x])
			searchCounter++;
		}
	}
	if(!searchCounter)
		display({noResult:true});
}
//----------------------------------------------------------------------//
//					 6) Result Display Function  						//
//----------------------------------------------------------------------//
function display(params, dataObject){
	$('.results').removeClass('show');
	$('.results').addClass('show');
	if(params.hasOwnProperty("text"))
		$('<div class = "panel">'+params.text+'</div>').appendTo('.results .columns');
	else if(params.noResult)
		$('<div class = "panel"> Nothing Found! Valar Morghulis </div>').appendTo('.results .columns');
	else if(params.hasOwnProperty("dataObject"))
	{
		if(params.name && params.description && dataObject.hasOwnProperty("description"))
			$('<div class = "panel"><span class = "name"><a href = http://awoiaf.westeros.org/index.php?title=Special%3ASearch&profile=default&search='+encodeURI(dataObject.name)+'&fulltext=Search">'+dataObject.name+'</a></span>'+" "+dataObject.description+'</div>').appendTo('.results .columns');
		else if(params.name)
			$('<div class = "panel"><span class = "name"><a href = http://awoiaf.westeros.org/index.php?title=Special%3ASearch&profile=default&search='+encodeURI(dataObject.name)+'&fulltext=Search">'+dataObject.name+'</a></span></div>').appendTo('.results .columns');
	}
	return true;
}
