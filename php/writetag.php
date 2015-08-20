<?php
//$tagtowrite= $_POST['mydata'];
//echo  $tagtowrite;
$tags = $_REQUEST['tags'];
$times = $_REQUEST['times'];

$numberOfTags = count($tags);
$s = "";

for ($i=0; $i < $numberOfTags; $i++){
	$s= $s . $tags[$i] . "|" . $times[$i];
	if ($i < $numberOfTags - 1){
		$s = $s . "\n";
	}
}

$myFile = "../data/blogdraft_tags.txt";
$fh = fopen($myFile, 'w') or die("can't open file");
fwrite($fh, $s);
fclose($fh);

echo $numberOfTags . " written.";

?>