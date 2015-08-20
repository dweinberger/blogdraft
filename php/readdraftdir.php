
<?php
$dirname = "./blogdraft_drafts";
$dh = opendir( $dirname );
while ( gettype( $file = readdir( $dh )) != boolean ){
   if ( is_dir( "$dirname/$file" ) )
       print "(D)";
   print "$file<br>";
}
closedir( $dh );
?>