<?php
$myFile = "../data/blogdraft_links.txt";
$fh = fopen($myFile, 'a') or die("Can't open file blogdraft_favorites.txt");
$stringData = $_POST['newline'];
fwrite($fh, $stringData);
fclose($fh);

?>