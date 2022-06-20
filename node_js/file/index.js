
			
			var isresult = false;							// 是否有结果
			
			var computer_messege = document.getElementById("computer_messege");
			var computer_history01 = document.getElementById("computer_history01");
			var computer_history02 = document.getElementById("computer_history02");
			var numArr = ['0','1','2','3','4','5','6','7','8','9','%'];
						
			function onclickGetResult()
			{
				str = computer_messege.innerText;
				str = str.replace(/×/g, '*');	// 将字符串转换为可计算的表达式
				str = str.replace(/÷/g, '/');
				str = str.replace(/%/g,'/100');
				console.log(str);
				computer_messege.innerText = eval(str);
				isresult = true;							// 判断得出结果
			}
			function onclickArithmetic(Ari)
			{
				var str = computer_messege.innerText;
				if(numArr.indexOf(str.charAt(str.length-1)) == -1)
				{
					onclickDelet();
					onclickNum(Ari);
					// 不能重复输入计算符
					return;
				}
				onclickNum(Ari);
			}
			function onclickClear()
			{
				computer_messege.innerText = "0";
				computer_history01.innerText = "";
				computer_history02.innerText = "";
			}
			function onclickDelet()
			{
				console.log("del");
				if(computer_messege.innerText.length == 1)
				{
					computer_messege.innerText = "0";
					console.log("del已清空");
					return;									// 计算区为0时无效操作
				}
				else
				{
					str = computer_messege.innerText;
					computer_messege.innerText = str.substr(0,str.length-1);
					// 取除最后一位
				}
			}
			function onclickNum(num)
			{				
				if(isresult)
				{
					// 已经出结果时输入则更新历史记录并开始新的计算
					computer_history01.innerText = computer_history02.innerText;
					computer_history02.innerText = computer_messege.innerText;
					computer_messege.innerText = num;
					isresult = false;						// 新的开始
				}
				else if(computer_messege.innerText == 0)
				{
					computer_messege.innerText = num;
				}
				else
				{
					computer_messege.innerText += num;
				}				
			}
			document.onkeydown = function(event){
				event = event || window.event;
				console.log(event.key);
				switch(event.key)
				{
					case '0':
						onclickNum(0);
						break;
					case '1':
						onclickNum(1);
						break;
					case '2':
						onclickNum(2);
						break;
					case '3':
						onclickNum(3);
						break;
					case '4':
						onclickNum(4);
						break;
					case '5':
						onclickNum(5);
						break;
					case '6':
						onclickNum(6);
						break;
					case '7':
						onclickNum(7);
						break;
					case '8':
						onclickNum(8);
						break;
					case '9':
						onclickNum(9);
						break;
					case '.':
						onclickNum('.');
						break;
					case '+':
						onclickArithmetic('+');
						break;
					case '-':
						onclickArithmetic('-');
						break;
					case '*':
						onclickArithmetic('×');
						break
					case '/':
						onclickArithmetic('÷');
						break;
					case 'Backspace':
						event.preventDefault();				// 取消默认操作
						onclickDelet();
						break;
					case 'Enter':
						event.preventDefault();
						onclickGetResult();
						break;
					case 'Control':
						event.preventDefault();
						onclickClear();
						break;
					default:
						break
				}
			}
			
		