window.onload = function(e){
    var star1 = document.getElementById('star1');
    var star2 = document.getElementById('star2');
    var star3 = document.getElementById('star3');
    var star4 = document.getElementById('star4');
    var star5 = document.getElementById('star5');

    star1.addEventListener("click", function(){
        uncheckAll()
        addClass1star()
    });

    star2.addEventListener("click", function(){
        uncheckAll()
        addClass2star()
    });

    star3.addEventListener("click", function(){
       uncheckAll()
       addClass3star()
    });

    star4.addEventListener("click", function(){
        uncheckAll()
        addClass4star()
    });

    star5.addEventListener("click", function(){
        uncheckAll()
        addClass5star()
    });

    function uncheckAll(){
        star1.classList.remove('checked');
        star2.classList.remove('checked');
        star3.classList.remove('checked');
        star4.classList.remove('checked');
        star5.classList.remove('checked');
    }

    function addClass1star(){
        star1.classList.add('checked');
    }

    function addClass2star(){
        star1.classList.add('checked');
        star2.classList.add('checked');
    }

    function addClass3star(){
        star1.classList.add('checked');
        star2.classList.add('checked');
        star3.classList.add('checked');
    }

    function addClass4star(){
        star1.classList.add('checked');
        star2.classList.add('checked');
        star3.classList.add('checked');
        star4.classList.add('checked');
    }

    function addClass5star(){
        star1.classList.add('checked');
        star2.classList.add('checked');
        star3.classList.add('checked');
        star4.classList.add('checked');
        star5.classList.add('checked');
    }
}