/**
 * @author ZhangRui
 */

$(function() {
	//关闭新增框体
	$(".p-header").click(function (){
		$("#taskboard").slideUp("slow");
	});
	
	//打开/关闭详细信息框
	$(".m").click(function () {
		$("#"+$(this).attr("id")+"_d").toggle();
	});
	
	//新增
	$(".menu-add").click(function () {
		$("#taskboard").slideDown("slow");
		$("#taskname").val("");
		$("#tag_c").html("<span class=\"tags\">翻译<img class=\"del_icon\" src='css/img/delete.png'/></span><span class=\"tags\">修图<img class=\"del_icon\" src='css/img/delete.png'/></span><span class=\"tags\">涂白<img class=\"del_icon\" src='css/img/delete.png'/></span><span class=\"tags\">填字<img class=\"del_icon\" src='css/img/delete.png'/></span><span class=\"tags\">校对<img class=\"del_icon\" src='css/img/delete.png'/></span>");
	});

	//添加任务内容 TODO 任务内容文本不会自动换行……待修复
	$("#tagautocomplete").keyup(function(e) {
		if(e.keyCode==13) {
			if($("#tag_c").children().length > 9) {
				$().toastmessage('showToast',{
					text : "给跪了，任务内容数目还没法超过10个……",
					stayTime: 3000,
					sticky: false,
					type: 'warning',
					position: 'middle-center'
				});
				return;
			}
			$("#tag_c").append("<span class=\"tags\">"+$(this).val()+"<img class=\"del_icon\" src='css/img/delete.png'/></span>");
			$(this).val("");
		}
	});
	
	//删除任务内容
	$(".tags").live('mouseover',function() {
		$(this).children(".del_icon").css("display","block");
	});
	
	$(".tags").live('mouseout',function() {
		$(this).children(".del_icon").css("display","none");
	});
	
	$(".del_icon").live("click",function() {
		$(this).parent().remove();
	});
	
	//提交
	$("#submit").click(function () {
		$().toastmessage('showToast',{
			text : "新的任务已提交。",
			stayTime: 3000,
			sticky: false,
			type: 'warning',
			position: 'middle-center'
		});
	});
	
	//任务完结
	$(".finish").click(function () {
		$("#finish").dialog("open");
	});
	
	//任务完结提示框配置
	$('#finish').dialog({
		autoOpen : false,
		width : 600,
		modal : true,
		buttons : {
			"没错，干得好，探员！" : function() {
				$(this).dialog("close");
			},
			"你这么认为吗，探员？" : function() {
				$(this).dialog("close");
			}
		}
	});
	
	//去左空格;
	function ltrim(s) {
		return s.replace(/^\s*/, "");
	}

	// 去右空格;
	function rtrim(s) {
		return s.replace(/\s*$/, "");
	}

	// 去左右空格;
	function trim(s) {
		return rtrim(ltrim(s));
	}

});
