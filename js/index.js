/**
 * @author ZhangRui
 */

$(function() {
	$('#login').dialog({
		autoOpen : false,
		width : 600,
		modal : true,
		buttons : {
			"好吧……" : function() {
				window.location = "http://www.hongdunju.com/member.php?mod=logging&action=login&referer=http%3A%2F%2Fwww.hongdunju.com%2Fforum.php" //重定向至登录页面
			},
			"把你的脏手拿开！" : function() {
				window.location = "http://www.hongdunju.com/member.php?mod=logging&action=login&referer=http%3A%2F%2Fwww.hongdunju.com%2Fforum.php" //依旧重定向至登录页面
			}
		}
	});
	//check
	$.get("http://www.hongdunju.com/tasksystem/index.php/task/GProxy/group.groupTitle", function(data) {
		alert(data);
		if (data == "" || data == null) {
			$('#login').dialog('open');
		}
	});

	var uid;
	var uname;
	$.get("http://www.hongdunju.com/tasksystem/index.php/task/GProxy/uid", function(data) {
		uid = data;
		if (uid == null || uid === 0) {
			$('#login').dialog('open');
		}
		$("#info img").attr("src", "http://hongdunju.com/tasksystem/../uc_server/avatar.php?uid=" + uid + "&amp;size=small");
	});
	$.get("http://www.hongdunju.com/tasksystem/index.php/task/GProxy/username", function(data) {
		uname = data;
		$("#info h5").html("uname");
	});

	// create color set
	var colorarray = new Array("#CB1B45", "#F7C242", "#86C166", "#9B90C2", "#DC9FB4");
	//IE
	if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
		$("#guide").prepend("<li><strong>您还在使用IE浏览器。如果想要获得完整体验，可以试试<a href='http://www.google.cn/chrome/intl/zh-CN/landing_chrome.html?hl=zh-CN'>chrome</a>或者<a href='http://firefox.com.cn/'>FireFox</a></strong></li>");
	}

	//personal
	$(".p-header").click(function() {
		$(".article").slideToggle("slow");
	});

	//show tasks
	var taskarray;
	// 获取所有任务  http://www.hongdunju.com/tasksystem/index.php/
	$.post("http://www.hongdunju.com/tasksystem/index.php/task/getAll/", function(data) {
		taskarray = eval(data);
		$("#taskboard").html(init(taskarray));
		display();
	});

	function init(taskarray) {
		var tdom = "";
		for (var task in taskarray) {
			tdom += "<span class='title'>" + task.tname + "</span>";
			tdom += "<div class='hr'></div>";
			tdom += "<div id='t" + task.id * 2 + "' class='tetris'>";
			for (var squ in task.tetris) {
				tdom += "<div id='t" + task.id * 2 + "_s" + squ.id + "' ";
				if (squ.recipient) {
					tdom += "recipient='" + squ.recipient + "' ";
				}
				if (squ.state == "4") {
					tdom += "complete='true'";
				}
				tdom += ">" + squ.name + "</div>";
			}
			tdom += "</div>";
			tdom += "<div id='t" + (task.id * 2 + 1) + "' class='tetris'>";
			for (var squ in task.other) {
				tdom += "<div id='t" + (task.id * 2 + 1) + "_s" + squ.id + "' ";
				if (squ.recipient) {
					tdom += "recipient='" + squ.recipient + "' ";
				}
				if (squ.state == "4") {
					tdom += "complete='true'";
				}
				tdom += ">" + squ.name + "</div>";
			}
			tdom += "</div>";
		}
		return tdom;
	}

	//query
	$(".search input").click(function() {
		$(this).val("");
	});

	$(".search input").keyup(function() {
		if (event.keyCode == 13) {
			$.post("http://www.hongdunju.com/tasksystem/index.php/task/getAll/query/" + $(this).val, function(data) {
				taskarray = eval(data);
				$("#taskboard").html(init(taskarray));
			});
		}
	});

	//set div color
	function display() {
		// 固定工作固定颜色，任务完成变灰色
		$(".tetris div").each(function() {
			colornum = Math.floor(Math.random() * colorarray.length);
			var s = trim($(this).html());
			if ($(this).attr("complete") == "true") {
				$(this).css("background-color", "#AAAAAA");
			} else if (s == "修图") {
				$(this).css("background-color", "#00AA90");
			} else if (s == "填字") {
				$(this).css("background-color", "#7B90D2");
			} else if (s == "翻译") {
				$(this).css("background-color", "#58B2DC");
			} else if (s == "校对") {
				$(this).css("background-color", "#FB966E");
			} else {
				$(this).css("background-color", colorarray[colornum]);
			}
			if ($(this).attr("complete")) {
				missioncomplete($(this).attr("id"));
			}
			if ($(this).attr("recipient")) {
				$(this).append("<div class='recipient'>" + $(this).attr("recipient") + "</div>");
			}
		});
	}

	//mission control
	$(".tetris > div").click(function() {
		if ($(this).attr("complete")) {
			return false;
		} else if ($(this).attr("recipient")) {
			$("#missioncomplete").attr("currentid", $(this).attr("id"))
			$('#missioncomplete').dialog('open');
		} else {
			$("#missionaccept").attr("currentid", $(this).attr("id"))
			$('#missionaccept').dialog('open');
		}
		return false;
	});

	//TODO 战斗统计区域直接完成任务，暂未实现
	// $(".complete-button").click(function() {
	// $('#missioncomplete').dialog('open');
	// });

	$('#missionaccept').dialog({
		autoOpen : false,
		width : 600,
		modal : true,
		buttons : {
			"交给我吧" : function() {
				missionaccept($(this).attr("currentid"));
				$(this).dialog("close");
			},
			"我还未够班……" : function() {
				$(this).dialog("close");
			}
		}
	});

	$('#missioncomplete').dialog({
		autoOpen : false,
		width : 600,
		modal : true,
		buttons : {
			"没错" : function() {
				missioncomplete($(this).attr("currentid"));
				$(this).dialog("close");
			},
			"不，再等等" : function() {
				$(this).dialog("close");
			}
		}
	});

	// mission complete
	function missioncomplete(divid) {
		var num = Math.floor(Math.random() * 25);
		var div = $("#" + divid);
		var compid = div.attr("id") + "_c1";
		var left = num + 20;
		var top = num + 20;

		//TODO ajax 修改状态 成功后运行以下语句

		div.append("<div id='" + compid + "'>complete</div>");
		div.attr("complete", "true");
		div.css("background-color", "#AAAAAA");

		$("#" + compid).addClass("complete");
		$("#" + compid).css("top", top);
		$("#" + compid).css("left", left);
		$("#" + compid).css("-moz-transform", "rotate(-" + num + "deg)");
		$("#" + compid).css("-webkit-transform", "rotate(-" + num + "deg");
		$("#" + compid).css("-o-transform", "rotate(-" + num + "deg");
		$("#" + compid).css("-ms-transform", "rotate(-" + num + "deg");
		$("#" + compid).css("transform", "rotate(-" + num + "deg");
	}

	function missionaccept(divid) {
		
		//TODO ajax 修改状态 成功后运行以下语句
		
		var div = $("#" + divid);
		div.append("<div class='recipient'>" + uname + "</div>");
		div.attr("recipient", uname);
	}

	function ltrim(s) {
		return s.replace(/^\s*/, "");
	}

	//去右空格;
	function rtrim(s) {
		return s.replace(/\s*$/, "");
	}

	//去左右空格;
	function trim(s) {
		return rtrim(ltrim(s));
	}

});
