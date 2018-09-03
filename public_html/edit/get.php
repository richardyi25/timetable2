<?php
$username = $_GET['username'];

$courses = fopen('../../data/courses.txt', 'r');
$lines = explode("\n", fread($courses, filesize('../../data/courses.txt')));
fclose($courses);

for($i = 0; $i < count($lines); $i++){
	if($lines[$i] == "") continue;
	$line = explode(",", $lines[$i]);
	$user = $line[0];
	$reqlen = $line[12];
	if($username == $user){
		for($j = 1; $j < 13 + $reqlen * 3; $j++)
			echo $line[$j] . ",";
		exit(0);
	}
}
?>
