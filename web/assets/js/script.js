/* Local Storage */
const storage = window.localStorage;
const db = {
    get: function (key) {
        return JSON.parse(storage.getItem(key));
    },
    set: function (key, value) {
        storage.setItem(key, JSON.stringify(value));
    },
    remove: function (key) {
        storage.removeItem(key);
    }
}

$('#button-search').on('click', function () {
    const value = $('#search-input').val();
    const endpoint = `?s=${value}`;
    const url = `${endpoint}`;

    window.location.href = window.location.pathname + url;
})

$('.see-detail').on('click', function () {
    console.log('masuk');
    $('.modal-title').text('');
    $('.modal-body').html(`
        <div class="text-center">
            <b>Please Wait!!!</b>
            <br>
            <img src="assets/image/menhera.gif" class="rounded">
        </div>  
    `);

    $.getJSON('http://localhost:4873/api/' + $(this).data('endpoint'), function (result) {
        const data = result.data;

        $('.modal-title').text(`${data.title ? data.title : 'Invalid Name'}`);

        $('.modal-body').html(`
        <div class="container-fluid">
        <div class="row">
                    <div class="col-md-4">
                    <img src="${data.thumb}" class="img-fluid" alt="...">
                    </div>
                    <div class="col-md-8">
                    <ul class="list-group">
                            <li class="list-group-item"><b>Alternatif:</b> ${data.alter.length > 1 ? data.alter.join(', ') : data.alter}</li>
                            <li class="list-group-item"><b>Status:</b> ${data.status}</li>
                            <li class="list-group-item"><b>Pengarang:</b> ${data.pengarang.map(a => `<a href="${a.link}">${a.name}</a>`).join(', ')}</li>
                            <li class="list-group-item"><b>Ilustrator:</b> ${data.illustrator.map(a => `<a href="${a.link}">${a.name}</a>`).join(', ')}</li>
                            <li class="list-group-item"><b>Genre:</b> ${data.genre.map(a => `<a href="${a.link}">${a.name}</a>`).join(', ')}</li>
                            <li class="list-group-item"><b>Score:</b> ⭐${data.score}</li>
                        </ul>
                        </div>
                </div>
                
                <hr>
                <div class="row">
                <div class="col-sm-12">
                <p>${data.sinopsis}</p>
                    </div>
                    </div>
                <hr>
                <div class="row">
                    <div class="col-sm-12">
                        <table class="table table-striped table-bordered table-paginate" cellspacing="0">
                        <tbody>
                                ${generateChapterList(data.chapters).join('\n')}
                                </tbody>
                                </table>
                    </div>
                    </div>
            </div>
            `);


    });
});


function generateChapterList(array) {
    const temp = [];
    array.forEach(function (a, i) {
        temp.push(`
            <tr>    
                <td>${a.title}</td>
                <td><a href="?c=${a.endpoint}" target="_blank"><button type="button" class="btn btn-dark btn-sm btn-block">Baca Komik</button></a></td>
                <td><a href="${a.download.pdf}"><button type="button" class="btn btn-dark btn-sm btn-block"><i class="fa fa-download"></i></button></a></td>
            </tr>
        `);
    });

    return temp;
};


$('.favorite').on('click', function () {
    const endpoint = $(this).data('endpoint');
    const classes = $(this).attr('class');
    const changeClass = classes.replace('btn-dark', 'btn-danger');
    const changeClass2 = classes.replace('btn-danger', 'btn-dark');

    const toChange = $(this);

    $.getJSON('http://localhost:4873/api/' + endpoint, function (result) {
        const data = result.data;
        const favorites = db.get('favorites');

        if (favorites) {
            const findSame = favorites.find(a => a.endpoint === data.endpoint);
            if (findSame) {
                favorites.splice(favorites.indexOf(findSame), 1);
                db.set('favorites', favorites);

                $(toChange).attr('class', changeClass2);
                alert(`${data.title} sudah dihapus dalam daftar favorit!`);
            } else {
                db.set('favorites', JSON.parse(favorites).concat(data));
                $(toChange).attr('class', changeClass);

                alert('Sudah Masuk ke dalam daftar Favorit!');
            }
        } else {
            db.set('favorites', [data]);
            alert(`${data.title} sudah masuk ke dalam daftar Favorit!`);
        }
    })
});

/* Back to Top */
let mybutton = document.getElementById("btn-back-to-top");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
    ) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}
// When the user clicks on the button, scroll to the top of the document
mybutton.addEventListener("click", backToTop);

function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}