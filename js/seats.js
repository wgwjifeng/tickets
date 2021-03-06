$(function(){
	var colNum = 27;
	var money = 0;
	var findPhone = "";
	var codeResult = 0;
	var judgeResult =0;
	var phoneCodeResult = 0;
	var submmitted = 0;
	/* remove seats which not exist */
	function removeSomeSeats(){
		$("#seats-container #seat-1-1").remove();
		$("#seats-container #seat-1-2").remove();
		$("#seats-container #seat-1-3").remove();
		$("#seats-container #seat-1-4").before($("<div></div>").css({"width":"72px","height":"10px","float":"left"}));
		$("#seats-container #seat-2-1").remove();
		$("#seats-container #seat-2-2").remove();
		$("#seats-container #seat-2-3").before($("<div></div>").css({"width":"48px","height":"10px","float":"left"}));
		$("#seats-container #seat-3-1").remove();
		$("#seats-container #seat-3-2").before($("<div></div>").css({"width":"24px","height":"10px","float":"left"}));
		$("#seats-container #seat-1-25").remove();
		$("#seats-container #seat-1-26").remove();
		$("#seats-container #seat-1-27").remove();
		$("#seats-container #seat-2-26").remove();
		$("#seats-container #seat-2-27").remove();
		$("#seats-container #seat-3-27").remove();
	}
	removeSomeSeats();
	$(".seat-item").each(function(){
		if($(this).attr("state")==1){
			$(this).css("background-color","#888");
		}else if($(this).attr("state")==2){
			$(this).css("background-color","#66B");
		}else if($(this).attr("rank")==1){
			/* VIP */
			$(this).css("background-color","#FD9B03");
		}else if($(this).attr("rank")==2){
			/* rank 2 */
			$(this).css("background-color","#E0EA51");
		}else if($(this).attr("rank")==3){
			/* rank 3 */
			$(this).css("background-color","#A9EF68");
		}
	});
	function seat_item_click(){
		if($(this).attr("state")==0){
			if($(this).attr("select")==0){
				$("#seat-choosen ul").append('<li id="selected-'+$(this).attr("row")+'-'+$(this).attr("col")+'" class="choosen-item">'+$(this).attr("row")+"排"+$(this).attr("num")+"号 ¥"+getSeatPrice($(this).attr("rank"))+'<span><img src='+getDelePic()+'></span></li>');
				$("#buy-form").append('<input type="hidden" id="hidden-'+$(this).attr("row")+'-'+$(this).attr("col")+'" value="'+((parseInt($(this).attr("row"))-1)*colNum + parseInt($(this).attr("col")))+'" name="seats[]">');
				$(this).addClass('choosen-color');
				$(this).attr("select","1");
				judgeSeat($(this));
				/* change money */
				money+=getSeatPrice($(this).attr("rank"));
				$("#total-money #price").text(money.toFixed(2));
				/* you must add its listener after you add choosen-item */
				$(".choosen-item img").click(function(){
					id = $(this).parents("li").attr("id");
					row = id.split('-')[1];
					col = id.split('-')[2];
					$("#seat-"+row+"-"+col).attr("select",0).removeClass('choosen-color');
					/* change money */
					money-=getSeatPrice($("#seat-"+row+"-"+col).attr("rank"));
					$("#total-money #price").text(money.toFixed(2));
					$("#hidden-"+row+'-'+col).remove();
					/* end of change money */
					$(this).parents("li").fadeOut("500").setTimeout(remove(),500);
				})
				.mouseenter(function(event){
					$(this).fadeTo("500",0.6);
					event.stopPropagation();
				})
				.mouseleave(function(event){
					$(this).fadeTo("500",0.1);
					event.stopPropagation();
				});
				/* end of choosen-item listener */
			}else if($(this).attr("select")==1){
				$(this).removeClass('choosen-color');
				$(this).attr("select","0");
				/* change money */
				money-=getSeatPrice($(this).attr("rank"));
				$("#total-money #price").text(money.toFixed(2));
				/* end of change money */
				$("#hidden-"+$(this).attr("row")+'-'+$(this).attr("col")).remove();
				/* remove seat-choosen li */
				$("#seat-choosen ul #selected-"+$(this).attr("row")+"-"+$(this).attr("col")).fadeOut("500").setTimeout(remove(),500);
			}
		}
	}
	/* add a tip to display seat number */
	function seat_item_mousemove(event){
		var y=10,x=20;
		$("#seat-tip").show().css({
			"display":"block",
			"top":event.pageY+y+"px",
			"left":event.pageX-x+"px"
		}).html("<p>"+$(this).attr("row")+"排"+$(this).attr("num")+"号</p>");
		if($(this).attr("state")==1){
			$("#seat-tip").html("<p>"+$(this).attr("row")+"排"+$(this).attr("num")+"号</p>");
		}else if($(this).attr("state")==2){
			$("#seat-tip").html("<p>"+$(this).attr("row")+"排"+$(this).attr("num")+"号</p>");
		}
		event.stopPropagation();
	}
	/* fade out the tip */
	function seat_item_mouseleave(event){
		$("#seat-tip").fadeOut(10);
		event.stopPropagation();
	}

	/* bind the event */
	if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
		$(".seat-item").bind({"touchend click":seat_item_click,"mousemove":seat_item_mousemove,"mouseleave":seat_item_mouseleave});
	}else{
		$(".seat-item").bind({"click":seat_item_click,"mousemove":seat_item_mousemove,"mouseleave":seat_item_mouseleave});
	}

	
	function group_name_click(){
		$(".group-names").hide();
		$("#"+$(this).attr("href")).show();
		$(".back").show();
		$(".sign").show();
		$("#stage").hide();
	}
	function back_click(){
		$(".group-names").show();
		$(".groups:visible").hide();
		$(this).hide();
		$(".sign").hide();
		$("#stage").show();
	}

	/* bind the event */
	if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
		$(".group-name").bind({"touchend click":group_name_click});
		$(".back").bind({"touchend click":back_click});
	}else{
		$(".group-name").bind({"click":group_name_click});
		$(".back").bind({"click":back_click});
	}

	/* buy-form validate */
	function buy_form_sub_click(){
		
		phoneResult = checkPhone();
		nameResult = checkName();
		ticketResult = checkTicket();
		judgeSeat();
		if(ticketResult==0){
			$("#mymodal").modal("show");
			$("#mymodal .modal-body p").html("亲，请至少选择一个座位！");
			$("#mymodal button").click(function(){
				$("#mymodal").modal("hide");
			});
		}else if(ticketResult==1){
			$("#mymodal").modal("show");
			$("#mymodal .modal-body p").html("亲，不好意思，最多可选10个座位！");
			$("#mymodal button").click(function(){
				$("#mymodal").modal("hide");
			});
		}
		if(phoneResult&&nameResult&&ticketResult==2&&codeResult&&judgeResult&&phoneCodeResult){
			if(submmitted==0){
				$("#buy-form").submit();
				submmitted = 1;
			}
		}
	}

	/* bind the event */
	if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
		$("#buy-form #sub").bind({"touchend click":buy_form_sub_click});
	}else{
		$("#buy-form #sub").bind({"click":buy_form_sub_click});
	}

	/* find-form validate */
	$("#find-form").validate({
		debug:true,
		rules:{
			phone:{
				required:true,phone:true
			}
		},
		errorPlacement:function(error,element){
			element.parent().next().children(".label").html="";
			error.appendTo(element.parent().next().children(".label"));
		},
		messages:{
			phone:{
				required:"<img src="+getWrongPic()+">",phone:"<img src="+getWrongPic()+">"
			}
		},
		success:function(label){
			label.html("<img src="+getRightPic()+">");
			$("#find-button").val("查询中请稍后");
			$.post(getFindUrl(),
			{"phone":$("#find-form #phone").val()},
			function(data){
				$("#find-result #bought p").html("已支付");
				$("#find-result #not-bought p").html("未支付");
				$(".none-result").hide();
				findPhone = $("#find-form #phone").val();
				$("#buy-again-form #phone").val($("#find-form #phone").val());
				$('#buy-again-form input.oids').remove();
				$("#find-button").val("查询");
				res = JSON.parse(data);
				$("#find-result ul div").remove();
				$("#find-result ul li").remove();
				$.each(res,function(index,info){
					if(index==0){
						$.each(info,function(i,content){
							$("#find-result #bought ul").append('<li>'+content["row"]+'排'+content['num']+'号</li>');
						});
						if(info.length==0){
							$("#find-result #bought p").append('<p class="none-result">没有相关信息</p>')
						}
					}else if(index==1){
						$.each(info,function(i,content){
							var item = $("<div></div>").addClass("not-bought-item").appendTo($("#not-bought ul"));
							$.each(content,function(name,value){
								var li = $("<div></div>").addClass("items").appendTo(item);
								if(name=="oid"){
									var oid = $("<div></div>").addClass("oid").html("<span>"+value+"</span>").appendTo(li);
									oid.parents(".items").addClass("title");
									$("<label></label>").html("订单号&nbsp;").prependTo(oid);
									//$('<input type="hidden" name="oid[]" class="oids">').val(value).attr("item-id",value).appendTo($("#buy-again-form"));
								}else if(name=="sids"){
									$.each(value,function(i,sid){
										var row = Math.floor((sid-1)/colNum)+1;
										var col = sid - (row-1)*colNum;
										/* calculate the num */
										var num;
										if(col<=13){
											num = 26-2*(col-1);
										}else{
											num = 1+2*(col-14);
										}
										var sid = $("<div></div>").addClass("sid").text(row+"排"+num+"号").appendTo(li);
										sid.parents(".items").addClass("sid-content");
									 });
								}else if(name=="fail_time"){
									var fail_time = $("<div></div>").addClass("fail-time").text(value).appendTo(li);
									$("<span></span>").html("支付过期时间<br>").prependTo(fail_time);
								}else if(name=="money"){
									var money = $("<div></div>").addClass("money").text("¥"+value).appendTo(li);
								}
							});	
							var li = $("<div></div>").addClass("btns").appendTo(item);
							var choosen = $("<div></div>").html("选择订单").addClass("choose not-choose-order").attr({"choose":"0","item-id":item.children(0).find("span").html()}).appendTo(li);
							var del = $("<div></div>").addClass("delete").text("删除").appendTo(li);
							/* bind the click function */
							if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
								choosen.bind({"touchend":choose_order});
								del.bind({"touchend":del_order});
							}else{
								choosen.bind({"click":choose_order});
								del.bind({"click":del_order});
							}

						});
						if(info.length>0){
							$("#again-group").show();
						}
						if(info.length==0){
							$("#find-result #not-bought p").append('<p class="none-result">没有相关信息</p>');
							$("#again-group").hide();
						}
					}
				});
			});
		}
	});
	/* end of find-form validate */
	/* buy-form validate */
	function buy_again_click(){
		function checkPhone(value){
			if((value.length != 11) || (!value.match(/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[0|6|7|8]|18[0-9])\d{8}$/))){
				return false;
			 }else{
				return true;
			}
		}
		/*
		function checkName(value){     
			var containSpecial = RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)]+/);      
			if(!containSpecial.test(value)&&value.length>=2){
				return true;
			}else{
				return false;
			}      
		}
		*/
		function checkHidden(){
			if($("#buy-again-form input.oids").size()==1){
				return true;
			}else{
				return false;
			}
		}
		var phone = $("#buy-again-form #phone").val();
		/* if user change the form input by Browser */
		phoneResult = checkPhone(phone);
		/* if user change his phone by the input */
		checkPhoneChange = phone==findPhone;
		if(!phoneResult){
			$("#mymodal").modal("show");
			$("#mymodal .modal-body p").html("请输入正确的手机号");
			$("#mymodal button").click(function(){
				$("#mymodal").modal("hide");
			});
		}else if(!checkPhoneChange){
			$("#mymodal").modal("show");
			$("#mymodal .modal-body p").html("请不要更改手机号");
			$("#mymodal button").click(function(){
				$("#mymodal").modal("hide");
			});
		}
		var hiddenResult = checkHidden();
		if(!hiddenResult){
			$("#mymodal").modal("show");
			$("#mymodal .modal-body p").html("请选择一个订单支付");
			$("#mymodal button").click(function(){
				$("#mymodal").modal("hide");
			});
		}
		/*
		var name = $("#buy-again-form #name").val();
		nameResult = checkName(name);
		if(!nameResult){
			$("#buy-again-form #name").parent().next().children(".label").html("<img src="+getWrongPic()+">");
		}else{
			$("#buy-again-form #name").parent().next().children(".label").html("<img src="+getRightPic()+">");
		}
		*/
		if(phoneResult&&hiddenResult){
			$("#buy-again-form").submit();
		}
	}

	/* bind the event */
	if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
		$("#buy-again-form #again-button").bind({"touchend click":buy_again_click});
	}else{
		$("#buy-again-form #again-button").bind({"click":buy_again_click});
	}

	/* choose order */
	function choose_order(){
		if($(this).attr("choose")==1){
			$(this).attr("choose",0).removeClass("choose-order").addClass("not-choose-order");
			$('#buy-again-form input[item-id='+$(this).attr("item-id")+']').remove();
		}else if($(this).attr("choose")==0){
			$(this).attr("choose",1).removeClass("not-choose-order").addClass("choose-order");
			$('<input type="hidden" name="oid[]" class="oids">').val($(this).attr("item-id")).attr("item-id",$(this).attr("item-id")).appendTo($("#buy-again-form"));
		}
	}
	/* end of choose order */
	/* delete order function */
	function del_order(){
		var del = $(this);
		$("#delete-modal").modal("show");
		$("#delete-modal #cancel").click(function(){
			$("#delete-modal").modal("hide");
		});
		$("#delete-modal #yes").click(function(){
			var id = del.parents(".not-bought-item").find(".choose").attr("item-id");
			$.post(getDeleteUrl(),
			{"id":id},
			function(data){
				if(data){
					$("#mymodal").modal("show");
					$("#mymodal .modal-body p").html("删除订单成功");
					$("#mymodal button").click(function(){
						$("#mymodal").modal("hide");
					});
					$("#find-button").trigger("click");
				}else{
					$("#mymodal").modal("show");
					$("#mymodal .modal-body p").html("删除订单失败");
					$("#mymodal button").click(function(){
						$("#mymodal").modal("hide");
					});
				}
				
			});
			$("#delete-modal").modal("hide");
		});
	}
	/* end of delete function */

	

	/* some check */
	/* check the seats whether ordered or not */
	function judgeSeat(this_seat){
		seats = $("#buy-form input[type='hidden']");
		seatsArray = new Array();
		var i = 0;
		$.each(seats,function(index,value){
			seatsArray[i] = $(value).val();
			i++;
		});
		$.post(getjudgeSeatUrl(),
		{"seats":seatsArray.join(",")},
		function(data){
			/* the seats are ordered by others */
			if(data==0){
				$("#mymodal").modal("show");
				$("#mymodal .modal-body p").html("亲，您慢了一步哦，座位已经被选啦，请重新选择吧！");
				$("#mymodal button").click(function(){
					$("#mymodal").modal("hide");
				});
				if(this_seat){
					$(this_seat).removeClass("choosen-color");
					$(this_seat).attr("select","0");
					/* change money */
					money-=getSeatPrice($(this_seat).attr("rank"));
					$("#total-money #price").text(money.toFixed(2));
					/* end of change money */
					$("#hidden-"+$(this_seat).attr("row")+'-'+$(this_seat).attr("col")).remove();
					/* remove seat-choosen li */
					$("#seat-choosen ul #selected-"+$(this_seat).attr("row")+"-"+$(this_seat).attr("col")).fadeOut("500").setTimeout(remove(),500);
				}
				judgeResult = 0;
			/* can choose the seats */
			}else{
				judgeResult = 1;
			}
		});
	}
	function checkCode(){
		code = $(this).val();
		$.post(getCheckCodeUrl(),
		{"checkcode":code},
		function(data){
			if(data==1){
				codeResult=1;
				$("#buy-form #checkcode").parent().next().children(".label").html("<img src="+getRightPic()+">");
			}else{
				codeResult=0;
				$("#buy-form #checkcode").parent().next().children(".label").html("<img src="+getWrongPic()+">");
			}
		});
	}
	function checkPhone(){
		var value = $("#buy-form #phone").val();
		if((value.length != 11) || (!value.match(/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[0|6|7|8]|18[0-9])\d{8}$/))){
			$("#buy-form #phone").parent().next().children(".label").html("<img src="+getWrongPic()+">");
			return false;
		 }else{
		 	$("#buy-form #phone").parent().next().children(".label").html("<img src="+getRightPic()+">");
			return true;
		}
	}
	function checkName(){
		var value = $("#buy-form #name").val();     
		var containSpecial = RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)]+/);      
		if(!containSpecial.test(value)&&value.length>=2){
			$("#buy-form #name").parent().next().children(".label").html("<img src="+getRightPic()+">");
			return true;
		}else{
			$("#buy-form #name").parent().next().children(".label").html("<img src="+getWrongPic()+">");
			return false;
		}      
	}
	function checkTicket(){
		if($('#buy-form input[type="hidden"]').size()==0){
			return 0;
		}else if($('#buy-form input[type="hidden"]').size()>10){
			/* choosen more than 10 seats */
			return 1;
		}else{
			return 2;
		}
	}
	function getPhoneCode(){
		var phoneResult = checkPhone();
		if(phoneResult){
			$("#buy-form #phonecodebtn").val("正在发送").attr("disabled","true");
			$.post(getPhoneCodeUrl(),
			{"phone":$("#buy-form #phone").val(),
			"checkcode":$("#buy-form #checkcode").val()},
			function(data){
				if(data==1){
					time = 60;
					var task = setInterval(function(){
						time = time - 1;
						$("#buy-form #phonecodebtn").val(time+"秒重发");
						if(time == 0){
							clearInterval(task);
							$("#buy-form #phonecodebtn").val("点击获取").removeAttr("disabled");
						}
					}
					,1000);
				}else if(data==2){
					$("#mymodal").modal("show");
					$("#mymodal .modal-body p").html("亲，请输入正确的验证码！");
					$("#buy-form #phonecodebtn").val("点击获取").removeAttr("disabled");
					$("#mymodal button").click(function(){
						$("#mymodal").modal("hide");
					});
				}else{
					$("#mymodal").modal("show");
					$("#mymodal .modal-body p").html("亲，不好意思，发送失败！");
					$("#buy-form #phonecodebtn").val("点击获取").removeAttr("disabled");
					$("#mymodal button").click(function(){
						$("#mymodal").modal("hide");
					});
				}
			});
		}else{
			$("#mymodal").modal("show");
			$("#mymodal .modal-body p").html("亲，请输入正确的手机号！");
			$("#buy-form #phonecodebtn").val("点击获取").removeAttr("disabled");
			$("#mymodal button").click(function(){
				$("#mymodal").modal("hide");
			});
		}
		
	}
	function checkPhoneCode(){
		code = $(this).val();
		$.post(getCheckPhoneCodeUrl(),
		{"phonecode":code},
		function(data){
			if(data==1){
				phoneCodeResult=1;
				$("#buy-form #phonecode").parent().next().children(".label").html("<img src="+getRightPic()+">");
			}else{
				phoneCodeResult=0;
				$("#buy-form #phonecode").parent().next().children(".label").html("<img src="+getWrongPic()+">");
			}
		});
	}
	
	
	/* bind thc check */
	$("#buy-form #phonecode").bind("input propertychange",checkPhoneCode);
	$("#buy-form #checkcode").bind("input propertychange",checkCode);
	$("#buy-form #phone").bind("blur",checkPhone);
	$("#buy-form #name").bind("blur",checkName);
	$("#buy-form #phonecodebtn").bind("click",getPhoneCode);
	
});

