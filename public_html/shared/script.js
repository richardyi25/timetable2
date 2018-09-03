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
	var who = $('#who').val();
	var matches = [];

	$('tbody').empty();
	if(who == 'none') return;

	for(var i = 0; i < lines.length; i++){
		line = lines[i].split(',');
		if(line[i] == who){
			for(var j = 4; j < 12; j++)
				matches[j] = line[j];
		}

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
			if('1234567890'.indexOf(course[3]) != -1) light = 100 - course[3] / 4 * 35;
			else light = 100 - (course.charCodeAt(3) - 65) / 6 * 45;
			assign[course] = 'hsl(' + hue + ', ' + SAT + '%, ' + light + '%)';
		}
		++i;
	}

	for(var i = 0; i < lines.length; i++){
		line = lines[i].split(',');
		res = '<tr>';

		var count = 0;
		for(var j = 4; j < 12; j++)
			if(line[j] == matches[j])
				++count;
		res += '<td style="background-color: hsl(' + count / 10 * 360 + ', 90%, 90%)">' + count + '</td>';

		res += '<td>' + line[1].split(' ').join('<br/>') + '</td>';
		res += '<td style="background-color: hsl(0, 0%, ' + (100 - (line[2] - 9) * 15) + '%);">' + line[2] + '</td>';

		for(var j = 4; j < 12; j++){
			course = line[j];
			match = (course == matches[j]);
			if(course == 'SPARE') res += '<td' + (match ? '' : ' style="background-color:#222222;color:#CCCCCC"') + '>SPARE</td>';
			else{
				res += '<td style="background-color:' + (match ? assign[course] : '#222222;color:#CCCCCC') + ';">' + course.slice(0, 6);
				if(!isNaN(course.slice(6, 8)))
					res += '<br/><span class="dot">' + '•'.repeat(Number(course.slice(6, 8))); + '</span>';
				res += '</td>';
			}
		}
		res += '</tr>';
		$('tbody').append(res);
	}

	$('table').trigger('update');
}

function result(data){
	data = $.trim(data);
	lines = data.split('\n');
	for(var i = 0; i < lines.length; i++){
		line = lines[i].split(',');
		$('#who').append('<option value="' + line[1] + '">' + line[1] + '</option>');
	}
}

$(document).ready(function(){
	$('table').tablesorter();
	$.get('../shared/get.php', result);
	$('select').change(update);
});
