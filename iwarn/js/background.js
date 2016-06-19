/*

  -- 我是 常驻在后台的JavaScript文件.
  -- 也就是你看不见、看不见我操作界面..
  -- 其实是这样的:
  -- 随时在后台准备着,如果有请求过来,来自[content.js]我就会去查询LocalStorage.然后返回结果.

  -- 更多 - 请看到底部.

*/
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => { // 监听事件.

    if (request.method == "getLocalStorage"){ // 如果是指定的请求.. 不明白去看看[content.js]哈. 
      sendResponse({data:  localStorage[request.key]}); // 发送指定的查询数据呢.即使没有...也要发送
    } else{
      sendResponse({}); // 如果不是...就随便返回个空......
    }

});
// -- by PRD 2016-06-18.
// -- CODE IS POETRY.
// -- WWW.07Q.NET