/*

  -- 我是 在指定网站展示数据的JavaScript文件 . 
  -- 更多 - 请看到底部.

*/
if(window.localStorage.length-1){
	// 获取当前网页的URL.
	let url = window.location.host;

	// 使用新数据结构 - Set.
	let info = new Set();
	let key = null;
	// 指定前缀 - const:定义的变量不能改变.
	const WWWINFO = 'iwarn_07q_net_';
	const query = WWWINFO+''+url;

	// !! 通过Chrome的通信机制查询LocalStorage中是否存在此网址.
	// !! 其实这里是发送[key]给[background.js]中进行查询,并返回数据.
	// !! (替代方案是:Chrome Storage[Google官方提供的存储方案])
	chrome.runtime.sendMessage({method: 'getLocalStorage', key: query}, (response) => {
		if(response.data){ // 先检查一下是不是真的存在呢..
			
			// 还原成一个对象..
			let resultdata = JSON.parse(response.data);

			// 拼接HTML模板.
	  		let content = `<div id='${WWWINFO}' style='width: 100%;height: auto;color:${resultdata.fontcolorv};
	  		font-size: ${resultdata.fontsizev}px;line-height: ${resultdata.fontsizev}px;position: fixed;top: 50%;text-align: center;
	  		background: ${resultdata.backcolorv};z-index: 100000;word-break: initial;padding: 15px;'>${resultdata.contentv}</div>`;
	  		// 判断是否可以关闭  - 不能关闭会影响使用呢...(虽然有些宝宝喜欢..)
	  		if(resultdata.isclose && resultdata.isclose=='0'){ // 可以关闭
	  			content +=`<span style="z-index:10000;cursor:pointer;position: fixed;width: 100%;top: 46%;background: #DEB887;text-align: center;height: 36px;line-height: 36px;font-size: 24px;"  id="btnclosealertinfo">关 闭(可以暂时关闭,如果需要彻底关闭,请在[选项页]删除此站点的配置~)</span>`;
	  		}

	  		// !! 防止有些网页没加载完,导致无法显示提示.
	  		setTimeout(()=>{
	  			// 添加到[body]标签的后面
	  			$('body').prepend(content);
	  		},2000)

	  		// !! 再次检查...
	  		let checkInfo =  $("#"+WWWINFO);
	  		if(!checkInfo){
	  			setTimeout(()=>{
	  				// 添加到[body]标签的后面
	  				$('body').prepend(content);
	  			},10000)
	  		}
	  		
	  		// 为动态生成的HTML绑定关闭事件.
	  		$('body').delegate('#btnclosealertinfo', 'click', ()=>{
	  			let closevalue = WWWINFO;
				if(closevalue){
					$('#'+closevalue).hide();
					$('#btnclosealertinfo').hide();
			 	}
	  		})
  		}
	});
}
// -- by PRD 2016-06-18.
// -- CODE IS POETRY.
// -- WWW.07Q.NET 