<?php

ini_set('display_errors','On');
error_reporting(E_ALL);

$searchterm = $_POST['searchterm'];
$search = urlencode($searchterm);

//WORKS $uri ="https://en.wikipedia.org/w/api.php?action=query&format=jsonfm&list=search&srsearch=" . $searchterm,
$uri ="https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=" . $search;


error_log("QUERY: $uri");
   
$file = file_get_contents($uri);
die($file);

echo $file;
?>