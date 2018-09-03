<?php
$username = $_GET['username'];
$hash = $_GET['hash'];

$login = fopen('../../data/login.txt', 'r');
$lines = explode("\n", fread($login, filesize('../../data/login.txt')));
fclose($login);

for($i = 0; $i < count($lines); $i++){
	if($lines[$i] == '') continue;
	$line = explode(",", $lines[$i]);
	$user = $line[0];
	$pass = $line[1];
	if($username == $user){
		if($hash == $pass)
			echo 0;
		else
			echo -1;
		exit(0);
	}
}
echo -2;
?>

