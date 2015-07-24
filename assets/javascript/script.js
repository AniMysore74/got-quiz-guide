//Loading JSON Files
var chars,sorted;
$.getJSON( "https://raw.githubusercontent.com/AniMysore74/got-quiz-guide/gh-pages/assets/json/chars.json", function(data) {
  	chars = data;
})
.done(function() {
    console.log( "C.H.A.R.S Loaded" );
})
.fail(function() {
    console.log( "Error loading Json" );
})
$.getJSON( "https://raw.githubusercontent.com/AniMysore74/got-quiz-guide/gh-pages/assets/json/sorted.json", function(data) {
  sorted = data;
})
.done(function() {
    console.log( "S.O.R.T.E.D Loaded" );
})
.fail(function() {
    console.log( "Error loading Json" );
})
 	//FORM HANDLER 
 	function formHandler(form,defaultVal){
 		//Upon receving form
		console.log("Recieved Form");
		$(".results .columns").empty();
		//Checks if data has been entered before clicking
		if(form.searchField==defaultVal)
				return;
			//Checks if Form is ready for processing
		(function blankchecker(){
			if(!form.rad[0].checked && !form.rad[2].checked){
				display({text:"Please choose how you want to search"});
				return;
			}
			if(!form.names.checked) {
				display({text:"Please choose what to search from"});
				return;
			}
			if(form.searchField==null){
				display({text:"Please enter what to search"});
				return;
			}
		})();
 		if(form.rad[0].checked)
 			initialsSearch(form.searchField.value);
 		else if(form.rad[1].checked)
 			hangmanSearch();
 		else if(form.rad[2].checked)
 			anagramSearch(form.searchField.value);
 	}

	function initialsSearch(initials)
	{
		var searchcounter = 0;
		if(form.names.checked)
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
					searchcounter++;
				}
				/*if(form.alias.checked && chars[x].alias[0]!=null)
					console.log("and through Aliases")
					
					if(titleSearch(initials,x)!==0){
						console.log(chars[x].name+" "+chars[x].alias);
						display(chars[x].alias+", "+chars[x].name);
						count++;
					}*/
			}
		if(searchcounter==0){
			noResult();
		}
		function titleSearch(initials, x){
			var flag = 1;
			for(var y in chars[x].alias){
				var check= chars[x].alias[y].split(" ");   
				for(var z in check){
					if(check[z].charAt(0)!==initials.charAt(z)){
							flag=0;
					}
		        }
		    }
			if(flag)
				return chars[x].alias[z];
			else
				return 0;
		}
	}

	function anagramSearch(inputAnagram)
	{
		var searchcounter=0;
		var anagramSorted= inputAnagram.toLocaleUpperCase().split('').sort().join('').trim();
		console.log(anagramSorted);
		for(var x in sorted)
		{
			if(sorted[x].sort===anagramSorted)
			{
				display({dataObject:true,name:true},sorted[x])
			}
		}
	}
	function noResult(){
		$('.results').removeClass('show');
		$('.results').addClass('show');
		$('<div class = "panel"> Nothing Found! Valar Morghulis </div>').appendTo('.results .columns');
	}
	function display(params, dataObject){
		$('.results').removeClass('show');
		$('.results').addClass('show');
		if(params.hasOwnProperty("text"))
			$('<div class = "panel">'+params.text+'</div>').appendTo('.results .columns');
		else if(params.hasOwnProperty("dataObject"))
		{
			if(params.name && params.description && dataObject.hasOwnProperty("description"))
				$('<div class = "panel"><span class = "name">'+dataObject.name+'</span>'+" "+dataObject.description+'</div>').appendTo('.results .columns');
			else if(params.name)
				$('<div class = "panel"><span class = "name">'+dataObject.name+'</span></div>').appendTo('.results .columns');
		}
		
	}