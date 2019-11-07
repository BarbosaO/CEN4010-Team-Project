function validateReview(){
    var comment = document.getElementById('comment').value;
    var date = document.getElementById('date');
    date.value = getDate();
    var anonymous = document.getElementById('anonymous').checked;
    var rating = getRating();
    var formRating = document.getElementById('rating');
    formRating.value = rating;

    if(rating == 0){
        //if rating warning is already visible - then user wants to leave rating 0
        if(!document.getElementById('ratingWarning').classList.contains("d-none")){
            if(comment == "" || comment == " " ){
                document.getElementById('commentWarning').classList.remove('d-none');
                return false;
            }else{
                return true;
            }
        }else{
            document.getElementById('ratingWarning').classList.remove('d-none');
            if(comment == "" || comment == " " ){
                document.getElementById('commentWarning').classList.remove('d-none');
            }
            return false;
        }
    }else if(comment == "" || comment == " " ){
        document.getElementById('commentWarning').classList.remove('d-none');
        return false;
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

function getDate(){
    var date = new Date();
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();

    date = mm + '/' + dd + '/' + yyyy;

    return date;
}