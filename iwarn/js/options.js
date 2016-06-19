/*

  -- 我是 右键 - 选项 之后的页面的JavaScript文件 . 
  -- 更多 - 请看到底部.

*/
$(function(){
	optionsthis.initial();
});

optionsthis = {
	initial:function initial(){ //初始化相关操作.

		this.bindLoadLocalStorage();
		this.bindDeleteLocalStorage();
		this.bindSeeDemoInfoShow();
		this.bindUpdateWwwSiteInfo();
		this.bindUpdateRightClose();
		this.bindSubmitUpdateInfo();

	},bindLoadLocalStorage:()=>{ // 从LocalStorage中读取数据,并加载到HTML页面.

		let localData = window.localStorage;
		let htmlcontent = '';
		$.each(localData,(key,value)=>{
			// 从查询结果给变量批量赋值.
			let {wwwsite,contentv,fontsizev,fontcolorv,backcolorv,isclose} = JSON.parse(value);

			// 处理提示内容超长的情况.
			let newcontent = contentv;
			if(newcontent.length>10){
				let substrcontent = newcontent.substring(0,10);
				newcontent = `<abbr title='${newcontent}'>${substrcontent}</abbr>`
			}
			// 处理提示内容超长的情况.END

			// 是否可以关闭窗口 - 处理成中文.
			let closeinfo = "不能"
			if(isclose == '0'){
				closeinfo = "可以";
			}
			// 是否可以关闭窗口 - END.

			// 组装HTML模板.
			htmlcontent+=`<tr><td>${wwwsite}</td>
			<td>${newcontent}</td>
			<td>${fontsizev}px(<small>预览查看效果</small>)</td>
			<td><span style='color:${fontcolorv}'>这里是示例文字</span></td>
			<td><span style='background-color:${backcolorv}'>这里是示例文字</span></td>
			<td>${closeinfo}</td>
			<td>
			<button type="button" data-wwwsite='${wwwsite}' class="am-btn am-btn-default am-radius am-btn-xs seedemoinfo">预览</button>
			<button type="button" data-wwwsite='${wwwsite}' class="am-btn am-btn-secondary am-radius am-btn-xs updatewwwsiteinfo">修改</button>
			<button type="button" data-wwwsite='${wwwsite}' class="am-btn am-btn-danger am-radius am-btn-xs deletesiteinfo">删除</button>
			</td>
			</tr>`;
		})
		// 装载HTML到页面.
		if(htmlcontent){
			$('#contenttablebody').html('');
			$('#contenttablebody').html(htmlcontent);
		}

	},bindDeleteLocalStorage:()=>{ // 删除网址及附属数据(不可恢复).

		$("#contenttablebody").delegate('.deletesiteinfo', 'click', function(){ // 为动态生成的按钮绑定点击事件.
			// 删除确认操作.
			if(confirm('真的要删了?(无法找回)')){ // 确认删除 - Oh Yeah .
				const WWWINFO = 'iwarn_07q_net_'; // 加上特有前缀标识.
				let wwwsiteinfo = WWWINFO+$(this).data("wwwsite"); // 组装成LocalStorage中的Key.
				if(window.localStorage.getItem(wwwsiteinfo)){ // 检查LocalStorage中是否存在此Key.
					window.localStorage.removeItem(wwwsiteinfo); // 执行删除操作.
					layer.msg('真的删了.', {icon: 1});
					location.reload(); // 删除之后,重新加载当前页面.
				}
			}else{ // 取消删除操作 - 可能是反悔了..
				layer.msg('舍不得啊?', {
			    time: 2000, //20s后自动关闭
			    btn: ['嗯,是啊!', '没错']
			  });
			}
		})

	},bindSeeDemoInfoShow:()=>{ // 到相关网址预览效果

		$("#contenttablebody").delegate('.seedemoinfo', 'click', function(){ // 为动态生成的按钮绑定点击事件.
			let wwwsiteinfo = "http://"+$(this).data("wwwsite"); // 从按钮的属性中获取网址,并且拼接.
			window.open(wwwsiteinfo); // 新窗口打开,可以看到效果了..
		})

	},bindUpdateWwwSiteInfo:()=>{ // 更新数据的唯一入口,只能从这里去更新数据.

		$("#contenttablebody").delegate('.updatewwwsiteinfo', 'click', function(){ // 为动态生成的按钮绑定点击事件.
			const WWWINFO = "iwarn_07q_net_"; // 特有前缀.
			let wwwsiteinfo = WWWINFO+$(this).data("wwwsite"); // 组装成LocalStorage中Key.
			let data = localStorage[wwwsiteinfo]; // 从LocalStorage中查询数据.
			if(data){ // 确认存在. - 不存在是无法操作的.
				let newdata = JSON.parse(data); // LocalStorage中存的是JSON,在这转换回去.
				optionsthis.bindLoadDataToDiv(newdata); // 调用函数 - 加载数据到"弹窗"中.
				$("#updateWwwSiteInfoDiv").show(); // 显示"弹窗"
			}
		})

	},bindUpdateRightClose:()=>{ // 没啥说的 - 就是控制关闭"弹窗"

		$(".rightclose").click(()=>{
			$("#updateWwwSiteInfoDiv").hide();
		})

	},bindLoadDataToDiv:(data)=>{ // 就一个加载数据 - 需要解释么? 你懂得.

		optionsthis.bindClearDataToDiv(); // 加载之前 - 先执行一下清理操作 ~~.
		let rootdiv = $("#updateWwwSiteInfoDiv");
		rootdiv.find('#doc-ipt-www-1').val(data.wwwsite);
		rootdiv.find('#doc-content-1').val(data.contentv);
		rootdiv.find('#doc-fontsize-1').val(data.fontsizev);
		rootdiv.find('#doc-fontcolor-1').val(data.fontcolorv);
		rootdiv.find('#doc-backcolor-1').val(data.backcolorv);
		rootdiv.find('input[type="radio"][name="isclosealert"][value="'+data.isclose+'"]').iCheck('check');

	},bindClearDataToDiv:()=>{ // 清理操作 - 一切皆在不言中 . 

		let rootdiv = $("#updateWwwSiteInfoDiv");
		rootdiv.find('#doc-ipt-www-1').val("");
		rootdiv.find('#doc-content-1').val("");
		rootdiv.find('#doc-fontsize-1').val("");
		rootdiv.find('#doc-fontcolor-1').val("");
		rootdiv.find('#doc-backcolor-1').val("");
		rootdiv.find('input[type="radio"][name="isclosealert"][value="0"]').iCheck('check');

	},bindSubmitUpdateInfo:()=>{ // 提交更新操作  -  和新增操作有所差异 . 

		$("#submitUpdateIWarn").click(()=>{

			// !! 看到这里,就需要注意了!这里的[popupthis]是调用[popup.js]中的[popupthis]
			// !! 为什么能调用 - 因为已经在[options.html]中引入了啊~
			// !! 为什么要调用 - 简化重复代码~
			// !! 为什么... - 不回答了.请自己幻想~
			let addObj = popupthis.bindCheckEntity(); 
			if(addObj){ // 检查确认一切都准备就绪..
				let _wwwvalue = $('#doc-ipt-www-1').val(); // 获取到网址,后面有大用.
				// !! 注意下面这句.
				// !! 前面依然调用了[popupthis].
				// !! 为什么... - 往上翻,自己看.
				// !! 第一个参数: 特有前缀+网址
				// !! 第二个参数: 将对象转换为JSON存储.
				// --
				// .. 500ms之后重新加载当前页面
				popupthis.bindUpdateLocalStorage(popupthis.getWWWINFO()+''+_wwwvalue,JSON.stringify(addObj));
				setTimeout(()=>{
					location.reload();
				},500)
			}
		})
	}

};
// -- by PRD 2016-06-18.
// -- CODE IS POETRY.
// -- WWW.07Q.NET