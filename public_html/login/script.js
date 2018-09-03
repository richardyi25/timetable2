var username, password;
function popup(title, body){
	$('#modal h5').text(title);
	$('#modal .modal-body').html(body);
	$('#modal').modal();
}

function result(data){
	data = $.trim(data);
	if(data == '-2') popup('Invalid Username', 'No such username. Please try again.');
	else if(data == '-1') popup('Wrong Password', 'Incorrect password. Please try again.');
	else if(data == '0'){
		Cookies.set('username', username);
		Cookies.set('password', password);
		$('.content').html('<h1>Login Successful</h1>You are now logged in. You may <a href="../edit">edit</a> your courses.');
	}
}

function click(){
	username = $('#username').val();
	password = $('#password').val();
	$.get('../login/login.php', {
		username: username,
		hash: md5(password)
	}, result);
}

function loggedIn(){
	$('.content').html('<h1>Session Active</h1>You are already logged in.<hr/><button class="btn btn-primary"><a href="../logout" style="color:white">Logout</a></button>');
}

$(document).ready(function(){
	username = Cookies.get('username');
	password = Cookies.get('password');
	if(username != undefined) loggedIn();
	$('#register').click(click);
	$('#password').keydown(function(e){
		if(e.key == 'Enter') click();
	});
});
