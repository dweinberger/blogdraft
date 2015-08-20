<?php

ini_set('display_errors','On');
error_reporting(E_ALL);

$searchterm = $_POST['searchterm'];
$search = urlencode($searchterm);

//WORKS $uri ="http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q=Earth%20Day";
$uri ="http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q=" . $search;


error_log("QUERY: $uri");
   
$file = file_get_contents($uri);
die($file);

echo $file;
?>