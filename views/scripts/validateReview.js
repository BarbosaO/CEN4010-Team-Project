function validateReview(){
    var comment = document.getElementById('comment');
    var anonymous = document.getElementById('anonymous').checked;
    var rating = getRating();
    var formRating = document.getElementById('rating');
    formRating.value = rating;

    // console.log('comment: ' + comment);
    // console.log('anonymous: ' + anonymous);
    // console.log('rating: ' + rating);
}

function getRating(){
    var star1 = document.getElementById('star1');
    var star2 = document.getElementById('star2');
    var star3 = document.getElementById('star3');
    var star4 = document.getElementById('star4');
    var star5 = document.getElementById('star5');

    if (star5.classList.contains('checked')){
        return 5;
    }
    else if (star4.classList.contains('checked')){
        return 4;
    }
    else if (star3.classList.contains('checked')){
        return 3;
    }
    else if (star2.classList.contains('checked')){
        return 2;
    }
    else if (star1.classList.contains('checked')){
        return 1;
    }
}