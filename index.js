var buttons = document.getElementsByClassName('button')

for (var i = 0; i < buttons.length; i++)
{
    var curr = buttons[i];
    curr.addEventListener('click',function() {
        console.log("clicked")
    });
}



