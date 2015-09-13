<?php

echo "<html><head><title>Upload results</title></head><body><style>h2{font-family:'Helvetica Neue';}</style>";
echo "<h2>Blogdraft file upload results:</h2>";

// move image to tempdirectory
$target_dir = "images/";
error_log("target dir = " . $target_dir);
echo("target dir: " . $target_dir);

$target_file = $target_dir . basename($_FILES["uploadedfile"]["name"]);
error_log("<br>target file = " . $target_file);
$uploadOk = 1;
$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
error_log("<br>type: " . $imageFileType);

        $uploadOk = 1;
        move_uploaded_file($_FILES['uploadedfile']['tmp_name'], $target_file);
error_log("after move");

echo '<p>' .  $_FILES["uploadedfile"]["name"] . ' saved.';
   

?>