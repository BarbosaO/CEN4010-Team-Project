function validateReview(){
    var comment = document.getElementById('comment').value;
    var date = document.getElementById('date');
    date.value = getDate();
    var anonymous = document.getElementById('anonymous').checked;
    var rating = getRating();
    var formRating = document.getElementById('rating');
    formRating.value = rating;

    // console.log('comment: ' + comment);
    // console.log('anonymous: ' + anonymous);
    // console.log('rating: ' + rating);

    if(rating == 0){
        alertRating();
        if(comment == "" || comment == " " ){
            return alertMessage();
        }
    }else if(comment == "" || comment == " " ){
        return alertComment();
    }
}

function getRating(){
    var star1 = document.getElementById('star1');
    var star2 = document.getElementById('star2');
    var star3 = document.getElementById('star3');
    var star4 = document.getElementById('star4');
    var star5 = document.getElementById('star5');

    if(star5.classList.contains('checked')){
        return 5;
    }else if(star4.classList.contains('checked')){
        return 4;
    }else if(star3.classList.contains('checked')){
        return 3;
    }else if(star2.classList.contains('checked')){
        return 2;
    }else if(star1.classList.contains('checked')){
        return 1;
    }else{
        return 0;
    }
}

function alertRating(){
    var retVal = confirm("Are you sure you want to give this book 0 stars?");
    return retVal;
}

function alertComment(){
    var retVal = confirm("Are you sure you want to leave an empty comment?");
    return retVal;
}

function alertMessage(){
    alert("Please explain why you're leaving 0 stars.");
}

function getDate(){
    var date = new Date();
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();

    date = mm + '/' + dd + '/' + yyyy;

    return date;
}