var lines;
var period = [
	undefined,
	'Semester 1 Period 1',
	'Semester 1 Period 2',
	'Semester 1 Period 3',
	'Semester 1 Period 4',
	'Semester 2 Period 1',
	'Semester 2 Period 2',
	'Semester 2 Period 3',
	'Semester 2 Period 4'
];

function popup(title, body){
	$('#modal h5').text(title);
	$('#modal .modal-body').html(body);
	$('#modal').modal();
}

function update(){
	$('tbody').empty();
	var fperiod = $('#period').val(), frequested = $('#requested').val(), fdropping = $('#dropping').val();
	var rrequested, rdropping;
	try{
		rrequested = new RegExp(frequested);
		rdropping = new RegExp(rdropping);
	}
	catch(e){
		rrequested = '';
		rdropping = '';
	}

	for(var i = 0; i < lines.length; i++){
		line = lines[i].split(',');
		var reqlen = line[12];
		var res, resbase = '';
		var showf, showm;
		resbase += '<td>' + line[1].split(' ').join('<br/>') + '</td>';
		resbase += '<td style="background-color: hsl(0, 0%, ' + (100 - (line[2] - 9) * 15) + '%);">' + line[2] + '</td>';
		for(var j = 0; j < reqlen; j++){
			res = resbase;
			res += '<td style="background-color:hsl(' + line[13 + j * 3] / 9 * 360 + ', 90%, 90%)">' + period[line[13 + j * 3]] + '</td>';
			res += '<td>' + line[14 + j * 3] + '</td>';
			res += '<td>' + line[15 + j * 3] + '</td>';

			if((fperiod == 'any' || fperiod == line[13 + j * 3]) && (frequested == '' || line[14 + j * 3].match(rrequested)) && (fdropping == '' || line[15 + j * 3].match(rdropping))){
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
}

function result(data){
	var line;
	data = $.trim(data);
	lines = data.split('\n');
	var courses = {};
	for(var i = 0; i < lines.length; i++){
		var line = lines[i].split(',');
		for(var j = 4; j < 12; j++)
			courses[line[j]] = true;
		for(var j = 13; j < 13 + line[12] * 3; j++)
			if(j % 3 != 1)
				courses[line[j]] = true;
	}
	$('#requested, #dropping').autocomplete({
		source: Object.keys(courses)
	});
	update();
}

$(document).ready(function(){
	$.get('../view/get.php', result);
	$('input').keyup(update);
	$('select').change(update);
});
