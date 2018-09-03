<?php
$username = $_GET['username'];
$password = $_GET['password'];

$login = fopen('../../data/login.txt', 'r');
$lines = explode("\n", fread($login, filesize('../../data/login.txt')));
fclose($login);

for($i = 0; $i < count($lines); $i++){
	$line = explode(",", $lines[$i]);
	if($line[0] == $username){
		if($line[1] == $password) echo 0;
		else echo -1;
		exit(0);
	}
}
?>

