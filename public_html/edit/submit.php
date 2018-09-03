<?php
$username = $_GET['username'];
$password = $_GET['password'];
$name = $_GET['name'];
$grade = $_GET['grade'];
$stream = $_GET['stream'];
$courses = $_GET['courses'];
$reqlen = $_GET['reqlen'];
$requests = $_GET['requests'];

$login = fopen('../../data/login.txt', 'r');
$lines = explode("\n", fread($login, filesize('../../data/login.txt')));
fclose($login);

for($i = 0; $i < count($lines); $i++){
	$line = explode(",", $lines[$i]);
	if($line[0] == $username){
		if($line[1] != $password){
			echo -2;
			exit(0);
		}
	}
}

function bad(){
	echo -1;
	exit(0);
}

function check($str){
	for($i = 0; $i < strlen($str); $i++){
		if($str[$i] == "," || $str[$i] == "\n"){
			bad();
		}
	}
}

function check2($str){
	for($i = 0; $i < strlen($str); $i++){
		if($str[$i] == "\n"){
			bad();
		}
	}
}

function comma($str){
	$cnt = 0;
	for($i = 0; $i < strlen($str); $i++){
		if($str[$i] == ","){
			++$cnt;
		}
	}
	return $cnt;
}

check($username);
check($name);
check($grade);
check($stream);
check($reqlen);
check2($courses);
check2($requests);

if(comma($courses) != 7) bad();
if($reqlen != 0 && comma($requests) != $reqlen * 3 - 1) bad();
if($reqlen == 0) $requests = "";

$coursef = fopen('../../data/courses.txt', 'r');
$lines = explode("\n", fread($coursef, filesize('../../data/courses.txt')));
fclose($coursef);
$dump = "";

for($i = 0; $i < count($lines); $i++){
	if($lines[$i] == "") continue;
	$line = explode(",", $lines[$i]);
	$user = $line[0];
	if($user != $username)
		$dump = $dump . $lines[$i] . "\n";
}
$dump = $dump . $username . "," . $name . "," . $grade . "," . $stream . "," . $courses . "," . $reqlen . "," . $requests . "\n";

$coursef = fopen('../../data/courses.txt', 'w');
fwrite($coursef, $dump);
fclose($coursef);
echo 0;
?>
