/*

  -- 我是 点了图标之后的页面的JavaScript文件 . 
  -- 更多 - 请看到底部.

*/
$(function(){
	
	popupthis.initial();

	// 初始化iCheck - iCheck 是什么? 请百度 [OR] Google 
	// iCheck 中文: http://www.bootcss.com/p/icheck/   
	$('.iscloseinfo').iCheck({ 
       radioClass: 'icheckbox_square-green'
    });

});

popupthis = {
	initial:function initial(){ // 初始化相关操作啦.

		this.bindFontSizeChange();
		this.bindFontColorChange();
		this.bindBackColorChange();
		this.bindSeeIWarnInfo();
		this.bindAddIWarn();
		this.formatWWW();

	},
	getWWWINFO:()=>{
		
		// 一定要同步修改[content.js][options.js]中的标志.
		return 'iwarn_07q_net_';

	},
	formatWWW:()=>{ // 输入网址之后,对其进行检查.

		$('#doc-ipt-www-1').blur(()=>{ // 监听丢掉焦点事件.

			// !! 如果是更新信息,就不用检查啦..
			// !! 因为更新那个地方是不能修改网址的哦..

			let updateisinfo  = $("#updateWwwSiteOptions").val();
			if(!(updateisinfo && updateisinfo == 'update')){

				// 替换相关前缀.
				let newvalue = ($('#doc-ipt-www-1').val()).
				match(/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/g);
				let _wwwv = $('#doc-ipt-www-1');

				// 检查一下啦.
				if(!/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/.test(newvalue)){
					_wwwv.next('.message').text('必须输入合法的网址!');
					$('.subbutton').prop("disabled",true); // 禁用按钮先,防止有些宝宝不听话..
				} else {
					$('#doc-ipt-www-1').val(newvalue[0]);
					newvalue = popupthis.getWWWINFO() + newvalue; 
					// 检查一下之后,在检查一下是否已经新增过了.
					if(window.localStorage.getItem(newvalue)){ // 已经新增过了,不许在新增了..
						$('.subbutton').prop("disabled",true); // 禁用按钮先,防止有些宝宝不听话..
						_wwwv.next('.message').text('网址库已经存在这个网址!请先修改');
					}else{ // OK不存在,可以继续.
						$('.subbutton').prop("disabled",false); // 符合要求.
						_wwwv.next('.message').text('');
					}
				}
			}		
		})

	},
	checkWWW:()=>{ // 没啥说的 - 检查网址是否符合要求啦.

		let _wwwv = $('#doc-ipt-www-1');
		if(!/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/.test(_wwwv.val())){
			_wwwv.next('.message').text('必须输入合法的网址!');
			return false;
		}
		_wwwv.next('.message').text('');
		return true;

	},checkContent:()=>{ // 检查内容 - 是否已经填了. 不填内容,让宝宝怎么给你展示呢..

		let _contentv = $('#doc-content-1');
		if(!_contentv.val()){
			_contentv.next('.message').text('必须输入内容!');
			return false;
		}
		_contentv.next('.message').text('');
		return true;

	},checkFontSize:()=>{ // 检查字体大小 - 目前能接受的字体大小是 12 - 72 [太小展示不了,太大占太招风]

		// !! 注意,看到这里请注意一下啦.
		// !! [影响布局,不再使用] - 是因为动态修改字体大小,会对布局有影响啊
		// !! 街上一句 - 要是有的宝宝一下输入[72],界面变形的样子 - 请自行脑补.

		let _fontsizevcheck =$('#doc-fontsize-1');
		if((parseInt(_fontsizevcheck.val())<12 || parseInt(_fontsizevcheck.val())>72) || isNaN(_fontsizevcheck.val())){
			_fontsizevcheck.next('.message').text('必须为数字,且大于12,小于72');
			//影响布局,不在使用! _fontsizevcheck.prev('.fontsizedemo').css('fontSize','12px');
			return false;
		}

		_fontsizevcheck.next('.message').text('');
		//影响布局,不在使用!  _fontsizevcheck.prev('.fontsizedemo').css('fontSize',_fontsizevcheck.val()+'px');
	    return true;

	},bindCheckEntity:()=>{ // 检查是否符合要求 - 以及组装对象.

		// 检查的任务,交给几个小伙伴 - 只需要结果即可 - 谁说这不是信任呢.
		let check = popupthis.checkWWW() && popupthis.checkContent() && popupthis.checkFontSize();
		if(!check){ //未通过检查,返回null. - 谁调用,谁拿去用就好.. 
			return null;
		}

		// 检查ok - 继续下行..

		// 单独获取网址 . 
		let _wwwvalue = $('#doc-ipt-www-1').val();

		// 激动人心 - 组装对象啦 - 不再需要检查了.
		let addObj = new Object();
		addObj.wwwsite = _wwwvalue;
		addObj.contentv = $('#doc-content-1').val();
		addObj.fontsizev = $('#doc-fontsize-1').val();
		addObj.fontcolorv = $('#doc-fontcolor-1').val();
		addObj.backcolorv = $('#doc-backcolor-1').val();
		addObj.isclose =  $('input[type="radio"][name="isclosealert"]:checked').val();
		// 组装完毕 - 大功告成 
		return addObj;

	},bindAddIWarn:()=>{ // 仅仅适用于[popup.html]的新增规则 - [options.html]不会调用这个函数 .

		$('#submitIWarn').click(() => {
			let addObj = popupthis.bindCheckEntity(); // 有些事情 - 因为信任而简单.
			if(addObj){ // 在确认一遍 - 为了保险 
				let _wwwvalue = addObj.wwwsite ; // 依旧拿到单独的网址.

				// !! 这个地方没啥特别. 就是直接新增了
				// !! 第一个参数: 特有前缀+网址
				// !! 第二个参数: 将对象转换为JSON存储.
				popupthis.bindAddLocalStorage(popupthis.getWWWINFO()+''+_wwwvalue,JSON.stringify(addObj));
			}
		})

	},bindFontSizeChange:()=>{ // 监控字体大小输入框

		$('#doc-fontsize-1').change(function(){ // 字体输入框的一举一动 - 我都知道 [一百个人走过,我都能找到你..]
			let _fontsizev = $(this); // 拿到自己
			// 判断一下 - 要是(假设):某些宝宝输入的( 数字 < 12 或者 数字 > 72 || 根本就不是数字 ) 
			// 就要提示啦.

			// !! 注意,看到这里请注意一下啦.
			// !! [影响布局,不再使用] - 是因为动态修改字体大小,会对布局有影响啊
			// !! 街上一句 - 要是有的宝宝一下输入[72],界面变形的样子 - 请自行脑补.
			if((parseInt(_fontsizev.val())<12 || parseInt(_fontsizev.val())>72) || isNaN(_fontsizev.val())){
				_fontsizev.next('.message').text('必须为数字,且大于12,小于72');
				// 影响布局,不在使用. _fontsizev.prev('.fontsizedemo').css('fontSize','12px');
				return false;
			}
			_fontsizev.next('.message').text('');
			// 影响布局,不在使用. _fontsizev.prev('.fontsizedemo').css('fontSize',_fontsizev.val()+'px');
		})

	},bindFontColorChange:()=>{ // 监听文字颜色 - 颜色改变了就设置给示例.

		$('#doc-fontcolor-1').change(function(){
			let _fontcolorv = $(this);			
			if(_fontcolorv.val()){
				_fontcolorv.prev('.fontcolordemo').css('color',_fontcolorv.val());
			}
		})

	},bindBackColorChange:()=>{ // 监听背景颜色 - 颜色改变了就设置给示例[和上面那句不一样,自己找不同..]

		$('#doc-backcolor-1').change(function(){
			let _backcolorv = $(this);
			if(_backcolorv.val()){
				_backcolorv.prev('.backcolordemo').css('backgroundColor',_backcolorv.val());
			}
		})

	},bindSeeIWarnInfo:()=>{ // 承担了大部分任务的 - 预览功能[就是我啦]

		$('#seeIWarn').click(function(){

			// 必要工作 - 查看之前也先检查一下是否符合要求 . 
			let check = popupthis.checkWWW() && popupthis.checkContent() && popupthis.checkFontSize();
			if(check){ // 符合 - 继续.
				$('#seeiwarninfo').removeClass('am-hide'); 
				let divinfo  = $('#seeiwarninfo').find('.seeinfo');
				divinfo.html($('#doc-content-1').val());

				// !! 给预览的设置相关样式.
				// !! 好奇可自行研究下相关操作.
				divinfo.css({'color':$('#doc-fontcolor-1').val(),'font-size':$('#doc-fontsize-1').val()+'px','background-color':$('#doc-backcolor-1').val()});
			}
		})

	}
	,bindAddLocalStorage:(wwwsite,data)=>{ // 整个[扩展]的核心 - 数据保存

		// !! 数据保存使用了.
		// !! LocalStorage 
		// !! 关于LocalStorage,要讲的话,可能需要开课
		// !! so?请自行[百度] OR [Google]
		// !! 简单介绍:http://www.w3school.com.cn/html5/html_5_webstorage.asp
		// !! 简单介绍(英语):https://www.w3.org/TR/webstorage/

		if(!window.localStorage.getItem(wwwsite)){
			window.localStorage.setItem(wwwsite,data);
			popupthis.bindShowMessage("恭喜,新增成功!");
		} else {
			popupthis.bindUpdateLocalStorage(wwwsite,data);
		}

	},bindUpdateLocalStorage:(wwwsite,data)=>{ // 更新数据 - 在[options.html]中使用.

		if(window.localStorage.getItem(wwwsite)){
			window.localStorage.setItem(wwwsite,data);
			popupthis.bindShowMessage("恭喜,更新成功!");
		}

	},bindDeleteLocalStorage:(wwwsite)=>{ // 删除数据 - 在[options.html]中使用.

		if(window.localStorage.getItem(wwwsite)){
			window.localStorage.removeItem(wwwsite);
			popupthis.bindShowMessage("恭喜,删除成功!");
		}

	}
	,bindShowMessage:(messageinfo,titleinfo='操作提示')=>{ // 使用Chrome的接口弹出通知信息.

				let lastTabId = 0;
				let warningId = 'chromepopupinfoalert';
				chrome.notifications.create(warningId, {
				  iconUrl: chrome.runtime.getURL('image/icon-48.png'),
			      title: titleinfo,
			      type: 'basic',
			      message: messageinfo,
			      isClickable: true,
			      priority: 2,
			    }, () => {});
			    setTimeout(() => {
			    	window.close();
			    	chrome.notifications.clear(warningId);
			    },1000);

	}
};
// -- by PRD 2016-06-18.
// -- CODE IS POETRY.
// -- WWW.07Q.NET