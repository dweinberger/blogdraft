// ================== ADJUSTABLE PREFERENCES =====================
// Feel free to edit these.

// url of page where you create posts
var BlogPosterURL = "http://YOUR_WP_ADDRESS/wp-admin/post-new.php";
// Google search form address
var googleSearchApiAddress = "http://127.0.0.1/~YOURUSERNAME/blogdraft/includes/google_api_search.html"
//var googleSearchApiAddress = "https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.jsø";
// email address so can insert email with @ as a graphic to fool the spam harvesters
var email1 = "YOURNAME"; // before the at sign
var email2 = "YOUR EMAILHOST; // after the at sign
var atsign = "http://YOUR_WP_INSTALL/images/atsign.png"; // path to the at sign on the server
var atsignwidthandheight = "11";
var autoCompleteKey = 39; // key that accepts a suggested tag completion. (39 = right arrow)

// how wide should the preview area be initially?
var wysiAreaWidth = "20%"; // width of wysiwyg preview area
var defaultWysiAreaWidth = wysiAreaWidth; // set this for quick resize
var editAreaWidth = "80%"; // these should add up to 100
// begin by showing the preview area? 
var showWysiArea = true;
// For quick resize button, what size should the wysi area be, in percent?
var QuickResizePercent = 50;
// Automatically replace begin and end quotes with straight quotes, during htmlize step?
var straightenQuotes = true;
var KeystrokesBeforeSave = 100; // how many keystrokes before autosave the file?
var updateAfterEveryKeystroke = true; // update the wysiwyg view after each keystroke?
// Alternate the sides of callouts?
var alternateCalloutSides = true;
// Callout side? (If alternating, this is the side it will begin with)
var calloutSide = "RIGHT"; // or "LEFT"?

// -- TAGCLOUD
// show tagcloud if "TRUE." Anything else means don't
var showTagCloud = "TRUE";
// Size of largest and smallest fonts in the tagcloud
var largestfont = 24;
var smallestfont = 6;
// How many times does a tag have to be used to show up in the tag cloud?
var tagThreshhold = 2;

// -- SAVE FILE
// name and path of automatic save file made while writing
var tempSaveFile = "blogdraft_temp_save.txt";
// include tags at end of post?
var includeTags = false;
// when inserting twitter link, make anchor text person's handle ("HANDLE") or any other word?
var gtweetanchor = "HANDLE";

// Create category checkboxes
// 		List the categories you've set up in wordpress. Use exactly
//		the same name here as you do there

var catlist = new Array('category1','anothercategory');
	);
	
// Create one-click symbols
//		List the HTML names of the symbols you want to
//		show up below the editing window. But omit the "&" at 
//		the beginning and the ";" at the end. One click
//		will insert them. For example, the HTML version
//		of the euro symbol (€) is "&euro;" so you'd list "euro"

var symbolslist = new Array('Agrave','aacute','Egrave','Eacute','ntilde','oslash','uuml',
	'ccedil','copy','Uuml','frac12','lt','gt','euro');

updateStatus(catlist.length + " categories loaded.");
updateStatus(symbolslist.length + " symbols loaded.");