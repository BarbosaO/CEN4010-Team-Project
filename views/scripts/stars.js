window.onload = function(e){
    var star1 = document.getElementById('star1');
    var star2 = document.getElementById('star2');
    var star3 = document.getElementById('star3');
    var star4 = document.getElementById('star4');
    var star5 = document.getElementById('star5');

    star1.addEventListener("click", function(){
        uncheckAll()
        star1.classList.add('checked');
    });

    star2.addEventListener("click", function(){
        uncheckAll()
        star1.classList.add('checked');
        star2.classList.add('checked');
    });

    star3.addEventListener("click", function(){
        uncheckAll()
        star1.classList.add('checked');
        star2.classList.add('checked');
        star3.classList.add('checked');
    });

    star4.addEventListener("click", function(){
        uncheckAll()
        star1.classList.add('checked');
        star2.classList.add('checked');
        star3.classList.add('checked');
        star4.classList.add('checked');
    });

    star5.addEventListener("click", function(){
        uncheckAll()
        star1.classList.add('checked');
        star2.classList.add('checked');
        star3.classList.add('checked');
        star4.classList.add('checked');
        star5.classList.add('checked');
    });

    function uncheckAll(){
        star1.classList.remove('checked');
        star2.classList.remove('checked');
        star3.classList.remove('checked');
        star4.classList.remove('checked');
        star5.classList.remove('checked');
    }
}