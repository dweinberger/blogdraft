/**
 * @author David Weinberger
 * david@weinberger.org
 
 /**
 * @author David Weinberger
 * david@weinberger.org
 The MIT License (MIT)

Copyright (c) 2015 David Weinberger

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

var revdate = "August 15, 2015";

// ------------- S E T U P  [obsolete?]-=---------------------------------
// IN FIREFOX, set signed.applets.codebase_principal_support to true (about:config)
// IN OS X edit /private/etc/apache2/httpd.conf (as sudo)
// UNCOMMENT: 
// # AddHandler cgi-script .cgi
// AND ADD
//  AddHandler cgi-script .pl
// Uncomment: 
// # LoadModule php5_module libexec/httpd/libphp5.so
// or uncomment # LoadModule php5_module libexec/apache2/libphp5.so
//
// apachectl restart



// =============== END OF EDITABLE PREFERENCES. ================= 
// LEAVE THE REST OF THIS ALONE...

// GLOBALS

var gdelimiters = " .,;:!?\r'\")]<>\n";
var tagAutoCompleteArray = new Array();
var selstart = new Number();
var selend = new Number();
var seltext = new Number();
var linkurls = new Array();
var linktitles = new Array();
var linkdates = new Array();
var linkanchors = new Array();
var gTagNames = new Array(); // just the tag
var gTagNames = new Array(); // tag+times used -- don't use this one
var gTagTimes = new Array(); // how many times tag was used
var gTagNamesdisplay = new Array();
var favoritelinks = new Array(); // favorites to fill in
var favoriteanchors = new Array();
var autolinkanchors = new Array(); // autolinks are filled in when you finish typing the trigger word
var autolinks = new Array();
var g_expansions = new Array();
var expansions_replacements = new Array();
var configmeta = new Array();
var configdata = new Array();
var tweeters_anchors = new Array();
var tweeters_tweetnames = new Array();
var entryLength = 0;
var previouskey = ""; // for cK, for Opera
var debugon = true;
var quote2 = '"'; //"&#34;";
var quote1 = "'"; //"&#39;";
var priorspace = "";
var postspace = "";
var keystrokectr = 0;
var chosencolor="";
var browsertype="";


// -------- KEY CAPTURE

function init(){
	
	sizeEditAndWysiAreas();	
	
	$("#ed").animate({opacity : 1.0}, 1000, function(){});
	
	// hide the preview area?
	if (showWysiArea==false){
		ShowHideWysi(); // this will toggle it to hidden
	}
	if (includeTags==false){
		document.getElementById("includetagscheck").checked = false;
	}
	
	
	loadkeycapturer();
	readTags();
	readLinks();
	readExpansions();
	readFavoriteLinks();
	readTwitterLinks();
	
	$("#keystrokescounter").text(KeystrokesBeforeSave);
	location.href="#titlebox";
	updateStatus("Initialization complete.")
	document.getElementById('revdatespan').innerHTML=" Revision: " + revdate;
	document.getElementById('posttitle').focus();
	
	
	//  Presses next button if user enters Enter key, in elements of class "submitOnEnter"
  // from http://stackoverflow.com/questions/382171/use-javascript-to-change-which-submit-is-activated-on-enter-key-press
	$(".submitOnEnter").keydown( function(event) {
				if (event.keyCode==13) {
					 $(this).nextAll().eq(0).click();
				}
		});
	// click clears notificiation
	$("#insertme").click(function(){
		$("#insertme").finish();
		$(this).hide("slide",{direction: "right"},500);
	})
	// make LinkBlock draggable
	$( "#LinkBlock" ).draggable({
		containment: "#container"
	});
	
	// thanks http://www.gmarwaha.com/blog/2009/06/16/ctrl-key-combination-simple-jquery-plugin/
	$.ctrl = function(key, callback, args) {
		$(document).keydown(function(e) {
			if(!args) args=[]; // IE barks when args is null 
			if(e.keyCode == key.charCodeAt(0) && e.ctrlKey) {
				callback.apply(this, args);
				return false;
			}
		});        
	};
	// simulate button press
	$(".tool").mousedown(function(){
		$(this).css({"background-color" : "#D408B9"}); //"#2FAF17"});
	});
	$(".tool").mouseup(function(){
		$(this).animate({"background-color" : "#EE6D0B"}, 500, function(){});
	});



    
    // --- control-key mappings
	$.ctrl('B', function() {
		toolselect("boldme");
	});
	$.ctrl('I', function() {
		toolselect("italme");
	});
	$.ctrl('K', function() {
		toolselect("indentme");
	});
	$.ctrl('M', function() {
		blindlink();
	});
	$.ctrl('N', function() {
		toolselect("linkme");
	});
	$.ctrl('P', function() {
		toolselect("pme");
	});
	$.ctrl('U', function() {
		toolselect("underme");
	});
	$.ctrl('S', function() {
		toolselect("saveme");
	});
	$.ctrl('G', function() {
		searchGoogle();
	});
	$.ctrl('', function() {
		toolselect("");
	});

	// escape key mapping
	$(document).keyup(function(k) {
		if (k.keyCode == 27){
			// close overlay if it's open
			if ( $("#transoverlay").is(":visible")){
				 $("#transoverlay").fadeOut(300);
				 // get first visible child div and close that
				 // thanks http://stackoverflow.com/questions/18162689/getting-first-visible-element-with-jquery
				 $('#transoverlay').find('div:visible:first').hide(300);
			}
			if ( $("#LinkBlock").is(":visible")){
				 $('#LinkBlock').fadeOut(300);
			}
		}		
	});
	
	// create checkboxes for categories from list in blogdraft_preferences.txt
	for (var i=0; i < catlist.length; i++){
	var s = ' <input value="' + catlist[i] + '" type="checkbox"'  + '">' + catlist[i];
			$("#categoriesdiv").append(s);
	}
	// list symbols from list in blogdraft_preferences.txt
	for (var i=0; i < symbolslist.length; i++){
		var span = document.createElement("span");
		span.setAttribute("class","symbols");
		span.setAttribute("onclick","insertSymbol('" + symbolslist[i] + "')");
		var symb = "&" + symbolslist[i] + ";"
		$(span).html(symb );
		$("#symbolsspan").append(span);
	}	
	updateStatus("Prefs: " + catlist.length + " categories, " + symbolslist.length + " symbols.");
	
	if (showTagCloud == "TRUE"){
		buildTagCloud();
	}

	// handle getting file selected for image upload
	//document.getElementById('fileselector').addEventListener('change', handleFileSelect, false);

}

function loadkeycapturer(){
    // Adds event listener to textarea
    updateStatus("Loading key capturer");
    
    //which browser?
    var browserstr = navigator.userAgent.toLowerCase();

   if (browserstr.indexOf("chrome") > -1) {
       browsertype = "webkit";
       document.getElementById('ed').addEventListener('keydown', cK, false);
    }
   if (browserstr.indexOf("safari") > -1) {
       browsertype = "webkit";
       document.getElementById('ed').addEventListener('keydown', cK, false);
    }
   if (browserstr.indexOf("firefox") > -1) {
       browsertype = "firefox";
       document.getElementById('ed').addEventListener('keypress', cK, false);
    }
    if (browserstr.indexOf("opera") > -1) {
       browsertype = "opera";
       document.getElementById('ed').addEventListener('keypress', cK, false);
    }
    document.getElementById('tagstextarea').addEventListener('keypress', tagcompleter, true);
	// document.getElementById('testtext').addEventListener('keypress', testtagcompleter, true);
    updateStatus("Loaded keys for " + browsertype);
}





function cK(e){

	// keystroke processor
	var ctl = false;
	// how many keystrokes? Time to save?
    keystrokectr++;
    if (updateAfterEveryKeystroke){
    	updatehtml();
    }
	if (keystrokectr > KeystrokesBeforeSave) {
		keystrokectr=0;
		//AutoSaveFile();	
		saveFile("QUIET");
		// upodate wysi view
		if (document.getElementById("autoupdatehtmlcheck").checked == true )
		{
			//updatehtml(); // now updated after every keystroke
		}
	}
	// insert keystroke counter
	$("#keystrokescounter").text(KeystrokesBeforeSave - keystrokectr) ;
	if (keystrokectr==0) {
		document.getElementById("keystrokecounter").innerHTML = "SAVED";
	}
	
	
	// The line below doesn't work but should work
   // var k = e ? e.which : window.event.keyCode;
   // instead:
   var k;
   if ((e.charCode==0) || (e.charCode==false)){
   	    k= e.keyCode;
   }
   else { k = e.charCode;}
    // Hide auto insert button if necessary
    if (document.getElementById('insertme').style.display == 'block') {
        document.getElementById('insertme').style.display = 'none';
    }
    var c = String.fromCharCode(e.which);
    
    // complete a word or sentence?
    if (document.getElementById('autoexpandcheck').checked) {
        var gotadelim = gdelimiters.indexOf(c); // gdelimiters is a global
        if (gotadelim > -1) { // (k==32){
            // alert('got a delim');
            var pw = getPriorWord();
            pw = trimSpacesAndLfs(pw);
			pw = trimMarkUp(pw);
            // check for expansions
            checkforexpansion(pw);
			if (pw != "") {
				var fav = replaceWithAutolink(pw);
			}			
        }
    }
      
    // if it's a CR, check to see if we need a <p>
    if ((document.getElementById('createps').checked == true) && (k == 13)) {
        //alert("CR");
        // was previous a CR also
        getSelectedText() // update caret pointer info
        var el = document.getElementById("ed");
        var txt = el.value;
        if (selstart > 0) {
            //alert("prev="+prevchar);
            var prevchar = txt.substring(selstart - 1, selstart);
            if (prevchar == "\n") {
                //alert("prev is cr");
                // is there a tag ahead of us?
                var ttag = "";
                var trimtext = txt.substr(selstart, txt.length); // remove leading spaces
                trimtext = trimSpacesAndLfs(trimtext);
                var p2 = trimtext.indexOf(">"); // find >
                if ((trimtext.substr(0, 1) == "<") && (p2 > 0)) {
                    ttag = trimtext.substring(0, p2);
                    ttag = ttag.toUpperCase();
                }
                var followingtag = "<NULL><P><OL><UL><BLOCKQUOTE><BR>".indexOf(ttag);
                if (followingtag == 0) {
                    // insert the <p>
                    var newselstart = el.selectionStart
                    txt = txt.substr(0, selstart - 1) + "\n\n<P>" + txt.substr(selstart, txt.length);
                    el.value = txt;
                    el.selectionStart = selstart + 4; //newselstart;
                    el.selectionEnd = selstart + 4; //newselstart;
                }
                
            }
        }
    }

}

function captureMousePosition(e){
	// captures the mouse position
	posx = 0; posy = 0;
	if (!e){var e = window.event;}
	if (e.pageX || e.pageY){
	posx = e.pageX;
	posy = e.pageY;
	}
	else if (e.clientX || e.clientY){
	posx = e.clientX;
	posy = e.clientY;
	}
	resizeWysiDisplay(posx);
	$("#sizingbardiv").fadeOut(500);
} 

function testtagcompleter(e){
	// get tagstring
	var tagel = document.getElementById('testtext');
	if (tagel==null){return}
    var tagcont = tagel.value;  
    // get position in the textbox
    var cursor = tagel.selectionStart;
	
	if ((cursor == "undefined") || (cursor==null)){
		return
	}
	
    // get new key
   var k;
   if ((e.charCode==0) || (e.charCode==false)){
   	    k= e.keyCode;
   }
   else { k = e.charCode;}
   var c = String.fromCharCode(e.which);
    // if it's a comma, then the user is happy with the word 
	if ( (c==",")){ 
	    
        return
    }
	
	// get the word being typed
	var wordbeingtyped, word, p1,p2;
	wordbeingtyped = getWordFromCursor(tagcont + c,cursor); // add current keystroke and get word cursor is in
	// returns an object. Yay!
	word = wordbeingtyped.word;
  
    // don't do anything if we're less than two chars in. (Check later for 2 chars into the word, not the text area)
    if (word.length < 0) {
        //tagel.value= tagel.value.substr(1,cursor) + c + tagel.value.substr(cursor, tagel.value,length);
        return true;
    }
	
	// get sel start and end
	getSelectedText();

    // look up word to find autocomplete possibility
    var i = 0;
    var oldword = "";
    var match = -1;
    done=false;
	var replacementword="";
	var hta = gTagNames;
	while (done != true){
        oldword = hta[i];
        if (oldword.indexOf(word) == 0) {
            // replace word
			replacementword=oldword;
           // alert(oldword + " " + word);
		   match = i;
		   
        }
		i = i + 1
		if ((match > -1) || (i == hta.length)){
			done=true;
		}
        
    }
    
    // if no match, then delete the suggestion
    if (match == -1) {
        return
    }
	else { // got a match
		// insert the word
		 
		 p1 = wordbeingtyped.p1;
	     p2 = wordbeingtyped.p2;
		tagel.value= tagel.value.substr(0,wordbeingtyped.p1) + replacementword + tagel.value.substr(wordbeingtyped.p2, tagel.value,length);
		var newcurs = selstart - 1; // insert one char behind where the autocompletion begins
		tagel.selectionStart=newcurs;
		}

    return false;
}

function ShowHideWysi(){
	// show or hide the wysiwyg div
	
	elw = document.getElementById("html");
	ele = document.getElementById("edcell");
	// toggle display of wysi element
	if (elw.style.display == "none") { // wysi area not shown
		elw.style.display = "block";
		ele.style.width= editAreaWidth;
	}
	else {
		elw.style.display = "none";
		ele.style.width = "99%";
	}
	
}

function resizeTextArea2(){
	// toggles height
	
	var wrapper = document.getElementById("editareawrapper");
	var edarea = document.getElementById("ed");
	//var ht = c;
	
	var state = document.getElementById("resizetextspan");
	var lbl = state.innerHTML;
	if (lbl == "Edit Area+") {
		document.getElementById("editareawrapper").style.height = "900px";
		document.getElementById("edcell").style.height = "800px";
		document.getElementById("ed").style.height = "800px";
		document.getElementById("html").style.height = "800px";
		state.innerHTML = "Edit Area-";
	}
	else {
		document.getElementById("editareawrapper").style.height = "400px";
		document.getElementById("edcell").style.height = "400px";//document.getElementById("edcell").style.height - 200;
		document.getElementById("html").style.height = "400px";
		document.getElementById("ed").style.height = "400px";
		document.getElementById("editareawrapper").style.height = "500px";
		//edarea.height = "400px";
		state.innerHTML = "Edit Area+";
	}
	
	
}


function resizeTextArea(){
	// UNUSED AND UNNEC: it's set to 100%, which works in a resize
	// resizes textarea used for main editing
	return;
	elta = document.getElementById("ed");
	eldiv= document.getElementById("edcell");
	var w = 	eldiv.style.width;
	if (w == "95%") {
		eldiv.style.width="75%";
	}
	else {
		eldiv.style.width="95%";
	}
	elta.style.width = "100%";
}


function openColorPicker(){
	// create table with 216 colors
	var i,j,h;
	var ctr=0;
	var hex="";
	var hex2="";
	var hex3="";
	var onclickstr="";
	// create an array of the 6 hex numbers used in Web colors
	var colors = new Array("00","33","66","99","CC","FF");
	
	// start a string that will contain the entire table
	var s="<table border=0 cellspace='2px'>"
	
	// Loop through the 6 color variables 3 times, creating all 216 combos
	for (i = 0; i < colors.length; i++) {
		if (ctr == 0) {
			s = s + "<tr>"; // beginning of each loop marks a new row in the table
		}
		hex = colors[i]; // get the first of the trio of hex numbers
		for (j = 0; j < colors.length; j++) {
			hex2 = hex + colors[j] // add the second of the trio of hex numbers
			for (h = 0; h < colors.length; h++) {
				hex3 = hex2 + colors[h]; // add the third in the trio
				// create a string for the onclick event that will trigger an action when the user clicks on a color
				onclickstr = "onclick='displayColorHex(\"" + hex3 + "\");'";
				// Add to the table, inserting the onclick string
				s = s + "<td width=10px height=10px bgcolor=#" + hex3 + "><p title='#" + hex3 +  "' " + onclickstr + ">&nbsp;&nbsp;</p></td>";
				ctr++; // increase the counter for this row
				if (ctr > 35) { // 216 colors, will make 6 rowss
					s = s + "</tr>"; // end the row
					ctr = 0; // reset the counter
				}	
			}
		}
	}
	
	s = s + "</tr></table>"; // end the table

    // create the string for a button that will let the user hide the color table
	var but =  "<p><input type=button value='hide' onclick='ShowHideDiv(" + '"colorpicker"' + ")'>";
	//add the button to the overall string
	s = s + but;
	// insert the entire string as the content of the span with the id "colorpicker"
	document.getElementById("colorpicker").innerHTML=s;
}

function displayColorHex(w){
	//alert(w);
	var el = document.getElementById("chosencolor");
	el.innerHTML="<span style='border-width:1pt; color:#" + w + "; font-family:Verdana;font-weight:bold;'> #" + w + "</span>";
}
function addTagFromText(){
    getSelectedText();
    if (seltext != "") {
        var tt = document.getElementById("tagstextarea");
        var ts = tt.value;
        if (ts != "") { // if already there, then add comma and space
            tt.value = ts + ", ";
        }
        tt.value = ts + seltext;
    }
}


// ---- TAG AUTOCOMPLETER
function tagcompleter(e){
    
    // check checkbox
    if (document.getElementById('autocompletecheckbox').checked != true) {
        return true;
    }
	
	// get tagstring
	var tagel = document.getElementById('tagstextarea');
	if (tagel==null){return}
    var tagcont = tagel.value;  
    // get position in the textbox
    var cursor = tagel.selectionStart;
	
	if ((cursor == "undefined") || (cursor==null)){
		return
	}
	
	// get textarea where suggestions will appear
	var suggestbox = document.getElementById("tagsautosuggestarea");
	if (suggestbox == null) {return} // error check
    

    // get new key
   var k;
   if ((e.charCode==0) || (e.charCode==false)){
   	    k= e.keyCode;
   }
   else { k = e.charCode;}
   var c = String.fromCharCode(e.which);
    // if it's a comma, then the user is happy with the word so ignore
	// and clear out autosuggest box
	if ( (c==",")){ 
	    suggestbox.value=""; // clear the autosuggest box
        return
    }
	
	// get the word being typed
	var wordbeingtyped, word, p1,p2;
	wordbeingtyped = getWordFromCursor(tagcont + c,cursor); // add current keystroke and get word cursor is in
	// returns an object. Yay!
	word = wordbeingtyped.word;
	
	// if it's a right arrow and there's a suggestion, put in the suggestion
	if ((k == autoCompleteKey) && (suggestbox.value != "")) {
		// get object of word and pointer to begin and end in the entire tagstring
		 wordbeingtyped = getWordFromCursor(tagcont + c,cursor); 
		 p1 = wordbeingtyped.p1;
	     p2 = wordbeingtyped.p2;
	   //tagel.selectionStart=wordbeingtyped.p1;
	//tagel.selectionEnd=wordbeingtyped.p2;
	//tagel.selection= replacementword;
	tagel.value= tagel.value.substr(0,p1) + suggestbox.value + tagel.value.substr(p2, tagel.value,length);
       tagel.selectionStart=selstart + replacementword.length;
	  setCaretPosition(p1 + replacementword.length);
		return;
	}
    
    // not a comma or space, so see if word-so-far has a match

    
    // don't do anything if we're less than two chars in. (Check later for 2 chars into the word, not the text area)
    if (word.length < 4) {
        //tagel.value= tagel.value.substr(1,cursor) + c + tagel.value.substr(cursor, tagel.value,length);
        return true;
    }
	
	// get sel start and end
	getSelectedText();
    
    // look up word to find autocomplete possibility
    var i = 0;
    var oldword = "";
    var match = -1;
    done=false;
	var replacementword="REPLACE";
	while (done != true){
        oldword = gTagNames[i];
        if (oldword.indexOf(word) == 0) {
            // replace word
			replacementword=oldword;
           // alert(oldword + " " + word);
		   match = i;
		   
        }
		i = i + 1
		if ((match > -1) || (i == gTagNames.length)){
			done=true;
		}
        
    }
    
    // if no match, then delete the suggestion
    if (match == -1) {
        //replacementword= tagcont + c;
		suggestbox.value="";
    }
	else { // got a match
		suggestbox.value = replacementword;
	}
	

	
    return;
}

function getWordFromCursor(s,cursorpos){
	// given a string and an offset into it, return the word and
	// pointers to begin and end of the word
	// returned as an object
	var word="";
	var delimiters=" ;:'.,[{]}()&%$#@!\"\'\n";
	var p1,p2; // word start and end
	p1=0;
	// get beginning
	var i=cursorpos;
	var c="";
	var done = false;
	while (done == false) {
		if (i >= 0) { // go until i is less than zero
			c = s.charAt(i); // get the char
			if ((c!="") && (delimiters.indexOf(c) > -1)) { // if it's a delimiter
			  done=true;
			  p1=i;
			}
			else {
				word= c + word;
				i = i - 1;
				if (i < 0){
					done = true;
					p1 = i + 1;
				}
			}
		}	
	}
	
	// get end
	var i=cursorpos;
	var c="";
	var done = false;
	while (done == false) {
		if (i < s.length - 1) { // go until i is less than zero
			c = s.charAt(i); // get the char
			if (delimiters.indexOf(c) > -1) { // if it's a delimiter
			  done=true;
			  p2=i;
			}
			else {
				word= word + c;
				i = i + 1;
				if (i > s.length - 1){
					done = true;
					p2 = i - 1;
				}
			}
		}	
		else {
			done = true;
			p2 = i;
		}
	}
	
	return  {word : word, p1 : p1, p2 : p2}; // return object
		
}

function removeReturns(){
	var el=document.getElementById('ed');
	var ss="";
	var somethingselected=true;
	getSelectedText();
	if (seltext != ""){
		somethingselected=true;
	}
	else {somethingselected=false;}
	// if text is selected
	if (somethingselected == true){
		ss=seltext;
		//alert(ss);
	}
	// if nothing selected, then the text is all of it
	else {
		ss = el.value;
	}
	var s = RegExp("\n", "g");
    ss = ss.replace(s, " ");
	
	// replace selection
	if (somethingselected == true){
		var a=el.value.substr(0,selstart);
		var b=el.value.substr(selstart + seltext.length, el.value.length);
		//alert(a + ' :: ' + b);
		el.value= a + ss + b;
	
	}
	else { // replace it all
	 	el.value = ss;
	}
	
}

function postIt(){
	
	updatehtml();
	
	// make array, first three elements of which are title, content, and tagstring. 
	// all further elements are categories
	
	// get the title
	var titlecont = document.getElementById('posttitle').value;
	var tit = titlecont; // escapeIt(titlecont);
	// get the post content
    var contcont = document.getElementById('updatebox').innerHTML;
	var cont = contcont; //escapeIt(contcont); // escape it
	//cont = encodeURIComponent(cont);
	// add tags
	if (document.getElementById("includetagscheck").checked == true) {
		if ((document.getElementById("tagstextarea") != null) && (document.getElementById("tagstextarea").value != "")) {
				var tags = createTagString();
		}
	}
	
    // get tagstring, complete with commas
	var tags=$("#tagstringbox").val();
	if (tags == "Separate tags with commas"){tags="";}

	
	// create array of categories
	var checks = $("#categories").find("input"); // get all checkboxes in that form

	var cats = new Array();
	var catstring = "";
	for (var i=0; i < checks.length; i++){
		if ($(checks[i]).is(':checked')){
			cats.push( $(checks[i]).val() );
			catstring = catstring + " " + $(checks[i]).val();
		}
	}
	
	// post live or as draft"?
	var postmode = $("input[name=postmode]:checked").val();
	 $("#loading").show();
	
	$.ajax({
            type: "POST",
            //url: "remote_post.php",
            url: "php/postViaXmlrcp.php",
            dataType: JSON,
            data: {title: tit, body : cont, tags: tags, categoryArray : cats, postmode : postmode},
            success: function(expresult){
            	 $("#loading").hide();
                notify(titlecont + " posted.");
            },
            error: function(e){
            	if (e.responseText.indexOf("Successfully") > -1){
            		 $("#loading").hide();
            		notify("Success! Let the regrets begin!")
            		//alert("Success! Post has been posted!\nLet the regrets begin!");
            		$("#transoverlay").fadeOut(300);
            	}
            	else{
                	alert('Error posting blog via xmlrpc: ' +  e.responseText);
                }
            }
        })
        
        writetags(); // save the tags

}

//------- GOOGLE SEARCH
function searchGoogle(){
  
         
        // get search term from selection
        getSelectedText(); // puts it into a global
        var searchterm = seltext;
        if (searchterm == ""){
        	notify("Google search: No term selected", "ERROR");
        	$('#googlediv').fadeOut(300);
        	return;
        }
        
        $("#googlediv").fadeToggle(300); // show the div
         if ($("#googlediv").is(":visible") === false){ // if we just hid it, then exit
         	return;
         }
        
        if (searchterm !== ""){
       // searchterm=encodeURI('"' + searchterm + '"');
       var encodedsearchterm=encodeURI(searchterm);
        var res;
        $.ajax({
            type: "POST",
            url: "./php/googleSearch.php",
            data: {searchterm: searchterm},
            async: false,
            success: function(expresult){
                res = expresult;
                //alert(expresult);
            },
            error: function(e){
                alert("error in google search: " + e);
            }//
        })
		// error in results
        if ((res===null) || (res===undefined)){
        	alert("Error searching for " + searchterm);
        }
        // we have results
        else {
        	// empty existing
        	$("#resultsdiv").html("");
        	// add close button
        	div = document.createElement("div");
        	div.setAttribute("onclick","$('#googlediv').fadeToggle(300)");
        	div.setAttribute("class","tool googlewikiclose");
        	$(div).text("Close");
        	$("#resultsdiv").append(div);
        	// display search term
        	$("#searchterms").html("<h4>Search: " + searchterm + "</h4>");
        	// loop through results
        	var jres = JSON.parse(res);
        	var response = jres["responseData"];
        	var results = response["results"];
        	for (var i=0; i < results.length; i++){
        		var title = results[i]["title"];
        		var url = results[i]["url"];
        		var desc = results[i]["content"];
        		// build entry
        		var div = document.createElement("div");
        		var span = document.createElement("span");
        		span.setAttribute("class","indexhead");
        		span.innerHTML=title;
        		div.appendChild(span);
        		var p = document.createElement("p");
        		p.setAttribute("class","searchdesc");
        		p.innerHTML = desc;
        		span = document.createElement("span");
        		span.setAttribute("class","searchlink");
        		span.innerHTML=" [<a href='" + url + "' target='new_page'>link</a>]";
        		p.appendChild(span);
        		span = document.createElement("span");
        		span.setAttribute("class","searchcopy");
        		span.setAttribute("onclick","insertGoogleLink('" + url + "')");
        		span.innerHTML= " INSERT ";
        		p.appendChild(span);
        		div.appendChild(p);
        		$("#resultsdiv").append(div);
        	}
        	
         }
        } // if search term
      
 
  return;
}


function insertGoogleLink(u){
   
   $("#linkarea").val(u);
   createLinkDW();
   $("#googlediv").hide(250);
   $("#wikipediadiv").hide(250);
}

function escapeIt(s){
	// uses js escape  but cleans up uncaught terms
	var news = s;
	//news = escape(s);
	// get rid of +
	news = encodeURIComponent(s);
	return news;
}

function createTable(){
    var cols = parseInt(document.getElementById('tablecolsid').value);
    var rows = parseInt(document.getElementById('tablerowsid').value);
    // border
    var border;
    if (document.getElementById('tablebordercheck').checked == true) {
        border = ' border=1';
    }
    else {
        border = '';
    }
    
    // width
    var w = " width=";
    var ws = (document.getElementById('tablewidthid').value);
    if (ws == "") {
        w = w + "80%";
    }
    else {
        w = w + ws + "%";
    }
    // bg color
    var bgcolor = (document.getElementById('tablecolorfield').value);
    if (bgcolor != "") {
        bgcolor = " bgcolor=" + bgcolor;
    }
    else 
        bgcolor = "";
    
    // contruct table string
    var tablestr = "\n\n<table align=center" + w + border + bgcolor + ">"
    var i = 0;
    var j = 0;
    for (i = 0; i < rows; i++) {
        tablestr = tablestr + "\n" + "<tr>\n"
        for (j = 0; j < cols; j++) {
            tablestr = tablestr + "\t<td valign=top><p>\n\t</p></td>\n";
        }
        tablestr = tablestr + "</tr>"
    }
    tablestr = tablestr + "</table>";
    
    // insert it
    getSelectedText();
    inserttextatcursor(tablestr);
    return
}



function updatehtml(){
    var h = document.getElementById('updatebox');
    var e = document.getElementById('ed');
    h.innerHTML = e.value;
}

function toolselect(which){

    // load the globals
    getSelectedText();
    var slen1, slen2; // length of opening and closing markup, for cursor positioning
    var ed = document.getElementById('ed');
    if (which == 'boldme') {
        wrapSelection('<b>', '</b>');
        slen1 = 4;
        slen2 = 4;
    }
    if (which == 'italme') {
        wrapSelection('<em>', '</em>');
        slen1 = 4;
        slen2 = 5;
    }
    if (which == 'indentme') {
        wrapSelection('\n<blockquote><p>', '</blockquote>');
        slen1 = 16;
        ;
        slen2 = 12;
		removeBlankPs(); // remove that annoying P linefeed
    }
    if (which == 'linkme') {
        linkIt();
        slen1 = 0;
        slen2 = 0;
        return // don't set insertion point below because ruins the selection the inserthelink needs
    }
    if (which == 'lineme') {
        wrapSelection('<p><br></p><hr width="100px"><p>', '');
        slen1 = 28;
        slen2 = 0;
    }
    if (which == 'pme') {
        insertText("\n\n<P>", selstart);
        slen1 = 7;
        slen2 = 0;
    }
    if (which == 'brme') {
        insertText("<br>", selstart);
        slen1 = 4;
        slen2 = 0;
    }
    if (which == 'underme') {
        wrapSelection("<u>", "</u>");
        slen1 = 3;
        slen2 = 4;
    }
    if (which == 'saveme') {
        saveFile();
    }
    // set caret position
    if (seltext.length == 0) { // if nothing selected, keep it within
       // enit od.focus();
        setCaretPosition(selstart + slen1);
    
    }
    else { // if  selected word, move cursor outside of markup
        setCaretPosition(selend + slen1 + slen2 + 1);
        ed.focus();
    }
    
    return null;
    
}

function setCaretPosition(where){

    var elt = document.getElementById("ed");
    elt.focus();
    elt.setSelectionRange(where, where);
   }

function getSelectedText(){
    // puts them into globals
    var el = document.getElementById('ed');
    selend = el.selectionEnd;
    selstart = el.selectionStart;
    seltext = el.value.substring(selstart, selend);
}

function insertText(txt, where,insertpoint){
    var el = document.getElementById('ed');
    var oldtxt = el.value;
    var p1 = oldtxt.substring(0, selstart);
    var p2 = oldtxt.substring(selstart);
    var newtxt = p1 + txt + p2;
    el.value = newtxt;
    if (insertpoint == null){
    	insertpoint = txt.length;
    }
    
     el.selectionEnd = el.SelectionStart;
    el.selectionStart = selstart + insertpoint;
    setCaretPosition(selstart + insertpoint);
   
    
}


function wrapSelection(s1, s2){
    // wraps selected text with the two strings
    var el = document.getElementById('ed');
    var s = el.value;
    // split it at start and end of selection
    var p1 = s.substring(0, selstart);
    var p2 = s.substring(selend);
    var news = p1 + s1 + seltext + s2 + p2;
    el.value = news;
    return
}


function getPriorWord(){
    // get word going backwards
    // gets the plaintext
    var txt = document.getElementById('ed').value;
    getSelectedText(); // caret=selstart
    var p = txt.lastIndexOf(" ", selstart - 1);
    if (p == -1) {
        p = 0;
    }
    var prevword = txt.substring(p, selstart);
    return prevword
      
}

function trimMarkUp(s){
	// trim markup
	var p = s.indexOf(">");
	if ( p > -1 ) {
		s = s.substring(p+1, s.length);
	}
	// get the next markup after the string
	if (p == -1) {p = 0;}
	p = s.indexOf("<");
	if ( p > -1 ) {
		s = s.substring(0, p);
	}
	return s;
}

function replaceWithAutolink(w){
    w = trimSpacesAndLfs(w); 
    // is this word a link favorite? If so, returns index
    var m = lookforfavorites(w);
	
    if (m == -1) {
        return false
    }
    var rep = document.getElementById('insertme');
    rep.setAttribute("filename", favoritelinks[m]);
    rep.setAttribute("anchorword", w);
    rep.style.display = "block";
    rep.innerHTML = "<p bgcolor=#FF000>Click to link <u>" + w + "</u> to <u>" + favoritelinks[m] + "</u>.</P>";
    
    
    // we;ve got a match

}


function notify(s, status){
	//var rep = document.getElementById('insertme');
	
	if (status == "ERROR"){
		var delaytime = 3000;
		$("#insertme").css({"background-color" :   "red"});
	}
	else {
		var delaytime = "1500";
		$("#insertme").css({"background-color" : "rgba(128,0,128,0.9)"});
	}
   $("#insertme").html(s);
     $("#insertme").show("slide", { direction: "right" }, 1000, function(){
     	$(this).delay(delaytime);
     	$(this).hide("slide",{direction: "right"},500);
     });
}

function insertautolink_UNUSED(){
    // parse insertme for match number
    var im = document.getElementById('insertme');
    //var imv=im.value;
    var fname = im.attributes.filename.nodeValue;
    var w = im.attributes.anchorword.nodeValue;
    var el = document.getElementById('ed');
    var v = el.value;
    getSelectedText(); // load the globals
    v = v.substring(0, (selstart - w.length) - 1) + "<a href='" + fname + "'>" + w + "</a>" + v.substring(selstart);
    el.value = v;
    //}
    // hide the button
    document.getElementById('insertme').style.display = "none";
    
}

// ----------- ADD EXPANSION TO FILE
function addMacroExpand(){
	var target = document.getElementById("macroexpandwordtxt").value;
	var replacement = document.getElementById("macroexpandreplacetxt").value;
	// error check
	if ((target=="") || (replacement=="")){
		alert("Must have word + replacement");
		return
	}
	
	// add it to the array
	g_expansions.push(target);
	expansions_replacements.push(replacement);
	var ss="Failed to write " + s;
	// if checkbox is checked, save to file
	if (document.getElementById("macroexpandcheckbox").checked) {
		var s = "\n" + target + "|" + replacement;
		$.post('append_expansion.php', {
			newline: s,
			async: false,
			success: ss="Success writing new macro expansion",
			error: function(){
				alert('Error writing link file');
			}
		})
	alert(ss);
	}
	    
    return;
}

// ----------- LOAD SAVE FILE
function loadSaveFile(){
	//alert('in loadsavefile');
    var saveddata="UNTOUCHED";
	
      $.ajax({
            type: "POST",
            url: "./php/readtempfile.php",
            async: false,
            success: function(expresult){
                saveddata = expresult;
                //alert("expansionslist in jquery ajax= " + expansionslist);
            },
            error: function(){
                //alert('Error reading blogdraft_expansions.txt');
            }
        })
	
	
	if ((saveddata=="FAIL") || (saveddata == "")) {
		alert("Read of " + tempSaveFile + " failed.");
		return
	}
	
    
 
    // confirm the load
	var snippet="";
	if (saveddata.length > 99) {
		 snippet = snippet + saveddata.substring(0, 99) + "...";
	}
	else {snippet = saveddata;}
	snippet = "Load autosaved file? \r\n\r\n" + snippet;
	//alert(snippet);
    var resp = window.confirm("REPLACE EXISTING TEXT with saved file:\n\n" + snippet);
    // do the load
    if (resp == true) {
		// replace slashes
       var s1 =new RegExp("\\\\", "g");
       saveddata = saveddata.replace(s1, "");
        // strip title= from title

        var p = saveddata.indexOf("BODY:");
        var title = saveddata.substring(7, p - 1);
        var titlefield = document.getElementById("posttitle");
        titlefield.value = title;
        var bodyarea = document.getElementById("ed");
        // get body mnus body=
        var body = saveddata.substring(p + 6,saveddata.length);
		var tags = body.substring(body.indexOf("TAGS:")+5,body.length);
		// strip tags
		body = body.substr(0, body.indexOf("TAGS:"));
        bodyarea.value = body;
        var tagsel = document.getElementById("tagstextarea");
		tagsel.value = tags;   
        
    }
    
}

//------------AUTO SAVE IT
function AutoSaveFile(){
    // invoke writesavefile.php to save the file
    // assumes folder of blogdraft_copies
    var s;
    var posttit = document.getElementById('posttitle').value;
    s = document.getElementById("ed").value;
    
    $.post('writesavefile.php', {
        savedbody: s,
        savedtitle: "blogdraft_temp_save.txt",
        internaltit: posttit,
        tags: document.getElementById("tagstextarea").value,
        async: false,
        success: function(data){
            alert('Success writing save file!');
			if (data.indexOf("Cannot open save file") ==0) {
				notify("<p class='notice'> Unable to auto save file</p>");
        }},
        error: function(data){
           //alert('Error writing save file');
		
			}
    })    
}

// ------------------- SAVE IT
function saveFile(quiet){
    var legittitle = getLegitTitle();
    if (legittitle == -1){
    	notify("Save cancelled.");
    	return
    }
    legittitle = legittitle + ".txt";
    var posttit = document.getElementById('posttitle').value;
    var wysival = document.getElementById('ed').value;
    var tags = document.getElementById("tagstextarea").value
    var s = "TITLE=" + posttit + "\n\r" + "BODY=" + wysival;
    
    
     $.ajax({
        type: "POST",
        url: "./php/writesavefile.php",
        async: false,
        dataType: JSON,
        data: {"savedbody" : wysival, "savedtitle" : legittitle, "internaltit" : posttit , "tags" : tags},
        success: function(dirresult){
           if (quiet != "QUIET") {
				notify(legittitle + " saved.");
				keystrokectr = 0 ;
				$("#keystrokecounter").innerHTML = "SAVED";
			}
        },
        error: function(e){
        	if (e.statusText !== "OK"){
           	 notify('Error reading blogdraft_expansions.txt: ' + e.statusText, "ERROR");
           	 }
           	 else{
           	 	notify(legittitle + " saved.", "OK");
           	 }
        }
    })
    
    
}

// ------------------- SAVE DRAFT
function saveDraft(){
    var legittitle = "DRAFT@@" + getLegitTitle() + ".txt";
    var posttit = document.getElementById('posttitle').value;
    var wysival = document.getElementById('ed').value;
    var s1 = RegExp("&", "g");
    wysival = wysival.replace(s1, " AND ");
    var tags = document.getElementById("tagstextarea").value
    var s = "TITLE=" + posttit + "\n\r" + "BODY=" + wysival;
    
      
     $.ajax({
        type: "POST",
        url: "./php/writedraftfile.php",
        async: false,
        dataType: JSON,
        data: {"savedbody" : wysival , "savedtitle" : legittitle , "internaltit" : posttit ,"tags" : tags},
        success: function(dirresult){
           if (quiet != "QUIET") {
				notify( legittitle + " saved.", "OK");
			}
        },
        error: function(e){
        	if (e.statusText !== "OK"){
           	 notify('Error reading writedraftfile.php: ' + e.statusText, "ERROR");
           	 }
           	 else{
           	 	notify( legittitle + " saved.", "OK");
           	 }
        }
    })
    

    
}

function getLegitTitle(){
    // get a legit file tile from the blog title
    var title = document.getElementById('posttitle').value;
    if (title == "") {
        title = prompt("Enter a title");
        if (title == null){ // prompt was cancelled
        	return -1;
        }
        if (title !== "") {
            document.getElementById("posttitle").value = title;
        }
        else {
        	notify("Title required.","ERROR");
        	getLegitTitle();
        }
        
    }
    
    var s1, s2, c, p, forbiddenchar;
    var mydate = new Date();
    var datestr = (mydate.getMonth() + 1) + "-";
    datestr = datestr + mydate.getDate() + "-";
    datestr = datestr + (mydate.getYear() + 1900);
    title = title + ":" + datestr;
    var forbidden = "!%#$&*{};:></\\," + quote1 + quote2;
    for (i = 0; i < title.length; i++) {
        c = title.substring(i, i + 1);
        p = forbidden.indexOf(c);
        // hande ? as exception
        if (c == "?") {
            title = title.substring(1, i - 1) + "_Q" + title.substring(i + 1);
            p = -1;
        }
        // if not ?, use regexp to replace
        if (p > -1) {
            // this character in the title is one of the no-no's
            forbiddenchar = forbidden.substring(p, p + 1);
            s1 = RegExp(forbiddenchar, "g");
            title = title.replace(s1, "_");
        }
    }

    return title;
    
}

// ------- READ DRAFT DIR
function readDraftDir(){
	
	var resp;
	
 
     $.ajax({
        type: "POST",
        url: "./php/readdraftdir.php",
        async: false,
        success: function(dirresult){
           	alert("dir: " & dirresult);
        },
        error: function(){
            //alert('Error reading blogdraft_expansions.txt');
        }
    })
    

	
}


function insertimage(){
    getSelectedText(); // set globals
    var ipath = document.getElementById('imagepath');
    var newwidth = $('#widthchange').val();
    var newheight = $('#heightchange').val();
    var ialt = document.getElementById('alttext').value;
	var icaption = document.getElementById('captiontxt').value;
	var ilink = document.getElementById("imagelinktotxt").value;
	
	// build line to insert
    var s = "<img src='" + ipath.value + "'";
    if (ialt != "") {
        s = s + " alt='" + ialt + "'";
    }
	
    if  (newwidth != '') {
        s = s + " width=" + newwidth;
    }
    if (newheight != "") {
        s = s + " height=" + newheight;
    }
    
    s = s + ">";
	// caption?
	if (icaption != ""){
		s = s + "<br><span class='caption'>" + icaption + "</span>"
	}
	// link?
	// caption?
	if (ilink != ""){
		s =  "<a href='" + ilink + "'>" + s +  "</a>";
	}	
	// Centered?
   // if (document.getElementById('centerimage').checked) {
        s = "<div align=center>" + s + "</div>"
   // }
   
   // get image name from iframe
  // var iframe = $('#imageuploaderiframe'); // or some other selector to get the iframe
	//var ifr =  iframe.contents();
	
    insertText(s, selstart, selstart);
    
    // close it
    closeOverlay();
    //setCaretPosition(selstart);
    
}

function copyImageLink(){
	// copy link to server to wrapper link
	document.getElementById("imagelinktotxt").value = document.getElementById("imagepath").value
}

function adjustImgSize(sz){
    // sz= width or height. Tells us which is being preserved
    var origw = document.getElementById('imagewidth').value;
    var origh = document.getElementById('imageheight').value;
    if (sz == "width") {
        var neww = document.getElementById('widthchange').value;
        var newh = parseInt((neww / origw) * origh);
    }
    if (sz == "height") {
        var newh = document.getElementById('heightchange').value;
        var neww = parseInt((newh / origh) * origw);
    }
    document.getElementById('imagewidth').value = neww + "";
    document.getElementById('imageheight').value = newh + "";
}

function insertSymbol(con){
    // get the content and insert it
    var sym = "&" + con + ";"
    inserttextatcursor(sym);
}

function insertCallout(){
	
	// get caret
	getSelectedText();
	var thetext = seltext;
	if (thetext == null){
		thetext= " ";
	}
	if (calloutSide == "RIGHT"){ // set in prefs
		var  whichclass = "calloutright";
	}
	else {
		var whichclass = "calloutleft";
	}
	 var callout = "<span class='" + whichclass + "'>&ldquo;" + thetext + "&rdquo;</span>"
	var insertpt = 22 + whichclass.length;
	insertText(callout, selstart,insertpt);
}

function alternateCallouts(){
	// first right, then left
	var alltext = $("#ed").val();
	var p1 = 0;
	var p2 = 0;
	var s1,s1;
	var change = false;
	if (calloutSide == "RIGHT"){ // set in prefs
		var  whichclass = "calloutright";
	}
	else {
		var whichclass = "calloutleft";
	}
	while (p2 > -1){
		p2 = alltext.indexOf("class='calloutright",p1);
		if ((p2 > -1) && (change)){ // time to change this one
			s1 = p2 + 14;
			s2 = p2 + 19;
			alltext = alltext.substring(0,s1) + "left" + alltext.substring(s2);
			change = false;	
		}
		else {change = true;}
		p1=p2+ 15;
		if (p1 > alltext.length){
			p2 = -1;
		}
		
	}
	$("#ed").val(alltext);

}
// ---------- PREP FOR WRITING TAGS & SEND WRITETAG COMMAND
function prepTags(){
    
     // get tagstring, complete with commas
	var tags=$("#tagstringbox").val();
	if (tags == "Separate tags with commas"){tags="";}
	//tags = "newt2,copyright"; // DEBUG
	var newtags = tags.split(",");
	
    var i,j;
    var arraylen = gTagNames.length;
    var p, used, oldtag,  ctr, newtag, foundDupe, times;
    // go through existing tags, incrementing dupes
    for (var i=0; i < newtags.length; i++){
    	newtag = newtags[i];
    	newtag = trimSpacesAndLfs(newtag);
    	foundDupe = false;
    	j = 0;
    	while ((foundDupe == false) && (j < gTagNames.length)){
			oldtag = gTagNames[j];
			if (newtag.toUpperCase() == oldtag.toUpperCase() ){
				times = parseInt(gTagTimes[j]) + 1;
				gTagTimes[j] = times;
				foundDupe = true;
			}
			else { 
				j++; 
			}
		} // while
			if (foundDupe == false){
				gTagNames.push(newtag);
				gTagTimes.push("1");
			}
	}
  
    return
}


// -------- WRITE TAGS
function writetags(){
    
     prepTags();
    
    $.ajax({
        type: "POST",
        url: "./php/writetag.php",
        dataType: JSON,
        data: {tags: gTagNames, times: gTagTimes}, 
        async: false,
        success: function(expresult){
            faveslist = expresult;
            //alert("expansionslist in jquery ajax= " + expansionslist);
        },
        error: function(e){
        	if (e.statusText !== "OK"){
            alert('Error writing to blogdraft_tags.txt: ' + e);
            }
        }
    });
    
   
}

function getHtmlText(){
    // gets html text from wysi editing box
    var getDocument = document.getElementById("wysiwyg" + 'wysi').contentWindow.document;
    return getDocument.body.innerHTML;
}

function postbookmarklet2(bodytxt, tit){// original boomarklet:
    //javascript:if(navigator.userAgent.indexOf('Safari') >= 0){Q=getSelection();}else{Q=document.selection?document.selection.createRange().text:document.getSelection();}location.href='http://www.everythingismiscellaneous.com/wp-admin/post-new.php?text='+encodeURIComponent(Q)+'&popupurl='+encodeURIComponent(location.href)+'&popuptitle='+encodeURIComponent(document.title);
    //Q=document.selection?document.selection.createRange().text:document.getSelection();
    
    var postwin = window.open('http://www.hyperorg.com/blogger/wp-admin/post-new.php?content=' + bodytxt + '&post_title=' + tit);
    //var ii=postwin.document.getElementById('title');
    //alert(ii);

}

// ------- READ FAVORITE LINKS
function readFavoriteLinks(){
    updateStatus('Reading favorite links')
    
    $.ajax({
        type: "POST",
        url: "./php/readfavorites.php",
        async: false,
        success: function(expresult){
            faveslist = expresult;
            //alert("expansionslist in jquery ajax= " + expansionslist);
        },
        error: function(){
            //alert('Error reading blogdraft_expansions.txt');
        }
    })
    
    //alert("faveslist="+faveslist);
    // create array
    var favestemp = new Array();
    if (faveslist) {
        favestemp = faveslist.split("\n");
    }
    
    // create two synced arrays of favorites, and two for autolinks (if there's a |AUTO
    var i;
	var sarray = new Array(); // divides at |, holds anchor, url, and whether it's autolink
    for (i = 0; i < favestemp.length; i++) {
		sarray = favestemp[i].split("|");
       if (sarray.length > 0) {
			favoriteanchors.push(sarray[0]);
			favoritelinks.push(sarray[1]);
			if (sarray[2] == "AUTO") {
				autolinkanchors.push(sarray[0]);
				autolinks.push(sarray[1]);
			}
		}
    }
    updateStatus('Loaded ' + favoriteanchors.length + ' favorites.')
}

//------- READ TWITTER LINKS
function readTwitterLinks(){
	    $.ajax({
        type: "POST",
        url: "./php/readtwitterlinks.php",
        async: false,
        success: function(expresult){
            faveslist = expresult;
            //alert("expansionslist in jquery ajax= " + expansionslist);
        },
        error: function(){
            //alert('Error reading blogdraft_expansions.txt');
        }
    })
    
    //alert("faveslist="+faveslist);
    // create array
    var tweetstemp = new Array();
    if (faveslist) {
        tweetstemp = faveslist.split("\n");
    }
	
	  // create two synced arrays of favorites, and two for autolinks (if there's a |AUTO
    var i;
	var sarray = new Array(); // divides at |
    for (i = 0; i < tweetstemp.length; i++) {
		sarray = tweetstemp[i].split("|");
		if (sarray.length > 0) {
			tweeters_anchors.push(sarray[0]);
			tweeters_tweetnames.push(sarray[1]);
		}
    }
    updateStatus('Loaded ' + tweeters_anchors.length + ' twitters.')
	
}

// ------ READ TAGS
function readTags(){
	// skip if we're not doing tags
   if (document.getElementById("includetagscheck").checked != true){
   	 return;
   } 
    updateStatus('Reading tags');
       
    $.ajax({
        type: "POST",
        url: "./php/readtags.php",
        async: false,
        success: function(expresult){
            parseTags(expresult); 
           
        },
        error: function(e){
            alert('Error reading blogdraft_expansions.txt:' + e);
        }
    })

    // entry = tag|10, where 10= number of times used
    //alert(gTagNames[0] + " : " + gTagNames[1]);
    buildTagCloud();
  
	updateStatus('Loaded ' + gTagNames.length + ' tags.');	
    return
    
}

function parseTags(rawstr){
    // create array
    var unparsedTags = new Array();
    unparsedTags = rawstr.split("\n");
    //alert("uprased tags="+  unparsedTags[1]);
    // trim them
    for (var x = 0; x < unparsedTags.length; x++) {
        trimSpacesAndLfs(unparsedTags[x]);
    }
    //alert(gTagNames[1]);
    unparsedTags.sort(insensitivesort);
    // strip out blanks
    for (i = 0; i < unparsedTags.length; i++) {
        if (unparsedTags[i] == "") {
            unparsedTags.splice(i, 1);
        }
    }
    
    // split string into two arrays (tag|number)
    var i, p, used, tanchor;
    //initialize the arrays
    gTagTimes.length = 0;
    gTagNames.length = 0;
   // HistoricTagAnchors.length = 0;
    var strused; // string ver of used variable'
    // populate the arrays
    for (i = 0; i < unparsedTags.length; i++) {
        p = unparsedTags[i].indexOf("|");
        strused = unparsedTags[i].substring(p + 1, unparsedTags[i].length);
        used = parseInt(strused); // convert to integer
        gTagTimes.push(used);
        gTagNames.push(unparsedTags[i].substr(0,p));
    }
}

function insensitivesort(a, b){
    var anew = a.toLowerCase();
    var bnew = b.toLowerCase();
    if (anew < bnew) 
        return -1;
    if (anew > bnew) 
        return 1;
    return 0;
}

function redrawTagCloud(whichdirection){
    // if param is 1, then increase it. if -1, decrease
    
    
    tagThreshhold = tagThreshhold + whichdirection;
    if (tagThreshhold < 1) {
        tagThreshhold = 1;
    }
    buildTagCloud();
    
}


function buildTagCloud(){
    // tags are in gTagNames and gTagTimes
    // sort alphabetically
    // tagThreshhold =how many times a tag is used to show up
    
    // get the largest and the smallest
    var largest = -1;
    var smallest = 100000;
    var i = 0;
    var used = -1;
    for (i = 0; i < gTagTimes.length; i++) {
        used = gTagTimes[i];
		// skip "-berkman" because the others are too small
        if (used > largest){
            largest = used
        };
        if (used < smallest) {
            smallest = used
        };
            }
    // calculate font size

    var fontsize = 0;
	//largest and smallest are set in global prefs
    var fontspread = largestfont - smallestfont; // range of uses to cover
    var p;
    var fontsizetxt = "";
    var tmp = "";
    var tagfonts = new Array(); // array for font sizes
    for (i = 0; i < gTagTimes.length; i++) {
        used = gTagTimes[i];
		// calculate what percentage of the fontspread it should take, and add minimum font size
        fontsize = ((used / largest) * (fontspread)) + smallestfont;
        //fontsize = (Math.log(used)*2) + smallestfont;
		fontsize = Math.round(fontsize);
        // encode fontsize in array
        fontsizetxt = fontsize + ""; // "" turns it into a string
        tagfonts.push(fontsizetxt);
    }
    // pick the to ones to show
    
    
    // display tagcloud
    var s = "";
    var tagsize = -1;
    var tagname = "";
    var tagused = -1;
    var tagtemp = "";
    for (i = 0; i < gTagNames.length; i++) {
        if (gTagTimes[i] >= tagThreshhold) {
            s = s + "<font color='white'>| </font>" + "<span id='" + gTagTimes[i] + "' class='tagcloudstyle' title='Times used: " + gTagTimes[i] + "' onclick='tagclick(" + quote2 + gTagNames[i] + quote2 + ")'><font style='font-size:" + tagfonts[i] + "pt'>" + gTagNames[i] + " </font></span> ";

        }

    }
    var tcdiv = document.getElementById('tagclouddiv');
    
    //alert(s);
    tcdiv.innerHTML = "<p class='tagcloudtext'> " + s + "</p>";
}

function tagclick(tn){
    // inserts tn into tag textarea
    //alert("not written yet");
    tta = document.getElementById('tagstringbox');
    //alert(tta.value);
    if (tta.value != "") {
        tta.value = tta.value + ", ";
    }
    tta.value = tta.value + tn;
    // turn the tag red
    var tagel = document.getElementById(tn);
    tagel.style.color = "RED";
}

function cleartags(){
    document.getElementById("tagstextarea").value = "";
    gTagNames.length = 0;
}

function isADupe(whicharray, whichdatum){
    // checks array A for which as a dupe
	if (whichdatum == "") { // if it's empty it's not a dupe
		return -1;
	}
    var i = -1;
    var dupe = -1;
    var donee = false;
    var tag;
    while (donee === false) {
        i = i + 1;
        if (i < whicharray.length) {
            // get the tag from the array
            tag = whicharray[i];
            var utag = tag.toUpperCase();
            var uwhich = (whichdatum + "").toUpperCase();
            if (utag == uwhich) {
                donee = true;
                dupe = i;
            }
        }
        else 
            donee = true;
    }
    return dupe;
}

function arrHasDupes(A){ // finds any duplicate array elements using the fewest possible comparison
    var i, j, n;
    n = A.length;
    // to ensure the fewest possible comparisons
    for (i = 0; i < n; i++) { // outer loop uses each item i at 0 through n
        for (j = i + 1; j < n; j++) { // inner loop only compares items j at i+1 to n
            if (A[i] == A[j]) 
                return true;
        }
    }
    return false;
}
function importSavedFile(f){
	// reads saved file
	
	if (f=="") {
		alert("Need a file name.");
		return
	}
	
	// add path
	f = "blogdraft_copies/" +f;	
	var contents = "";
	
	   $.ajax({
        type: "POST",
        url: f,
        async: false,
        success: function(listresult){
            contents = listresult;
        },
        error: function(){
            alert('Error reading ' + f + " in importSavedFile.");
        }
    })
	
	//remove backslashes
	var s1 = RegExp("\\\\", "g");
    contents = contents.replace(s1, "");
	
	// put the content into text area
	var ed = document.getElementById("ed");
	ed.value = contents;
}
function readLinks(){

    var linkslist = "";
    $.ajax({
        type: "POST",
        url: "data/blogdraft_links.txt",
        async: false,
        success: function(listresult){
            linkslist = listresult;
            var n = linkslist.match(/^(.*)$/mg).length;
             updateStatus('Read ' + n + ' links.');
        },
        error: function(){
            alert('Error reading blogdraft_links.txt');
        }
    })

    
    // turn linksslist into a temporary array
    var linktemparray = new Array();
    linktemparray = linkslist.split("\n");
    
    var i, s, p1, p2, p3;
    ctr = 0;
    // Parse the line and populate the real arrays
    for (i = 0; i < linktemparray.length; i++) {
        p1 = linktemparray[i].indexOf("|"); // get url
        s = linktemparray[i].substr(0, p1);
        linkurls.push(s);
        p2 = linktemparray[i].indexOf("|", p1 + 1);
        p3 = linktemparray[i].indexOf("|", p2 + 1);
        s = linktemparray[i].substring(p1 + 1, p2); // get date
        linkdates.push(s);
        s = linktemparray[i].substring(p2 + 1, p3); // get title
        linktitles.push(s);
        s = linktemparray[i].substring(p3 + 1, linktemparray[i].length); // get anchor
        linkanchors.push(s);
        ctr = i;
    }
    
    
    
    debugon = false;
    if (debugon == true) {
        var s = "<p>number of entries=" + linkurls.length + "</p><p class='linktext'>";
        for (var x = 0; x < linkurls.length; x++) {
            s = s + x + ") url=" + linkurls[x] + " | date:" + linkdates[x] + " | title:" + linktitles[x] + " | anchor: " + linkanchors[x] + "<br>";
        }
        
        // display it
        var tarea = document.getElementById('testarea');
        tarea.innerHTML = s + "</p>";
    }
    
}


function createLinkDW(){
    // create the link
    // get the text of the textarea
	getSelectedText();
    var hyper = document.getElementById('linkarea').value;
    
    // IS there a favorite?
    var chkvalue, favoritetext;
    // check for checkbox and for text in place
    chkvalue = document.getElementById('favoriteanchorcheck').checked; // $("#favoriteanchorcheck").attr("checked");
    favoritetext = document.getElementById("favoriteanchortext").value // $("#favoriteanchortext").attr("value");
    getSelectedText(); // load the globals
    var seltextt = seltext;
    
    // Is there a favorite?
    if (chkvalue == true && favoritetext != "") {
        // check for duplicate in array
        
        var dupe = isADupe(favoriteanchors, seltextt);
		// is the autolink feature on? Autolink auto creates the link after you finish typing the word
		// don't take words with spaces
		if ((document.getElementById("favoriteanchorautocompcheck").checked) && (favoritetext.indexOf(" ") == -1)){
			var autolinkit = true;
		}
		else {		
				var autolinkit = false;
		}
		
        if (dupe == -1) { // not a dupe
            //display Favorites Box
            var fl = document.getElementById("favoritelinkdiv");
            fl.style.display = "block";
            favoriteanchors.push(favoritetext); // push anchor onto global array of favorites
            favoritelinks.push(hyper);          // push link onto global array of urls
			// build the line for the file
			var lin = "\n" + favoritetext + "|" + hyper +  "|";
			if (autolinkit) { 
				lin = lin + "AUTO";
				autolinkanchors.push(favoritetext); // push into global array of autolinks
				autolinks.push(hyper);
				}
            // save the favorite
            $.post('writefavorites.php', {
                newline: lin,
                async: false,
                success: function(){
                    alert('Success updating link file!');
                },
                error: function(){
                    alert('Error writing link file');
                }
            })
            
        } // not a dupe
    } // is a favorite
    // actually insert it
    // strip the spaces from seltext - they're added backl in insertthelink
    seltextt = trimSpacesAndLfs(seltextt);
    inserttheLink(hyper, seltextt);
    // write the link to the file of links, if it's new
    writelink(hyper);
	
	// remove the checkmarks
	document.getElementById('favoriteanchorcheck').checked = false;
	document.getElementById('favoriteanchorautocompcheck').checked = false;
	
	// go back to the edit box

	$("#LinkBlock").fadeOut(300);
		// calc where to put caret: starting pos + length of link + </a> + anchor text len
	var newpos;
	$("#ed").focus();
	newpos = selstart + hyper.length + 15 + seltext.length;
	//setCaretPosition(newpos);
	scrollTextareaToPosition(newpos);
    
}
function scrollTextareaToPosition(position) {
// thanks http://makandracards.com/makandra/29003-scroll-a-textarea-to-a-given-position-with-jquery
  var text = $("#ed").val();
  var textBeforePosition = text.substr(0, position);
  $("#ed").blur();
  $("#ed").val(textBeforePosition);
  $("#ed").focus();
  $("#ed").val(text);
  setCaretPosition(position);
  //$("#ed").setSelection(position, position); // assumes that you use jquery-fieldselection.js
}

function toggleFavoriteCheck(){
	// if check autolink box, turn on favorites checkbox, if it's off
	if ((document.getElementById("favoriteanchorautocompcheck").checked == true)) {
		document.getElementById("favoriteanchorcheck").checked = true;
		
	}
}

function writelink(hyperlink){
    // Save the link?
    var x = isADupe(linkanchors, seltext);
    if (x == -1) { // If a new linke
        // build the string
        var mydate = new Date();
        var datestr = (mydate.getMonth() + 1) + "/";
        datestr = datestr + mydate.getDate() + "/";
        datestr = datestr + (mydate.getYear() + 1900);
        var tit = document.getElementById("posttitle").value;
        var s = hyperlink + "|" + datestr + "|" + tit + "|" + seltext + "\n";
        // append it
        //doAjaxPostOrGet('append_link.php','POST','newline',s);
        $.post('php/append_link.php', {
            newline: s,
            async: false,
            success: function(){
                alert('Success updating link file!');
            },
            error: function(){
                alert('Error writing link file');
            }
        })
        //alert("after appendlink:" + s);
    }
    
    return;
}

function inserttheLink(hyperlink, stext){
    //alert('in inserthelink');
    // restore the spaces
    var seltext2 = stext; //priorspace+seltext+postspace;
    // wrap the link and restore the spaces
    var hl = priorspace + '<a href="' + hyperlink + '">' + seltext2 + '</a>' + postspace;
    // insert the link
    inserttextatcursor(hl);
    location.href = "#htmleditor";
    // turn off favorites checkbox
    document.getElementById('favoriteanchorcheck').checked = false;
    
}

// --------- WRITE A NEW FAVORITE AUTOLINK
function writeNewFavorite(){
	   // takes new autolink from the form and adds it to the list
	   var favoritetext = document.getElementById("autolinkwordtxt").value;
	   var hyper = document.getElementById("autolinkurltxt").value;
	   
	   if ((favoritetext="") || (hyper="")){ // error check
	   	 alert("Fill in the boxes first");
		 return;
	   }
	   
	   
	    var dupe = isADupe(favoriteanchors, seltextt);
        if (dupe == -1) { // not a dupe
            //display Favorites Box
            var fl = document.getElementById("favoritelinkdiv");
            fl.style.display = "block";
            favoriteanchors.push(favoritetext);
            favoritelinks.push(hyper);
            // save the favorite
            $.post('writefavorites.php', {
                newline: "\n" + favoritetext + "|" + hyper,
                async: false,
                success: function(){
                    alert('Success updating link file!');
                },
                error: function(){
                    alert('Error writing link file');
                }
            })
            
        }
}

// --------- WRITE A NEW TWITTER NAME AND HANDLE
function writeTwitter(nam,handl){
	   // takes twitter name from link area box and writes it
	   
	   // check for blanks
	  if ((nam=="") || (handl=="")){
	  	alert("Real name and Twitter handle are both required. Quitting.");
		return
	  }
	   
	   // check for dupes
	   var i;
	   var found = -1;
	   for (i=0; i < tweeters_anchors.length; i++){
	   	if (tweeters_anchors[i].toUpperCase() == nam.toUpperCase()){
			found = i;
		}
	   }
	   if (found > -1) { // if name already there, then quit
	   	return
	   }
	   // not already there
	   // add to array
	   tweeters_anchors.push(nam);
	   tweeters_tweetnames.push(handl);
	   // save the twitter
            $.post('writetwitter.php', {
                newline: "\n" + nam + "|" + handl,
                async: false,
                success: function(){
                    alert('Success updating link file!');
                },
                error: function(){
                    alert('Error writing link file');
                }
            })
            
        
}

function insertEmail(){
    // inserts email using graphic of at sign
    var addy = email1 + "<img src='" + atsign + "' width=" + atsignwidthandheight + " height=" + atsignwidthandheight + "align=bottom>" + email2;
    inserttextatcursor(addy);
    
}

function inserttextatcursor(txt){
    getSelectedText(); // load the globals
    var el = document.getElementById('ed');
    var oldtxt = el.value
    var p1 = oldtxt.substring(0, selstart);
    var p2 = oldtxt.substring(selend);
    var newtxt = p1 + txt + p2;
    el.value = newtxt;
    return newtxt
}

function sizeEditAndWysiAreas(){
		// adjust size of edit area
		var eled = document.getElementById("edcell");
		var elht = document.getElementById("html");
		$("#html").animate({width:wysiAreaWidth}, 2000, function(){});
		$("#edcell").animate({width:editAreaWidth}, 2000, function(){});
		//eled.style.width=editAreaWidth;
		//elht.style.width=wysiAreaWidth;
}

function readConfig(){
    var configfile = "";
    $.ajax({
        type: "POST",
        url: "data/blogdraft_config.txt",
        async: false,
        success: function ajaxConfig(listresult){
            setPrefs(listresult);
            notify("Preferences set", "OK")
        },
        error: function(e){
            var errtext = e.statusText;
        }
    }) 
}

function setPrefs(configdata){
	 
    if (configdata == "") {
        notify("data/blograft_config.txt not founding. Resorting to defaults", "ERROR");
    }
    else {
        configmeta.length = "";
        configdata.length = "";
        // create an array of lines
        var configs = new Array();
        configs = configfile.split("\n");
        var ctr = 0;
        var p;
        // go through array of lines making two new arrays
        for (var i = 0; i < configs.length; i++) {
            if (configs[i].startsWith != "#" && configs[i].length > 0) {
                p = configs[i].indexOf("=");
                configmeta.push(configs[i].substring(0, p - 1));
                configdata.push(configs[i].substring(p + 1));
                ctr = ctr + 1;
            }
        }
        // assign preferences
        var met;
        var dat;
        for (i = 0; i < configmeta.length; i++) {
            met = configmeta[i];
            dat = configdata[i];
			if (met == "KeystrokesBeforeSaves") {
                KeystrokesBeforeSaves = parseInt(configdata[i]);
            }
        }
    }
}

function gettext(){
    var txt = document.getElementById("wysi");
    //var vf=formatText('ViewText','wysi')
    var ttxt = txt.value;
    //alert(ttxt);
    //WYSIWYG.updateTextArea("wysi");
    //insertHTML("<u>u</u>", "wysi"); // works to insert
    var sel = document.getElementById('wysiwyg' + 'wysi').contentWindow.getSelection();
    alert(sel);
}

function addlink(){
    // get the selection
    var sel = document.getElementById('wysiwyg' + 'wysi').contentWindow.getSelection();
    // create link
    var newlink = '<a href="' + document.getElementById('linkarea').value + '"\>' + sel + '</a>';
    insertHTML(newlink, 'wysi');
    alert('rt');
}

function readExpansions(){
    // read blogdraft_expansions.txt and create two associated arrays
    
    updateStatus('Reading expansions');
    
    if (1 == 1) {
    
        $.ajax({
            type: "POST",
            url: "./php/readexpansions1.php",
            async: false,
            success: function(expresult){
                expansionslist = expresult;
                //alert("expansionslist in jquery ajax= " + expansionslist);
            },
            error: function(){
                updateStatus("Failed: expansions1.php");
            }
        })
        
    }
    
    // break it into an array
    g_expansions.length = 0; // init it
    g_expansions = expansionslist.split("\n");
    //alert("expansions1="+expansions[1]);
    // remove line feeds
    var debugexp;

    // expansions[] now is "--|&mdash" so break it into two arrays
    var arraylen = g_expansions.length;
    var p;
    var ment = "";
    var original = "";
    for (i = 0; i < arraylen; i++) {
        p = g_expansions[i].indexOf("|");
        ment = g_expansions[i].substring(p + 1, g_expansions[i].length);
        original = g_expansions[i].substring(0, p);
        g_expansions[i] = original;
        expansions_replacements.push(ment);
        
    }
    updateStatus('Finished ' + g_expansions.length + ' expansions.')
    
}

function enteredLinkTextArea(){
    //alert("intext");
    var m = document.getElementById('linkarea');
    var s1 = m.value.length;
    if (s1 > 0) {
        m.selectionStart = 0;
        m.selectionEnd = s1;
    }
}

// -------- HTMLIZE
function htmlize(){
    // Preps the tags and writes them
    prepTags();
    
    var el = document.getElementById('ed');
    
    var ht = RunExpansions();
    // replace double spaces with <p> except where not
    // first, add p at very beginning unless already there
    ht = trimSpacesAndLfs(ht);
	
	// straighten the quotes?
	if (straightenQuotes == true) {
		ht = straightenTheQuotes(ht);
	}
    var first3 = ht.substring(0, 2);
    first3 = first3.toUpperCase();
    if (first3 != "<P" && first3 != "<BL" && first3 != "<UL") {
        ht = "<p>" + ht;
    }

    ht=removeBlankPs(ht);
    
     ht = convertDotsToLis(ht);
	
    var dun = false;
    var p1 = 0;
    var p2;
    while (!dun) {
        p2 = ht.indexOf("\n\n", p1)
        if (p2 > 0) {
            // is there a p already there
            var frag = ht.substring(p2 + 2, p2 + 5);
            frag = frag.toUpperCase();
            if (frag != "<P>" && frag != '<BL' && frag != "<UL" && frag != "<OL") {
                ht = ht.substring(0, p2 + 2) + "<p>" + ht.substring(p2 + 2);
            }
            p1 = p2 + 2;
            if (p1 >= ht.length) {
                dun = true;
            }
        }
        else 
            dun = true;
    }
    
    // update the html editor
    el.value = ht;
    
    // alternate callout sides
    if (alternateCalloutSides == true){
    	alternateCallouts();
    }
    
    // upodate the display of the formatted text
    updatehtml();
    // insert the tags into the display
	if (document.getElementById("includetagscheck").checked == true) {
		insertTags();
	}
    
    // save the file -- this should probably be in the publish setp
    saveFile("");
    
    // Create combined html for copying
    var totalh = ht;
    // add title
    totalh = document.getElementById('posttitle').value + "\n\n" + totalh;
    // add tags
	if (document.getElementById("includetagscheck").checked == true) {
		var tgs = createTagString();
		totalh += " " + tgs;
	}
   
    el.select();
}

function convertDotsToLis(h){
  // convert dots or #'s at beginning of line to li's
  var hh = h.split("\n");
  var l, i, inlist=false, listtype, listchar;
  for (i=0; i < hh.length; i++){
     l = hh[i];
     // we have a dot or # at the beginning of a line
     if ((l.indexOf(".") == 0) || (l.indexOf("<p>.") == 0) || (l.indexOf("<P>.") == 0) || (l.indexOf("#") == 0) || (l.indexOf("<p>#") == 0) || (l.indexOf("<P>#") == 0 )){ 
        if ((l.indexOf(".") == 0) || (l.indexOf("<p>.") == 0) || (l.indexOf("<P>.") == 0)) {
             listtype = "UL";
             listchar = ".";
             }
             else {
             listtype = "OL";
             listchar = "#";
             }
             
        // remove the dot or #
        
        hh[i] = l.substring(l.indexOf(listchar) + 1);
        hh[i] = "<LI><P>" + hh[i] + "</p></LI>"; // add the <li>
        
        if (inlist == false){ // if it's the first one;
           hh[i] = "<" + listtype + ">\r" + hh[i];
        }
        inlist = true; // we're in a list now
    }
    // not on a list item line
    else { 
       if (inlist == true) {
        hh[i] = "</" + listtype + ">\r" + hh[i]; // end the list
        inlist = false;
        }
        }
  }  
  
    
    // stitch it together
    h = "";
    for (i=0;i < hh.length; i++) {
      h = h + "\r" + hh[i];
      }
      
      return h;
  
}

function straightenTheQuotes(h){
	var hh = h;
	var s1,s2;	
	//alert(hh.charAt(0) + "+" + hh.charCodeAt(0));
	// double quotes
	s1 = RegExp(String.fromCharCode(8220), "gi");
    s2 = '"';
    hh = hh.replace(s1, s2);
	s1 = RegExp(String.fromCharCode(8221), "gi");
    s2 ='"';
    hh = hh.replace(s1, s2);	
	// single quotes
	s1 = RegExp(String.fromCharCode(8217), "gi");
    s2 = "'";
    hh = hh.replace(s1, s2);
	s1 = RegExp(String.fromCharCode(8218), "gi");
    s2 = "'";
    hh = hh.replace(s1, s2);
	return hh;
}


function closeTags(html) {
	//var temphtml = document.createElement("body");
	//temphtml.innerHTML = html;
	// restore mdash markup
	//temphtml.innerHTML.replace(String.fromCharCode(8212),"&mdash;");
    //var cleanedhtml = temphtml.innerHTML;
    //return cleanedhtml;
    return html;
} 

function removeBlankPs(h){
	if (h == null){return h;}
    var hh = closeTags(h);
    // remove blanks
	hh = hh.replace(/\n\s*\n/g, '\n');
	// add blanks after </p>
	hh = hh.replace(/<\/p>/g, '\<\/p>\n\n');
	// add blank after blockquote
	hh = hh.replace(/<\/p><\/blockquote>/g, '\<\/p><\/blockquote>\n\n');
	
	return hh;
}


function RunExpansions(){
    //alert("Ex:"+expansions[0][0]);
    
    var htxt = document.getElementById("ed").value;
    // getDocument.body.innerHTML = html.toString();
    
    
    //alert("preexpansions="+htxt);
    var ttt = "";
    var s1, s2;
    for (i = 0; i < g_expansions.length; i++) {
        ttt = "\\\<" + g_expansions[i] + "\\\>"; // whole words only
        s1 = RegExp(ttt, "gi");
        s2 = expansions_replacements[i];
        //s1=/--/gi;
        //s1="/"+expansions[1]+"/gi";
        htxt = htxt.replace(s1, s2);
    }
    //alert("after exp:"+htxt);
    
    
    
    document.getElementById("ed").value = htxt;
    
    return htxt;
}

function checkforexpansion(w){

  	var el = document.getElementById('ed');
    var htxt = el.value;
    
    // get global selection position
		getSelectedText();

	// check for double commas to indicate an anchor term
	if ((selstart > 0) &&(w == ",")){
		// get prior char
		var priorchar = htxt.substring(seltext - 1, 1);
		if (priorchar = ","){
			// is there a prior ,, ?
			var openingcommas = htxt.indexOf(",,");
			if ((openingcommas !== -1) && (openingcommas < selstart)){
				// we have a matched set, so get the text
				var anchortext = htxt.substring(openingcommas, selstart - openingcommas);
				// remove the opening commas
				htxt = htxt.substring(1, openingcommas) + htxt.substring(selstart + 2, htxt.length);
				// get the anchortext without the commas
				anchortext = anchortext.substring(2, anchortxt.lengh - 2);
				// select the text
				htxt.selectionStart = openingcommas;
				htxt.selectionEnd = openingcommas + anchortext.length;
				linkIt();
				}
		}
		
	}

    // is this word ready for expansion?
    w = trimSpacesAndLfs(w);
	if (w == ""){return false;}
    //alert('-'+w+'-');
    var found = false;
    var debugtest = g_expansions;
    var el = document.getElementById('ed');
    var htxt = el.value;
    // getDocument.body.innerHTML = html.toString();
    var s1, s2, expanup;
    for (i = 0; i < g_expansions.length; i++) {
        expanup = g_expansions[i].toUpperCase();
        if (w.toUpperCase() == expanup) {
            getSelectedText();
            var newtxt = htxt.substring(0, selstart - w.length) + expansions_replacements[i] + htxt.substring(selstart, htxt.length);
            el.value = newtxt;
            // put insertion cursor in the right spot
            var lendelta // diff between length of original and replacement
            if (w.length > expansions_replacements[i].length) {
                lendelta = w.length - expansions_replacements[i].length
            }
            else {
                lendelta = expansions_replacements[i].length - w.length
            }
            // set start and end of selection the same
            el.selectionStart = selstart + lendelta;
            el.selectionEnd = selstart + lendelta;
            //el.selectionEnd=6;
            //el.selectionStart=0;
            found = true;
            ;
            //alert('-'+newtxt+'-');
        }
        
    }
    return found
}

// -------- INSERT TWITTER LINK
function twitLink(){
	
	getSelectedText();
	var linktxt="";
	// is there a match in the database?
	var whichtweet = checkfortwitter(seltext);
	// if a match, then insert link
	if (whichtweet > -1){
	 if (gtweetanchor == "HANDLE") {
	    var anchortext = tweeters_tweetnames[whichtweet];
	    }
	    else {
	    var anchortext = gtweetanchor;
	    }
	    }
	   else { // no match, so ask for one
	      var hidel = document.getElementById("insertnewtwit"); // get hidden element
	      hidel.innerHTML = "<p>Link this name: <textarea id='twita' style='width:100px;height=10px;'>" + seltext + "</textarea> to this Twitter handle:  <textarea id='twitb' style='width:100px;height=10px;'></textarea>";
	      hidel.innerHTML = hidel.innerHTML + "<p>Leave blank for none. <input type=button onclick='insertnewtwit()'  class='smallbutton' value='Done'>";
	     hidel.style.display="block";
	     return;
	   }
	    
	 linktxt = " [twitter:<a href='http://www.twitter.com/" + tweeters_tweetnames[whichtweet] + "'>" + anchortext + "</a>] ";
	  insertTextAtEndOfSelection(linktxt,selend);
	
	//alert(whichtweet);
	
}

function insertnewtwit(){
  // called by "insertnewtwit" button in "insertnewtwit" hidden element
  // if fields are blank, then skip
  var t1 = document.getElementById("twita").value;
  if (t1 == "") {
  	return
  	}
  var t2 = document.getElementById("twitb").value;
  if ((t2=="") && (t1 !="")){ // check for values
  	document.getElementById("insertnewtwit").style.display="none";
	return
  }
  getSelectedText();
  if (gtweetanchor == "HANDLE") {
		 linktxt = " [twitter:<a href='http://www.twitter.com/" + t2 + "'>" + t2 + "</a>] ";
	    }
	    else {
	     linktxt = " [<a href='http://www.twitter.com/" + t2 + "'>twitter" + "</a>] ";
	    }
 
  insertTextAtEndOfSelection(linktxt,selend);
  document.getElementById("insertnewtwit").style.display="none";
  writeTwitter(t1,t2); // save it
  

}


function insertTwitterLink(){
	// called by button in Link are
	var tweet = document.getElementById("twitterLinkTxt").value;
	if (tweet == "") {
		alert("No twitter handle entered. Quitting.");
		return;
	}
	  getSelectedText();
	var linktxt = " [twitter: " + "<a href='http://www.twitter.com/" + seltext + "'>" + tweet + "</a>] ";
   
	 insertTextAtEndOfSelection(linktxt,selend);
	// save the twitter handle
	writeTwitter(seltext,tweet);
}

function insertTextAtEndOfSelection(txt){
		getSelectedText();
		var el = document.getElementById("ed");
		var oldtxt = el.value;
		var newtxt = oldtxt.substring(0,selend) + txt + oldtxt.substring(selend);
		el.value = newtxt;
}

function checkfortwitter(w){

    // is this word ready for expansion?
    w = trimSpacesAndLfs(w);
	if (w == ""){return false;}
    //alert('-'+w+'-');
    var found = -1;
    var el = document.getElementById('ed');
    var htxt = el.value;
    // getDocument.body.innerHTML = html.toString();
    var s1, s2, expanup;
    for (i = 0; i < tweeters_anchors.length; i++) {
        expanup = tweeters_anchors[i].toUpperCase();
        if (w.toUpperCase() == expanup) {
            found = i;
         
        }
        
    }
    return found;
}

// -------------- WIKIPEDIZE
function wikipedize(){

//https://en.wikipedia.org/w/api.php?action=query&format=jsonfm&list=search&srsearch=new%20york

         
        // get search term from selection
        getSelectedText(); // puts it into a global
        var searchterm =  seltext;
        if (searchterm == ""){
        	alert("No term selected");
        	//$('#wpresultsdiv').fadeOut(300);
        	$('#wikipediadiv').fadeOut(300);
        	return;
        }
        searchterm = trimSpacesAndLfs(searchterm);
        
        $("#wikipediadiv").fadeToggle(300); // show the div
         if ($("#wikipediadiv").is(":visible") === false){ // if we just hid it, then exit
         	return;
         }
        
        if (searchterm !== ""){
       var encodedsearchterm=encodeURI(searchterm);
        var res;
        $.ajax({
            type: "POST",
            // headers: {"X-My-Custom-Header": "http://localhost/blogdraft/blogdraft.html"},
//          	contentType:  'application/javascript',
          url: "./php/wikipediaSearch.php",
          dataType: 'jsonp',
        	data: {"searchterm" : searchterm},
            async: false,
            success: function(expresult){
                res = expresult;
                //alert(expresult);
            },
            error: function(e){
            	if (e.statusText == "OK"){
            		parseWikipedia(e.responseText);
            	}
            	else {
                alert("error in wikipedia search: " + e.status + " : " + e.statusText);
                }
            }//
        })
	}
	
	}	
	
function insertImagePath(){
	// gets uploaded image's name from iframe
	var ifr=document.getElementById('imageuploaderiframe'); 
	ipel=ifr.getElementById('imgname'); alert(ipel); $('#imagepath').val(ipel);
}
	
function parseWikipedia(res){


        if ((res===null) || (res===undefined)){
        	alert("Error searching for " + searchterm);
        	return
        }
        // we have results
    
        	// empty existing
        	$("#wpresultsdiv").html("");
        	// add close button
        	var div = document.createElement("div");
        	div.setAttribute("onclick","$('#wikipediadiv').fadeToggle(300)");
        	div.setAttribute("class","tool googlewikiclose");
        	$(div).text("Close");
        	$("#wpresultsdiv").append(div);
        	// display search term
        	$("#searchterms").html("<h4>Search: " + seltext + "</h4>");
        	// loop through results
        	var jres = JSON.parse(res);
        	var response = jres["query"];
        	var results = response["search"];
        	for (var i=0; i < results.length; i++){
        		var title = results[i]["title"];
        		var url = "https://en.wikipedia.org/wiki/" + encodeURIComponent(title);
        		var desc = results[i]["snippet"];
        		// build entry
        		var div = document.createElement("div");
        		var span = document.createElement("span");
        		span.setAttribute("class","indexhead");
        		span.innerHTML=title;
        		div.appendChild(span);
        		var p = document.createElement("p");
        		p.setAttribute("class","searchdesc");
        		p.innerHTML = desc;
        		span = document.createElement("span");
        		span.setAttribute("class","searchlink");
        		span.innerHTML=" [<a href='" + url + "' target='new_page'>link</a>]";
        		p.appendChild(span);
        		span = document.createElement("span");
        		span.setAttribute("class","searchcopy");
        		span.setAttribute("onclick","insertGoogleLink('" + url + "')");
        		span.innerHTML= " INSERT ";
        		p.appendChild(span);
        		div.appendChild(p);
        		$("#wpresultsdiv").append(div);
        	}
      
        	
        	$("#wpresultsdiv").slideDown(300);
 
  return;

}

function convertToMarkdown(){
	var converter = new Markdown.Converter();
    var md = converter.makeHtml($("#ed").val());
    alert(md);
}

// function keyboardmaestroftp(){
// // NOPE. Needs Application library
// 	var app = Application('Keyboard Maestro Engine');
// app.doScript("E1E43221-151D-4A94-8254-AF5482D9E76A");
// // or: app.doScript("ftp blog images");
// //	-- or: app.doScript("E1E43221-151D-4A94-8254-AF5482D9E76A", { withParameter: "Whatever" });
// }

// Get file selected for upload
function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
    $("#imagefileuploading").text(f.name);
    $("#imagefilesize").text(f.size);
      //output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
        //          f.size, ' bytes, last modified: ',
          //        f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
            //      '</li>');
    }
    //document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
  }

function addImagePathToPage(s){
	alert(s);
}

function doesFileExist(){
	// get name from span
	var fn = $("#imagefileuploading").text();
	var furl = "http://hyperorg.com/blogger/images/" + fn;
	$.ajax({
    url:furl,
    async: false,
    type:'HEAD',
    error: function()
    {
       notify(fn + ": Not yet", "ERROR");
    },
    success: function()
    {
        notify("Got it! :" + fn, "OK");
    }
});
}

function testRemotePHP(){

 var url = 'http://www.hyperorg.com/blogger/temptest/TESTremote.php';

    $.ajax({
        url: url,
    type: "PST",
    async: false,
   // jsonpCallback: 'jsonCallback',
   crossDomain: true,
    //contentType: "application/json",
    async: false,
   dataType: 'jsonp',
   // data: {data : "123"},
   
   error: function(jqxhr,status,error){
   		//alert('an error occurred:' + status + " : " + error);
		a  =1;
       // error: function(e) {
       //     alert(e.statusText);
        },
    success: function( response ) {
        alert("success:" +  response );
    }
    }); 

}


// ------- BLIND LINK OUT OF MEMORY

function blindLink(){
// not  used: Can't copy from clipboard
	// Links selected text using contents of clipboard directly
	
	// get what's on the clipboard	
	var fromclip = paste_clip();
    if (fromclip == "") {
		alert("Nothing on the clipboard");
		return;
	}
	// is it an url?
	fromclip = trimSpacesAndLfs(fromclip);
	if (fromclip.indexOf("http://") < 0) {
		if (fromclip.indexOf("www") == 0) { // add http if it has a www
			fromclip = "http://" + fromclip;
			}
			else {
		alert("Doesn't look like an url: " + fromclip);
		return;
		} 
		
	}
    
	// put it into link area just in case
	document.getElementById("linkarea").value=fromclip;
	
	// put selected text into globals
    getSelectedText();
	
		// is there any selected text?
	if(seltext.length==0) {
		alert("No text selected for automatic insertion of link to " + fromclip);
		return;
	}
	
	// put it into link area just in case
	document.getElementById("favoriteanchortext").value=seltext;

		// Make the new link
		var ss = "<a href='" + fromclip + "'>"  + seltext + "</a>";
		inserttextatcursor(ss);
		return
}

// -------------- LINK INIT
function linkIt(){
    
	
	//thanks https://github.com/Codecademy/textarea-helper
	getSelectedText(); // set global cursor positions
	var pos = $("#ed").textareaHelper('caretPos');
	//	var pos = selstart;
	
	var x = pos.left ;
	var y = pos.top + 80;
	
	// if (el.selectionStart) { 
   
	$("#LinkBlock").css({"left": x, "top" : y});
	
	$("#LinkBlock").fadeIn(400);
    
    // Hide old link area. Will get shown if there are any old links
    var ol = document.getElementById('OldLink');
    ol.style.display = "none";
    ol.innerHTML = "";
    
    // clear out constructed links based on anchor
    var linkatts = document.getElementById('ConstructedLinks');
    //alert("linkatts="+linkatts);
    linkatts.innerHTML = "";
 
    
    // put text selection into linktext area about to be revealed
    // get the selection
    
    //puts selected text into globals
    getSelectedText();
    
	// does the selection have a .com or .org? If so, link it diretly
	var p1 = seltext.indexOf(".com");
	if ((seltext.indexOf(".com") > 0) || 
	    (seltext.indexOf(".org") > 0) || 
		(seltext.indexOf(".edu") > 0) || 
		(seltext.indexOf(".gov") > 0) || 
		(seltext.indexOf(".net") > 0)){
		var ss = "<a href='http://" + seltext + "'>" + seltext + "</a>";
		inserttextatcursor(ss);
		return
	}
	
	
    // convert html to string
    var sel = seltext.toString();
    // preserve spaces
    priorspace = "";
    postspace = "";
    if (sel.substr(0, 1) == " ") {
        priorspace = " ";
    }
    if (sel.substr(-1, 1) == " ") {
        postspace = " ";
    }
    sel = trimSpacesAndLfs(sel);
    // add anchor text to favorites anchor box
    document.getElementById('favoriteanchortext').value = sel;
    //$("#favoriteanchortext").val(sel);
    
    
    // put the value into  body ... NO DON'T TO THIS. the munged link above it does this. It just gets in the way
    // Only do it if the sel text ends in .com or so
	   var linkbox = document.getElementById('linkarea');
	   linkbox.value=""; // blank it
	   var mungedlink = sel; // create a link
    // remove spaces
    mungedlink = removeSpaces(mungedlink);
    // if it's a com already, add http://
    var q = sel.lastIndexOf(".");
    if (q > 0) {
        var ext = sel.substr(q + 1, 3);
        if ((ext.toUpper == 'COM') || (ext.toUpper == 'ORG') || (ext.toUpper == 'EDU')  || (ext.toUpper == 'GOV')  || (ext.toUpper == 'NET')) {
			if (linkbox.value.indexOf("http://") < 0) {
				mungedlink = "http://" + mungedlink;
				linkbox.value = mungedlink;
			}	
        }
    }
    
   
    
    // get text in link text area
    var linktext = linkbox.value;
    
    // go to that area of the page
    location.href = '#linklink';
    
    
    // Scan list of prior links for matches?
    var match = -1;
    var i = 0;
    var done = false;
    var anch;
    while (done == false) {
        anch = linkanchors[i];
        
        if (linkanchors[i] == sel) {
            //alert(linkanchors[i]+ "=" + sel);
            match = i;
            done = true;
        }
        else {
            i++;
            if (i > linkanchors.length) {
                done = true;
            }
        }
        
        // select the text in the link text area
        enteredLinkTextArea();
    }
    
    // Did we get a match?
    if (match > -1) {
        // display match area
        
        ol.style.display = 'block';
        // build the text and button 
        var htmltext = "<form><p class='oldlinkclass'><input type='button' onclick='";
        htmltext = htmltext + "inserttheLink(" + "linkurls[" + match + "]," + quote2 + sel + quote2 + ")" + "'" + " value='+')> " + linkurls[match];
		htmltext = htmltext + " <span style='color:blue;font-size:9pt;' onclick='copyurl(\"" + sel + "\")'>edit</span></form>";
        //alert("match="+htmltext);
        ol.innerHTML = htmltext;
        // inmsert it for now
        // var hyperLink = '<a href="'+linkurls[match]+ '">' + '"'+sel + '"</a>';        //alert("hyperlink="+hyperLink);
        // var editwindow=document.getElementById('wysi');
        // alert(editwindow.value);    
        //window.opener.document.getElementById('wysiwyg' + qsParm['wysiwyg']).contentWindow.document.execCommand("CreateLink", false, hyperLink);
        // window.close();
    };
    
    
    // Build link alternatives
    // is there an TLD already?
    var s = removeSpaces(sel);
    //alert("s=+s");
    var htmltext2 = ""; // use this as the flag
    var q = -1;
    q = sel.lastIndexOf(".");
    //alert(q);
    if (q > -1) { // we've got a dot
        var tld = sel.substring(q + 1, s.length);
        
        if (tld.length == 3) {
            //alert("tld="+tld);
            var tlds = "COM ORG EDU NET GOV MIL CO.UK";
            var p2 = -1;
            var utld = tld.toUpperCase();
            p2 = tlds.indexOf(utld);
            //alert(utld);
            if (p2 > -1) { // is the tld one of the real ones?
                urltxt = "http://www." + s;
                htmltext2 = "<form><input type='button' onclick='";
                htmltext2 = htmltext2 + "inserttheLink(" + quote2 + urltxt + quote2 + "]," + quote2 + sel + quote2 + ")" + "'" + " value='+')>";
                htmltext2 = htmltext2 + +urltxt;
			    htmltext2 = htmltext2 + " <span style='color:blue;font-size:9pt;' onclick='copyurl(\"" + sel + "\")'>edit</span></form>";
              //  alert(htmltext2);
                
                //alert(_dec_to_rgb+htmltext);
            }
        } // tld > 3
    } // has a period
    // didn't auto-insert because it has a real TLD
    if (htmltext2 == "") {
        // add .com
        htmltext2 = s + ".com";
        //does it have a www?
        var uhtmltext = htmltext2.toUpperCase();
        q = uhtmltext.indexOf("WWW.");
        if (q != 1) {
            htmltext2 = "www." + htmltext2;
        }
        // does it have a http?
        q = uhtmltext.indexOf("HTTP://");
        if (q != 1) {
            htmltext2 = "http://" + htmltext2;
        }
        insertCreatedLink(htmltext2, s);
        // does it have spaces we can remove?
        if (sel.indexOf(" ") > -1) {
            // remove spaces
            var spacelesstxt = removeSpaces(sel);
            htmltext = "http://www." + spacelesstxt + ".com";
			// htmltext = htmltext + " <span style='color:blue;font-size:9pt;' onclick='copyurl(\"" + sel + "\")'>edit</span>";
              
            insertCreatedLink(htmltext, sel);
            
        }
    }
    
    //// ----------did we get a favorite?
    match = lookforfavorites(sel);
    // did we find a favorite?
    var favl = document.getElementById('favoritelinkid');
    if (match > -1) {
        // display favorite links section
        
        favl.style.display = 'block';
        // var bl=fl.style.display;
        // display the link
        //  -- build the button
        var but = '<input type="button" value="Favorite" onclick="inserttheLink('
        but = but + quote1 + favoritelinks[match] + quote1 + ',' + quote1 + favoriteanchors[match] + quote1 + ')"></input>';
        but = but + "<span class='favoritelink'> " + favoritelinks[match] + "</p>";
        //alert(but);
        favl.innerHTML = but;
        
    }
    else {
        // 'favl.style.display='hide'; debug - can't get block and hide to work on this element
        favl.innerH = "";
    }
    
	// auto insert twitlink into textarea if we have it
	var whichtwit = checkfortwitter(seltext);
	if (whichtwit > -1) {
		document.getElementById("twitterLinkTxt").value = tweeters_tweetnames[whichtwit];
	}
	else {
		document.getElementById("twitterLinkTxt").value="";
	}
	
    // select the text box
    // give linkbox the focus
    linkbox.focus();
    // select the link box contents
    linkbox.setSelectionRange(0, linkbox.value.length - 1);
    linkbox.focus();
    
}

function copyurl(c){
    // copies c into linktextarea
	//alert(c);
    var la = document.getElementById('linkarea');
    la.value = c;
}

function clearlink(){
    // clear link form or paste in sel text
    var lb = document.getElementById('linkarea');
	getSelectedText();
	if (lb.value==""){
		lb.value=seltext;
	}
	else {
		lb.value="";
	}
}

function showclip(){
    // debugging -- testing selection
    var tt = document.getElementById("textarea");
    tt.selectionStart = 1;
    tt.selectionEnd = 5;
    tt.focus();
    
}


function lookforfavorites(ss){
    //// ----------did we get a favorite?
    // return number of favoritelinks, or -1 if no match
    var match = -1;
    var i = 0;
    var donnne = false;
    var fa;
	var x;
    while (donnne == false) {
        fa = favoriteanchors[i]; // debugging
      if (favoriteanchors[i].toUpperCase() == ss.toUpperCase()) {
            //alert(linkanchors[i]+ "=" + sel);
            match = i;
            donnne = true;
        }
        else {
            i++;
			if ( favoriteanchors[i]==null) {
				donnne=true;
				}
         
            }
        }
        
   
    return match
}

function lookForAutolink(ss){
    //// ----------did we get an autolinks?
    // return number of autolinks or -1 if no match
    var match = -1;
    var i = 0;
    var donnne = false;
    var fa;
	var x;
    while (donnne == false) {
        fa = autolinkanchors[i]; // debugging
      if (autolinkanchors[i].toUpperCase() == ss.toUpperCase()) {
            //alert(linkanchors[i]+ "=" + sel);
            match = i;
            donnne = true;
        }
        else {
            i++;
			if ( autolinkanchors[i]==null) {
				donnne=true;
				}
         
            }
        }
        
    return match
}

//-------- Launch Autolink config page
function launchAutolinkConfig(){
	
	
	
	
}




function insertCreatedLink(htmlt, seltxt){
	// htmlt = url
    var htext = seltxt.link(htmlt); // turns seltxt into anchortext of link to url htmlt
    //alert(htext);
    var texttoinsert = "";
    texttoinsert = "<form><p class='mungedlinks'><input type='button' value='+' onclick='" + "inserttheLink(" + quote2 + htmlt + quote2 + "," + '"' + seltxt + '"' + ")'> " + htmlt;
     texttoinsert = texttoinsert + " <span style='color:blue;font-size:8pt;' onclick='copyurl(\"" + htmlt + "\")'> [edit] </span></form>";
              
	// insert it
    // display match area
    //alert(texttoinsert);
    ol = document.getElementById('ConstructedLinks');
    ol.style.display = 'block';
    ol.innerHTML = "<p class='boldlabel'>" + texttoinsert;
}


function addhttp(which){
    // inserts the tla ending if link doesn't already have one
    //alert("in insert told");
    var linktxt = document.getElementById('linkarea');
    var starterlink = linktxt.value;
    //alert("starterlink="+starterlink);
    // get the first four
    var first4 = starterlink.substr(0, 4);
    //alert(first4);
    first4 = first4.toLowerCase();
    // if the final four aren't the requested ending
    if (which == "www") {
        if (first4 != "www." && first4 != "http") {
            starterlink = "www." + starterlink;
            
        }
        else {
            if (first4 == "http") {
                starterlink = starterlink.substring(0, 7) + "www." + starterlink.substring(7);
            }
        }
        
    }
    
    if (which == "http") {
        if (first4 != "http") {
            starterlink = "http://" + starterlink;
        }
    }
    
	if (which == "http://www") {
		if (starterlink.indexOf(which) < 0) {
			starterlink = "http://www." + starterlink;
		}
	}
	
    linktxt.value = starterlink;
}


function addTDL(tla){
    // inserts the tla ending if link doesn't already have one
    //alert("in insert told");
    var linktxt = document.getElementById('linkarea');
    var starterlink = linktxt.value;
    //alert("starterlink="+starterlink);
    // get the last four
    var final4 = starterlink.substr(-4, 4);
    //alert(final4);
    final4 = final4.toLowerCase();
    // if the final four aren't the requested ending
    var tlds = ".com.org.edu.gov"
    if (final4 != "." + tla) {
        // is it one of the others
        var isatld;
        isatld = tlds.indexOf(final4);
        // if it's one of the others, subtract it
        if (isatld > -1) {
            starterlink = starterlink.substr(0, starterlink.length - 4)
        }
        // replace the text with the new one
        linktxt.value = starterlink + "." + tla;
        
    }
    
}

function trimSpacesAndLfs(w){
	if (w==""){return "";}
    var i = 0;
    var c = "";
    dunn = false;
    var ww = w;
    while ((ww.charAt(0) == " " || ww.charAt(0) == "\r" || ww.charAt(0) == "\n") && ww != "") {
        ww = ww.substring(1, ww.length);
    }
    while ((ww.charAt(ww.length - 1) == " " || ww.charAt(ww.length - 1) == "\r" || ww.charAt(ww.length - 1) == "\n") && ww.length > 0) {
        ww = ww.substring(0, ww.length - 1);
    }
    return ww;
}

function clearall(){
    var r = confirm("Clear?")
    if (!r) {
        return
    }
    document.getElementById('ed').value = "<P>";
    document.getElementById('html').innerHTML = "<p>";
    document.getElementById('tagstextarea').value = "";
    document.getElementById('posttitle').value = "";
    gTagNames.length = 0;
    // hide the iframe
    document.getElementById('mtiframe').style.display = "none";
    document.getElementById('googlebtn').value = "Google";
   /* document.getElementById('mtbtn').value = "Blog it"; */
}

function removeSpaces(ss){
    var i, c = "", news = ""
    for (i = 0; i < ss.length; ++i) {
        c = ss.substr(i, 1);
        if (c != " ") {
            news = news + c;
        }
    }
    return news
}

function insertTags(){
    // insert current tags into doc
    var s = createTagString();
    //	alert("Inserttags: "+gTagNames[0] + " : " + gTagNames[1]);
    // get the wsyi text
    var tagspan = document.getElementById('tagspan');
    if (tagspan) {
        tagspan.innerHTML = s;
    }
    else {
        var lastchild = document.getElementById('html').lastChild;
        var newspan = document.createElement("span");
        newspan.innerHTML = s;
        var el = document.getElementById('html');
        el.appendChild(newspan);
    }
	
	// htmlize it and display it
	//Surehtmlize();
    
    
}



function createTagString(){

	// get tags from tag entry box
    var tdiv = document.getElementById('tagstextarea');
    var raw = tdiv.value;
    var gTagNames = new Array();
    gTagNames.length = 0; // reset current tags
    gTagNames = raw.split(",");
    // trim them
    for (var x = 0; x < gTagNames.length; x++) {
		gTagNames[x] = trimSpacesAndLfs(gTagNames[x]);
	}
//     var i = 0;
//      var s =""
//     var ss = "";
//     // normalize 'em
//     for (i = 0; i < gTagNames.length; i++) {
//         // replace spaces with plus signs in anchor
//         var s1 = RegExp(" ", "gi");
//         var s2 = "_";
//         var anchor2 = gTagNames[i].replace(s1, s2);
//         var s1 = RegExp(" ", "gi");
//         var s2 = "+";
//         gTagNames[i] = trimSpacesAndLfs(gTagNames[i]);
//         // replace spaces in the tag in the link
//         gTagNames[i] = gTagNames[i].replace(s1, "+");
//         // if hyphen is first char, blank the anchor
//         if (gTagNames[i].charAt(0) == "-") {
//             anchor2 = "";
//             //gTagNames[i]=gTagNames[i].substring(1);
//         }
//         var urltag = gTagNames[i].replace(s1, s2);
//         // get rid of hyphen as first char
//         if (gTagNames[i].charAt(0) == "-") {
//             urltag = gTagNames[i].substring(1);
//         }
//         ss = "<a href=" + quote2 + "http://www.technorati.com/tag/" + urltag + quote2 + " rel=" + quote2 + "tag" + quote2 + ">" + anchor2 + "</a> ";
//         s = s + ss;
//     }
    //s = s + "]</span>";
    var s = gTagNames.join(",");
    return s
}



function insertWrap(){
    // insert html around the selected text
    getSelectedText();
    var newt = document.getElementById('wrap1textarea').value + seltext + document.getElementById('wrap2textarea').value;
    inserttextatcursor(newt);
    document.location = "#htmleditor";
}

function closeTheHtml(){
    // creates closing element for wrapping html
    var w1 = document.getElementById("wrap1textarea").value;
    // does first element have a <
    var c = w1.indexOf("<");
    if (c > -1) {
        w2 = "</" + w1.substring(1);
        document.getElementById("wrap2textarea").value = w2;
    }
}

function closeOverlay(){
	$("#transoverlay").fadeOut(400);
	$(".panel").hide();
}

function ShowHideDiv(which){
    // show or hide a div
    
    // hide any existing widget in case user hits a button
    // while the widget is still visible
    var existingID = $('#transoverlay').find('div:visible:first').attr("id");
    if ( (existingID !== undefined) && (existingID == which)) {// if hitting the same button
    	$("#" + existingID).fadeOut(300);
    	$("#transoverlay").fadeOut(400);
    	return
    }
    else{
    if (existingID !== undefined) {
    	$("#" + existingID).fadeOut(300);
    	}
    }
    
    // toggle the translucent overlay
    if (which !== "html"){
    	$("#transoverlay").fadeIn(400);
    }
       
    var whichdiv = document.getElementById(which);
    if (( whichdiv.style.display == 'none') || (whichdiv.style.display == "")) { // show it
        $(whichdiv).show("slow");
        if (which == "html") {
            updatehtml();
        }
		// go to it
		switch (which){
			case "linksinnerdiv":
			    document.location = "#linksspot"; 
				break;
			case "imagediv":
			    document.location = "#imagespot"; 
				break;
			case "wrapdiv":
			    document.location = "#wrapspot"; 
				break;
			case "tablediv":
			    document.location = "#tablespot"; 
				break;	
			case "macroexpanddiv":
			    document.location = "#macroexpanddiv"; 
			    break;
			case "postdiv":
				document.location = "#postdive";
			break;					
			
		}
    }
    else 
        $(whichdiv).hide("slow");
}

// -- RESIZE THE WYSI DISPLAY AREA
function resizeWysiDisplay(w){
	//var w = prompt("Enter percent for wysiswyg display area, from 5-90");
	//if (isNaN(w)) {
	//	alert(s + " is not a number.")
	//	return
	//}
	// so it is a number
	
	// is it default?
	if (w == -1) { // use QuickResize
	  // get state of the btn
	  var el = document.getElementById("resizewysibtn");
	  var lbl = el.value;
	  var ww;
	  if (lbl == "QuickResize") {
	  	  ww = QuickResizePercent;
		  el.value="ReturnSize";
	  }
	  else {
	  	ww = defaultWysiAreaWidth;
		// strip off percent
		ww = ww.substr(0, ww.length-1);
		el.value="QuickResize";
	  }
	
	  // turn it into pixels
	  var totalw = window.innerWidth; 
	  w = totalw * ((100 - ww) / 100);
	}
	
	if (w < 100){
	//alert("Too small");
	return;
	}
	
	// turn it into percentage
	var resizeel = document.getElementById("sizingbardiv");
	var totalw = window.innerWidth; //(resizeel.style.offsetWidth); // removes the "px" at the end
	var ew = w;
	var ww = totalw - w; 
	editAreaWidth = Math.round((ew / totalw) * 100);
	wysiAreaWidth = 100 - editAreaWidth;
	// expects percentages
	editAreaWidth = editAreaWidth + "%";
	wysiAreaWidth = wysiAreaWidth + "%";
	
	sizeEditAndWysiAreas();
}



function doFTP(){
    var ftpurl = "ftp://evident:soph1a--@hyperorg.com";
    //window.location=ftpurl;
    window.open(ftpurl, "FTP blogdraft");
}

function openFTPsite(){

    var username = "evident";
    var password = "sop;h1a--";
    var server = "evident.com;"
    if (username && password && server) {
        //var ftpsite = "ftp://" + username + ":" + password + "@" + server;
        var ftpsite = "ftp://evident:soph1a--@hyperorg.com";
        window.location = ftpsite;
    }
}



function updateStatus(txt){
    var d = document.getElementById('updatebox');
    d.innerHTML += "<br>" + txt;
}


// ---------- TRIM
String.prototype.trim = function(){
    // Strip leading and trailing white-space
    return this.replace(/^\s*|\s*$/g, "");
}
// ---------- STRIP SPACES
String.prototype.stripSpaces = function(){
    return this.replace(/\s/g, "");
}
