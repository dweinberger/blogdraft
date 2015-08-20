<?php
$bodytext = $_POST['savedbody'];
$titletext = $_POST['savedtitle'];
$internaltitle = $_POST['internaltit'];
$tagstxt = $_POST['tags'];
$myFile = "../blogdraft_drafts/" . $titletext;

$fh = fopen($myFile,"w" ) or die("Cannot open file save file");

fwrite($fh, "TITLE: " . $internaltitle . "\nBODY: " . $bodytext . "\nTAGS: " . $tagstxt);
fclose($fh);
/* echo $titletext . " saved - via writesavefile.php"; */

?>