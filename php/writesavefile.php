<?php
$bodytext = $_POST['savedbody'];
$titletext = $_POST['savedtitle'];
$internaltitle = $_POST['internaltit'];
$tagstxt = $_POST['tags'];
$myFile =  $titletext;
$myFilePath = "../blogdraft_saved_files/" . $myFile;

$fh = fopen($myFilePath,"w" ) or die("Cannot open save file: " . $internaltitle);

fwrite($fh, "TITLE: " . $internaltitle . "\nBODY: " . $bodytext . "\nTAGS: " . $tagstxt);
fclose($fh);
/* echo $titletext . " saved - via writesavefile.php"; */

?>