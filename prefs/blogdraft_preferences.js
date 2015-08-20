// ================== ADJUSTABLE PREFERENCES =====================
// Feel free to edit these.

// url of page where you create posts
var BlogPosterURL = "http://www.PATH_TO_YOUR_WORDPRESS_INSTALLATION/wp-admin/post-new.php";
// Google search form address
var googleSearchApiAddress = "http://PATH_TO_YOUR_HTDOCS/blogdraft/includes/google_api_search.html"
//var googleSearchApiAddress = "https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.jsø";
// email address so can insert email with @ as a graphic to fool the spam harvesters
var email1 = "david"; // before the at sign
var email2 = "weinberger.org"; // after the at sign
var atsign = "http://www.YOUR_PATH/blogger/images/atsign.png"; // path to the at sign on the server
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

// Size of largest and smallest fonts in the tagcloud
var largestfont = 24;
var smallestfont = 6;
// How many times does a tag have to be used to show up in the tag cloud?
var tagThreshhold = 2;
// name and path of automatic save file made while writing
var tempSaveFile = "blogdraft_temp_save.txt";
// include tags at end of post?
var includeTags = false;
// when inserting twitter link, make anchor text person's handle ("HANDLE") or any other word?
var gtweetanchor = "HANDLE";

// List your categories. The names have to be the same as the names in WordPRess
// These will show up as checkboxes when you post to WordPRess.
var catlist = new Array('cat1','cat2'
	);

updateStatus(catlist.length + " categories loaded.");