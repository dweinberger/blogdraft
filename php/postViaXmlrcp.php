<?php 

// Modified from:
// http://www.hurricanesoftwares.com/wordpress-xmlrpc-posting-content-from-outside-wordpress-admin-panel/
// Thanks!!
 
require_once("IXR_Library.php.inc"); 
$client->debug = true; //Set it to false in Production Environment 

$title=$_REQUEST['title'];
$body=$_REQUEST['body'];
$keywords=$_REQUEST['tags'];
$category=$_REQUEST['categoryArray'];
$postmode=$_REQUEST['postmode']; // "post" or "draft"
$customfields=null;
     
$encoding = ini_get("default_charset");       
$title = htmlentities($title,ENT_QUOTES,$encoding); 
$keywords = htmlentities($keywords,ENT_QUOTES,$encoding); 
 
$content = array( 
                 'title'=>$title, 
                 'description'=>$body, 
                 'mt_allow_comments'=>1, // 1 to allow comments 
                 'mt_allow_pings'=>1, // 1 to allow trackbacks 
                 'post_type'=>'post', 
                 'mt_keywords'=>$keywords,  
                 'categories'=>$category,
                 'custom_fields' => array($customfields) 
              ); 
 
// Create the client object 
$client = new IXR_Client('http://www.hyperorg.com/blogger/xmlrpc.php');
$username = "YOUR_WP_ADMIN_USER_NAME"; 
$password = "YOUR_WP_ADMIN_PASSWORD"; 

if ($postmode == "post"){
	$livepost = true;
}
else {
	$livepost = false;
}
 
$params = array(0,$username,$password,$content,$livepost); // Last parameter is 'true' which means post immediately, to save as draft set it as 'false' 
 
// Run a query for PHP 
if (!$client->query('metaWeblog.newPost', $params)) { 
        die('Something went wrong - '.$client->getErrorCode().' : '.$client->getErrorMessage()); 
   } else { echo "Article Posted Successfully"; } ?>