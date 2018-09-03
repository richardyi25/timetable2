<?php
$courses = fopen('../../data/courses.txt', 'r');
$raw = fread($courses, filesize('../../data/courses.txt'));
fclose($courses);
echo $raw;
?>
