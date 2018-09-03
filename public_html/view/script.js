var lines, line, courses = {}, reqlen, res, first, bucket = {}, assign = {}, course, cgrade, cstream, ctaking;
const SAT = 90;

var streams = {
	academic: 'Academic',
	gifted: 'Gifted',
	macs: 'MaCS',
	esl: 'ESL',
	other: 'Other'
};

function popup(title, body){
	$('#modal h5').text(title);
	$('#modal .modal-body').html(body);
	$('#modal').modal();
}

function update(){
	courses = {};
	bucket = {};
	assign = {};
	var fgrade = $('#grade').val(), fstream = $('#stream').val(), ftaking = $('#taking').val().toUpperCase();

	$('tbody').empty();

	try{
		var r = RegExp(ftaking);
	}
	catch(e){
		ftaking = '';
	}

	for(var i = 0; i < lines.length; i++){
		line = lines[i].split(',');
		for(var j = 4; j < 12; j++){
			courses[line[j]] = true;
			first = line[j][0];
			if(bucket[first] == undefined)
				bucket[first] = [];
			bucket[first].push(line[j]);
		}
	}

	var i = 0, temp, len = Object.keys(bucket).length, span = 360/len, span2, course, hue, light, match, showf, showm;
	for(var key in bucket){
		temp = bucket[key];
		span2 = span/temp.length;
		base = i * span;

		for(var j = 0; j < temp.length; j++){
			course = temp[j];
			hue = base + span2 * j;
			if('1234567890'.indexOf(course[3]) != -1) light = 90 - (course[3] - 1) * 15;
			else light = 100 - (course.charCodeAt(3) - 65) / 6 * 45;
			assign[course] = 'hsl(' + hue + ', ' + SAT + '%, ' + light + '%)';
		}
		++i;
	}

	for(var i = 0; i < lines.length; i++){
		match = false;
		line = lines[i].split(',');
		res = '';
		res += '<td>' + line[1].split(' ').join('<br/>') + '</td>';
		res += '<td style="background-color: hsl(0, 0%, ' + (100 - (line[2] - 9) * 15) + '%);">' + line[2] + '</td>';
		for(var j = 4; j < 12; j++){
			course = line[j];
			match |= (course.match(ftaking) != null);
			if(course == 'SPARE') res += '<td' + ((ftaking != '' && course.match(ftaking) != null) ? 'style="font-weight:bold;"' : '') + '>SPARE</td>';
			else{
				res += '<td style="background-color:' + assign[course] + ';' + ((ftaking != '' && course.match(ftaking) != null) ? 'font-weight:bold;"' : '') + '">' + course.slice(0, 6);
				if(!isNaN(course.slice(6, 8)))
					res += '<br/><span class="dot">' + '•'.repeat(Number(course.slice(6, 8))); + '</span>';
				res += '</td>';
			}
		}
		cgrade = line[2];
		cstream = line[3];
		if((fgrade == 'any' || fgrade == cgrade) && (fstream == 'any' || fstream == cstream) && (ftaking == '' || match)){
			$('#table-filtered tbody').append('<tr>' + res + '</tr>');
			$('#table-main tbody').append('<tr style="visibility:collapse">' + res + '</span>');
			showf = true;
		}
		else{
			$('#table-main tbody').append('<tr>' + res + '</tr>');
			$('#table-filtered tbody').append('<tr style="visibility:collapse">' + res + '</span>');
			showm = true;
		}
	}

	if(showf) $('#table-filtered thead').show();
	else $('#table-filtered thead').hide();
	if(showm) $('#table-main thead').show();
	else $('#table-main thead').hide();

	$('table').trigger('update');
}

function result(data){
	data = $.trim(data);
	lines = data.split('\n');
	update();
	$('#taking').autocomplete({
		source: Object.keys(courses)
	});
}

$(document).ready(function(){
	$('table').tablesorter();
	$.get('../view/get.php', result);
	$('input').keyup(update);
	$('select').change(update);
	$('#match-tip').click(function(e){
		e.preventDefault();
		popup('Course Matching', 'This field will match any course that contains all the characters you enter. It also matches JavaScript regular expressions.');
	});
});
