$('head').append('<title>Timetables</title>');
$.get('../navbar.html', function(data){
	$('nav').html(data);
});
