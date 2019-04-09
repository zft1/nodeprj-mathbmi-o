// javascript和C一樣使用//表示單行註解，使用/* */表示多行註解
// 載入express模組 
var express = require('express');
/* 使用express.Router類別來建立可裝載的模組路由的物件
   路由是指應用程式端點 (URI) 的定義，以及應用程式如何回應用戶端的要求。*/
var router = express.Router();

// 載入request, querystring模組
var request = require('request');
var querystring = require('querystring');

// 取得Server端的ip，請記得在專案中安裝underscore模組: npm install underscore
var sip = require('underscore')
    .chain(require('os').networkInterfaces())
    .values()
    .flatten()
    .find({family: 'IPv4', internal: false})
    .value()
    .address;
console.log('Server IP='+sip);

//**************************************************************************
//************ 根據Client端送來之請求命令顯示相對應網頁之方法 ************
//**************************************************************************
// 建立(附加)一個客戶端對應用程式提出 GET / 方法時的路由處理方法(匿名式函數)
// 比照此方式，你可以建立其他GET不同路徑的路由處理方法
// 顯示首頁
serverip_obj = {serverip:sip};
router.get('/', function(req, res) {
	res.render('index');
});

// 顯示數學服務操作介面
router.get('/math', function(req, res) {
	res.render('math');
});

// 顯示BMI計算服務操作介面
router.get('/bmi', function(req, res) {
	res.render('bmi');
});

//*********************************************************************************************
//**************************** 進行數學加減乘除4則運算之服務方法 ******************************
//*********************************************************************************************
// 建立(附加)一個客戶端對應用程式提出 POST /math/:num1/:num2/:op 方法時的路由處理方法(匿名式函數)
// 比照此方式，你可以建立其他POST不同路徑的路由處理方法
router.post('/math/:num1/:num2/:op', function(req, res){
	res.setHeader('Access-Control-Allow-Origin', '*'); // 允許其他網站的網頁存取此服務
	
	//將具名參數值從路由網址中取出，並轉換成數值
	var num1 = Number(req.params.num1);
	var	num2 = Number(req.params.num2);
	var op = Number(req.params.op);
	var message;
	
	// 若n1不是數值或n2不是數值，則回傳提醒訊息(JSON格式)
	if(Number.isNaN(num1) || Number.isNaN(num2))
		value = "數字1或數字2不是數值";
	// 若op不是數值，則回傳提醒訊息(JSON格式)
	else if(Number.isNaN(op))
		value = "操作代號不是數值，操作代號1:加,2:減,3:乘,4:除";
	else
	{	try
		{
			// 通過數字及操作代碼符合格式的檢驗後，才開始進行計算
			switch(op)
			{
				case 1:
					value = num1 + num2;
					break;
				case 2:
					value = num1 - num2;
					break;
				case 3:
					value = num1 * num2;
					break;
				case 4:
					value = num1 / num2;
					value = value.toFixed(2); //限制小數點後只顯示2位，且變成string
					break;
				default:
					value = "操作代號須為1~4的整數：1:加,2:減,3:乘,4:除";
			};
		}
		catch(ex)
		{
			value = "數學運算時產生例外，原因如下：" + ex.toString();
		}
	}
	// 設定回傳結果之編碼為utf-8，網頁端才能正常顯示中文
	res.set(
		{
			'charset': 'utf-8'  
		});
	//傳回一個鍵值對(key-value)的JSON資料給用戶端
	res.send( 
		{result: value}
	);	
});

//*********************************************************************************************
//**************************** 進行數學加減乘除4則運算之服務方法 ******************************
//*********************************************************************************************
// 建立(附加)一個客戶端對應用程式提出 POST /math/:num1/:num2/:op 方法時的路由處理方法(匿名式函數)
// 比照此方式，你可以建立其他POST不同路徑的路由處理方法
router.post('/bmi', function(req, res){
	res.setHeader('Access-Control-Allow-Origin', '*'); // 允許其他網站的網頁存取此服務
	
	//將具名參數值從路由網址中取出，並轉換成數值
	var height = Number(req.body.height);
	var weight = Number(req.body.weight);
	
	// 若n1不是數值或n2不是數值，則回傳提醒訊息
	if(Number.isNaN(height) || Number.isNaN(weight))
		value = "身高或體重輸入值不是數字";
	else
	{	// 通過數字及操作代碼符合格式的檢驗後，才開始進行計算
		try
		{
			height = height/100;  // 轉換成公尺
			bmi = weight / ((height)*(height));
			value = bmi.toFixed(2); //限制小數點後只顯示2位，且變成string
		}
		catch(ex)
		{
			value = "計算BMI時產生例外，原因如下：" + ex.toString();
		}
	}
	// 設定回傳結果之編碼為utf-8，網頁端才能正常顯示中文
	res.set(
		{
			'charset': 'utf-8'  
		});
	//傳回一個鍵值對(key-value)的JSON資料給用戶端
	console.log(value);
	res.send( 
		{result: value}
	);	
});

module.exports = router;
