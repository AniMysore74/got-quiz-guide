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
var chars,sorted;

//Loading JSON Files
$.getJSON( "https://raw.githubusercontent.com/AniMysore74/got-quiz-guide/gh-pages/assets/json/chars.json", function(data) {
  	chars = data;
})
.done(function() {
    $.getJSON( "https://raw.githubusercontent.com/AniMysore74/got-quiz-guide/gh-pages/assets/json/sorted.json", function(data) {
	  sorted = data;
	})
	.done(function() {
		jsonloadmsg(true);
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
$('.searchField').keypress(function( event ) {
  if(event.keyCode == 13){ 
   event.preventDefault();
 }
});
$('.password').keypress(function( event ) {
  if(event.keyCode == 13){ 
   event.preventDefault();
 }
});
//--------------------		1A) LOCKER FEATURE		--------------------//
function pass(form) {
	var p = "DaKingInDaNawth";
	if(form.password.value=p)
		$('.locker').fadeOut(100).hide(100);
	return false;
}

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

	//Calls search functions
	if(form.rad[0].checked)
		initialsSearch(form.searchField.value);
	else if(form.rad[1].checked)
		hangmanSearch(form.searchField.value);
	else if(form.rad[2].checked)
		anagramSearch(form.searchField.value);
	return false;
}
//----------------------------------------------------------------------//
//					 	3) Searching For Initals
//----------------------------------------------------------------------//
function initialsSearch(initials)
{
	var searchCounter = 0;

		for(var x in chars){
			var check= chars[x].name.split(" ");
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
				display({dataObject:true,name:true,description:true},chars[x]);
				searchCounter++;
			}
		}
	if(!searchCounter){
		display({noResult:true});
	}
}
//----------------------------------------------------------------------//
//						 4) Searching for Hangman 						//
//----------------------------------------------------------------------//

//Escapes RedExp special Expressions. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegExp(string) {
	   return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function attempt (pattern, guess)
{
    if (pattern.exec(guess) != null) return true;
    if (pattern.exec(guess.replace("The ", "")) != null) return true;
    if (pattern.exec(guess.replace("&", "and")) != null) return true;
    if (pattern.exec(guess.replace("'", "")) != null) return true;
    if (pattern.exec(guess.replace(",", "")) != null) return true;
    if (pattern.exec(guess.replace(":", "")) != null) return true;
    if (pattern.exec(guess.replace("-", "")) != null) return true;
    if (pattern.exec(guess.replace(".", "")) != null) return true;
    if (pattern.exec(guess.replace("/", "")) != null) return true;
    if (pattern.exec(guess.replace("The ", "").replace("&", "and")) != null) return true;
    return false;
}

// Uses _ as blank characters, * as wildcards
function hangmanSearch(blanked)
{
	var searchCounter = 0;
   	// Build into regex
    blanked = blanked.replace("_", "[a-z]");
    pattern = new RegExp(blanked, "i");
    for (var i in chars)
    {
        var guess = chars[i].name;
        if (blanked.length >= guess.length)
        {
            if (attempt(pattern, guess))
            {
            	display({dataObject:true,name:true},chars[i].name);
            	searchCounter++;
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
	for(var x in sorted)
	{
		if(sorted[x].sort===anagramSorted)
		{
			display({dataObject:true,name:true},sorted[x])
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