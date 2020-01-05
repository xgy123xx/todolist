$(function () {
    // var todoList = [{
    //         title: '我是一号元素',
    //         done: false
    //     },
    //     {
    //         title: '我是二号元素',
    //         done: false
    //     },
    //     {
    //         title: '我是三号元素',
    //         done: false
    //     },
    //     {
    //         title: '我是四号元素',
    //         done: true
    //     },
    //     {
    //         title: '我是五号元素',
    //         done: true
    //     },
    // ];
    var todoList = [];
    load();

    //加载事件
    function load() {
        //定义两个计数器，分别记录已完成事件个数和未完成事件个数
        var todoCount = 0;
        var doneCount = 0;
        var todoStr = '';
        var doneStr = '';
        todoList = loadData();
        if (todoList && todoList.length) {
            //列表中有数据
            //遍历列表
            todoList.forEach(function (item, index) {
                //1.拼接字符串
                //2.将字符串添加到列表中
                //3.增加计数器
                if (item.done) {
                    //已完成事件
                    doneStr += `
                    <li index=${index}>
                    <input type="checkbox"  checked="checked">
                    <p id="p-${index}">${item.title}</p>
                    <a href="javascript:;">-</a>
                    </li>
                    `
                    
                    doneCount++;
                } else {
                    todoStr += `
                    <li index=${index}>
                    <input type="checkbox" >
                    <p id="p-${index}">${item.title}</p>
                    <a href="javascript:;">-</a>
                    </li>
                    `
                    
                    todoCount++;
                }
                $('#todolist').html(todoStr);
                $('#donelist').html(doneStr);
                //设置显示个数
                $('#todocount').html(todoCount);
                $('#donecount').html(doneCount);
            })

        } else {
            //列表中没有数据 
            //分别清空列表
            $('#todolist').empty();
            $('#donelist').empty();
            //设置显示个数
            $('#todocount').html(todoCount);
            $('#donecount').html(doneCount);
        }


    }
    //读取数据
    function loadData(){
        var collection = localStorage.getItem('todo');
        if(collection){
            return JSON.parse(collection);
        }else{
            return [];
        }
    }
    //存储数据
    function saveData(data){
        localStorage.setItem('todo',JSON.stringify(data));
    }
    //添加值
    $('#title').keydown(function(event){
        //监听键盘事件
        // console.log(event.keyCode)
        if(event.keyCode === 13){
            //获取输入的 值
            var val = $(this).val();
            // console.log(val);
            //判断是否为空
            if(val){
                //将值添加至列表中
                todoList.unshift(
                    {title:val,done:false}
                );
                
                $(this).val("");
                //刷新列表
                saveData(todoList);
                load();
            }else{
                alert('输入框内不能为空');
            }

        }
    });

    //删除值
    //绑定事件代理
    $('#todolist,#donelist').on('click','a',function(){
        //1.找到该标签的索引

        //这种方法，只适合用于单独一个列表，多个列表用id来获取index
        // var index = $(this).parent().index();
        
        var index = $(this).parent().attr('index');
        // console.log(index);
        todoList.splice(index,1);
        saveData(todoList);
        load();
    })

    //更新值
    //绑定事件代理
    $('#todolist').on('change','input[type="checkbox"]',function(){
        //获取当前的索引
        var index = $(this).parent().attr('index');
        //更新数据
        update(index,'done',true);
        //刷新
        load();
    })
    $('#donelist').on('change','input[type="checkbox"]',function(){
        //获取当前的索引
        var index = $(this).parent().attr('index');
        //更新数据
        update(index,'done',false);
        //刷新
        load();
    })
    function update(i,key,value){
        var item = todoList.splice(i,1)[0];
        item[key] = value;
        todoList.splice(i,0,item);
        saveData(todoList);
    }
    
    //修改p中内容
    //1.设置事件代理：给p标签绑定单击事件
    //    获取p标签index索引，获取p标签的值
    //    将p标签的内容改为input
    $('#todolist').on('click','p',function(){
        var index = $(this).parent().attr('index');  //利用li标签在索引中的位置
        var title = $(this).text();
        // console.log(title);
        var $p = $(this);
        //id作用，用来标识每个input，方便以后选中，添加事件
        $p.html(`<input type="text" id='input-${index}' value='${title}'>`);
        // console.log($p.html());
        $(`#input-${index}`).focus();
        //默认选中p标签内所有内容
        $(`#input-${index}`)[0].setSelectionRange(0,$(`#input-${index}`).val().length);
        //设置失去焦点时绑定事件
        $(`#input-${index}`).blur(function(){
            //1.检查input输入框中的内容
            //2.判断是否为空，为空则恢复原状，弹出警告；不为空，则修改列表
            if($(this).val().length === 0){
                // $p.html(title);  **这行代码在多次点击后，title会变成空，不起作用
                alert('内容不能为空');
            }else{
                // console.log($(this).val());
                update(index,'title',$(this).val());
                
            }
            load();  //在多次点击后onload会为空
        })



    })


})