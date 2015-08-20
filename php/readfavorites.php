<?php
$file = fopen("/Applications/MAMP/htdocs/blogdraft/data/blogdraft_favorites.txt", "r") or exit("Unable to open file!"); 
$s="";
while(!feof($file)){
  $s1=fgets($file);
  $s=$s . $s1;
  }
fclose($file);
echo $s;
?>