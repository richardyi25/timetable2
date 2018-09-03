<?php
$username = $_GET['username'];
$hash = $_GET['hash'];

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

check($username);
check($hash);

$login = fopen('../../data/login.txt', 'r');
$lines = explode("\n", fread($login, filesize('../../data/login.txt')));
fclose($login);

for($i = 0; $i < count($lines); $i++){
	$user = explode(",", $lines[$i])[0];
	if($username == $user){
		bad();
	}
}

$login = fopen('../../data/login.txt', 'a');
fwrite($login, $username . ',' . $hash . "\n");
fclose($login);

echo 0;
?>
