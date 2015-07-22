var chars;
$.getJSON( "https://raw.githubusercontent.com/AniMysore74/got-quiz-guide/gh-pages/assets/json/chars.json", function(data) {
  	chars = data;
})
  .done(function() {
    console.log( "second success" );
  })
  .fail(function() {
    console.log( "error" );
  })
  .always(function() {
    console.log( "complete" );
  });
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
			if(!form.rad[0].checked){
				display("Please choose how you want to search");
				return;
			}
			if(!form.names.checked) {
				display("Please choose what to search from");
				return;
			}
			if(form.searchField==null){
				display("Please enter what to search");
				return;
			}
		})();
 		if(form.rad[0].checked)
 			initialsSearch(form);
 		else if(form.rad[1].checked)
 			hangmanSearch();
 		else if(form.rad[2].checked)
 			anagramSearch();
 	}

	function initialsSearch(form)
	{
		//INITIALS
		var count = 0;
		console.log("Searching by initials")
		if(form.names.checked)
			console.log("through Names")
			for(var x in chars){
				var check= chars[x].name.split(" ");
				var flag=true;   
				var initials=form.searchField.value;

				console.log(chars[x].name+" "+initials);

				if(!(initials.length!==check.length)){		
					for(var y in check){
						console.log(check[y]+" "+check[y].charAt(0)+" vs "+initials.charAt(y));
						if(check[y].charAt(0)!==initials.charAt(y).toLocaleUpperCase()){
								flag=false;
								console.log(flag+"Checker loop");
						}
			        }
			    }
			    else
			    {
			    	flag=false;
			    	console.log("Lengths not matching")
			    	console.log(flag+"Position loop");
			    
			    }
				if(flag){
					console.log(chars[x].name);
					display(null,x,{name:true,description:true});
					count++;
				}
				else	
					console.log("No name Found");
				/*if(form.alias.checked && chars[x].alias[0]!=null)
					console.log("and through Aliases")
					
					if(titleSearch(initials,x)!==0){
						console.log(chars[x].name+" "+chars[x].alias);
						display(chars[x].alias+", "+chars[x].name);
						count++;
					}*/
			}
		if(count==0){
			noResult();
		}
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
	function noResult(){
		$('.results').removeClass('show');
		$('.results').addClass('show');
		$('<div class = "panel"> Nothing Found! Valar Morghulis </div>').appendTo('.results .columns');
	}
	function display(text, pos, params){
		$('.results').removeClass('show');
		$('.results').addClass('show');
		if(text!==null)
			$('<div class = "panel">'+text+'</div>').appendTo('.results .columns');
		else if(params.name && params.description && chars[pos].description!="")
			$('<div class = "panel"><span class = "name">'+chars[pos].name+'</span>'+" "+chars[pos].description+'</div>').appendTo('.results .columns');
		else if(params.name)
			$('<div class = "panel"><span class = "name">'+chars[pos].name+'</span></div>').appendTo('.results .columns');
	}

	/*function getNamebyAnagram()
	{
		//Anagrams
		var  permutations= permutation(anagram);
		//permutation = temp.split(" ");
		console.log(permutations);
		for(var x in chars){
			check=chars[x].name.split(",").join("").toUppercase();
			var flag=1;
			for(var y in permutations){
				if(check===permutations[y].toUppercase())
					flag=0;
			}
			if(flag)
				console.log(chars[x].name+" "+chars[x].alias);
			else	
				console.log("Not Found");
		}*/
	//getNamebyAnagram();

	