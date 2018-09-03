var username, password;

function popup(title, body){
	$('#modal h5').text(title);
	$('#modal .modal-body').html(body);
	$('#modal').modal();
}

function add(){
	$('#requests').append('<div class="row input-group"><div class="col"><select class="form-control slot"><option value="1">Semester 1, Period 1</option><option value="2">Semester 1, Period 2</option><option value="3">Semester 1, Period 3</option><option value="4">Semester 1, Period 4</option><option value="5">Semester 2, Period 1</option><option value="6">Semester 2, Period 2</option><option value="7">Semester 2, Period 3</option><option value="8">Semester 2, Period 4</option></select></div><div class="col"><input type="text" class="form-control request" placeholder="Course Requested"></div><div class="col"><input type="text" class="form-control drop" placeholder="Course to Drop"/></div></div></div>');
}

function getResult(data){
	var courses = data.split(',');
	$('#name').val(courses[0]);
	$('#grade').val(courses[1]);
	$('#stream').val(courses[2]);
	for(var i = 3; i < 11; i++)
		$($('#courses input')[i - 3]).val(courses[i]);
	var reqlen = courses[11];
	for(var i = 0; i < reqlen; i++)
		add();
	for(var i = 12, j = 0; i < 12 + reqlen * 3; i += 3, j++){
		$($('#requests > .row .slot')[j]).val(courses[i]);
		$($('#requests > .row .request')[j]).val(courses[i + 1]);
		$($('#requests > .row .drop')[j]).val(courses[i + 2]);
	}
}

function result(data){
	console.log(data);
	data = $.trim(data);
	if(data == '0')
		popup('Saved', 'Courses successfully saved.');
	else{
		if(data == '-2'){
			popup('Error', 'Failed to save. Please make sure you did not enter any special characters.');
			Cookies.remove('username');
			Cookies.remove('password');
			$('.content').html('<h1>Invalid Session</h1>Something went wrong. Please <a href="../login">login</a> again.');
		}
		else
			popup('Error', 'Failed to save. Please make sure you did not enter any special characters.');
	}
}

function click(){
	username = Cookies.get('username');
	password = Cookies.get('password');

	var name = $('#name').val(), grade = $('#grade').val(), stream = $('#stream').val();
	if(name == '')
		return popup('Invalid Name.', 'Name cannot be empty.');
	if(name.indexOf(',') >= 0)
		return popup('Invalid Name.', 'Please do not use special characters in your name.');
	var courses = Array(8);
	var message = '';
	for(var i = 0; i < 8; i++){
		courses[i] = $($('#courses input')[i]).val().toUpperCase().split('-').join('');
		if(courses[i].indexOf(',') >= 0) message += courses[i] + '<br/>';
	}
	if(message.length > 0) return popup('Invalid Course(s)', 'Please make sure the following courses do not have special characters: <hr/>' + message);

	var bad = 0;
	var requests = [];
	message = '';
	var len = $('#requests > .row').length;
	for(var i = 0; i < len; i++){
		if($($('#requests > .row .request')[i]).val() == '' && $($('#requests > .row .drop')[i]).val() == ''){
			++bad;
			continue;
		}
		requests.push($($('#requests > .row .slot')[i]).val());
		requests.push($($('#requests > .row .request')[i]).val());
		requests.push($($('#requests > .row .drop')[i]).val());
	}
	len -= bad;
	for(var i = 0; i < len * 3; i++)
		if(requests[i].indexOf(',') >= 0) message += requests[i] + '<br/>';
	if(message.length > 0) return popup('Invalid Course(s)', 'Please make sure the following courses do not have special characters: <hr/>' + message);

	$.get('../edit/submit.php', {
		username: username,
		password: md5(password),
		name: name,
		grade: grade,
		stream: stream,
		courses: courses.join(),
		reqlen: len,
		requests: requests.join()
	}, result);
}

function verify(data){
	data = $.trim(data);
	if(data == 0) return;
	else{
		Cookies.remove('username');
		Cookies.remove('password');
		$('.content').html('<h1>Invalid Session</h1>Something went wrong. Please <a href="../login">login</a> again.');
	}
}

$(document).ready(function(){
	username = Cookies.get('username');
	password = Cookies.get('password');
	if(username === undefined){
		$('.content').html('<h1>Session Error</h1>You are not logged in. Please <a href="../login">login</a>.');
		return;
	}
	else{
		$.get('../edit/ok.php', {
			username: username,
			password: md5(password)
		}, verify);
		$.get('../edit/get.php', {username: username}, getResult);
	}

	$('#submit').click(click);
	$('#lastCourse').keydown(function(e){
		if(e.key == 'Enter') click();
	});

	$('#add').click(add);

	$('#remove').click(function(){
		var ele = $('#requests > .row');
		$(ele[ele.length - 1]).remove();
	});

	$('#whats-this').click(function(){
		popup('Course Requests', 'This feature allows you to indicate that you wish to have/drop certain courses for certain time slots.');
	});
});
