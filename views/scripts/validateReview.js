function toggleAnon(){
    if(document.getElementById('anonymous').checked == true){
        console.log('anon')
        document.getElementById('nickname').innerHTML = 'Comment as: Anonymous';
    }else{
        document.getElementById('nickname').innerHTML = 'Comment as: ' + document.getElementById('invisibleNickname').innerHTML;
    }
}

function validateReview(){
    var comment = document.getElementById('comment').value;
    var date = document.getElementById('date');
    date.value = getDate();
    var anonymous = document.getElementById('anonymous').checked;
    var rating = getRating();
    var formRating = document.getElementById('rating');
    formRating.value = rating;

    if(rating == 0){
        console.log('0 rating')
        document.getElementById('ratingWarning').classList.remove('d-none');
        if(comment == "" || comment == " " ){
            document.getElementById('commentWarning').classList.remove('d-none');
        }else{
            if(!document.getElementById('commentWarning').classList.contains("d-none")){
                document.getElementById('commentWarning').classList.add("d-none")
            }
        }
        return false;
    }else{
        if(!document.getElementById('ratingWarning').classList.contains("d-none")){
            document.getElementById('ratingWarning').classList.add('d-none');
            if(comment == "" || comment == " " ){
                document.getElementById('commentWarning').classList.remove('d-none');
                return false;
            }else{
                if(!document.getElementById('commentWarning').classList.contains("d-none")){
                    document.getElementById('commentWarning').classList.add("d-none");
                }
                return true;
            }
        }else{
            if(comment == "" || comment == " " ){
                document.getElementById('commentWarning').classList.remove('d-none');
                return false;
            }
        }
    }
}

function commentEventListener(){

    var text = document.getElementById('text');
    function resize () {
        text.style.height = 'auto';
        text.style.height = text.scrollHeight+'px';
    }
    /* 0-timeout to get the already changed text */
    function delayedResize () {
        window.setTimeout(resize, 0);
    }
    observe(text, 'change',  resize);
    observe(text, 'cut',     delayedResize);
    observe(text, 'paste',   delayedResize);
    observe(text, 'drop',    delayedResize);
    observe(text, 'keydown', delayedResize);

    text.focus();
    text.select();
    resize();
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
