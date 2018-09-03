var username, password;
function popup(title, body){
	$('#modal h5').text(title);
	$('#modal .modal-body').html(body);
	$('#modal').modal();
}

function result(data){
	console.log(data);
	data = $.trim(data);
	if(data == '0'){
		Cookies.set('username', username);
		Cookies.set('password', password);
		$('.content').css('text-algin', 'center');
		$('.content').html('<h2>Registration Successful!</h2>');
		window.setTimeout(function(){
			window.location.href = '../edit';
		}, 500);
	}
	else popup('Error', 'Error registering. Please try a different username.');
}

function click(){
	username = $('#username').val();
	password = $('#password').val();
	var conf = $('#conf-pass').val();

	if(username.length == 0) return popup('Invalid Username', 'Please enter a username.');
	if(password.length == 0) return popup('Invalid Password', 'Please enter a password.');

	var ch;
	if(username.indexOf(',') >= 0)
		return popup('Invalid Username', 'Please do not use special characters in your username.');
	if(password.indexOf(',') >= 0)
		return popup('Invalid Username', 'Please do not use special characters in your username.');

	if(password != conf)
		return popup('Invalid Password', 'Passwords do not match. Please try again.');

	$.get('../register/register.php', {
		username: username,
		hash: md5(password)
	}, result);
}

$(document).ready(function(){
	$('#register').click(click);
	$('#conf-pass').keydown(function(e){
		if(e.key == 'Enter') click();
	});
	$('#tos').click(function(){
		popup('Terms of Service', '<ul><li>By entering your name/courses, you acknowledge that the information is publicly available on the internet.</li><li>You must enter your own courses; you may not enter another person\'s courses without their explicit permission.</li><li>This website is not liable for anything that happens on it.</li></ul>');
	});
});
