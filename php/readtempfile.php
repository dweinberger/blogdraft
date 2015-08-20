<?php

$file = fopen("blogdraft_copies/blogdraft_temp_save.txt", "r") or exit("Unable to open file!");
//Output a line of the file until the end is reached
$s="";
while(!feof($file))
  {
  $s1=fgets($file);
  $s=$s . $s1;
  }
fclose($file);
echo $s;
?>