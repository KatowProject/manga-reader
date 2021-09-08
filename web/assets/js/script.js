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

function getSearch(source) {

    if (source === 'komikindo') {
        const value = $('#search-input').val();
        const endpoint = `/${source}/search/page/1/?s=${value}`;
        const url = `${endpoint}`;

        window.location.href = url;
    } else if (source === 'mangabat') {
        const value = $('#search-input').val();
        const endpoint = `/${source}/search/${value}/?page=1`

        window.location.href = endpoint;
    }

}


$('#mangas').on('click', '.see-detail', function () {
    console.log('masuk');
    $('.modal-title').text('');
    $('.modal-body').html(`
        <div class="text-center">
            <b>Please Wait!!!</b>
            <br>
            <img src="/assets/image/menhera.gif" class="rounded">
        </div>  
    `);

    const source = $(this).data('source');
    if (source === 'komikindo') {
        $.getJSON('http://komikato.bugs.today/komikindo/api/' + $(this).data('endpoint'), function (result) {
            const data = result.data;

            $('.modal-title').text(`${data.title ? data.title : 'Invalid Name'}`);

            let isScroll = '';
            if (data.chapters.length > 7) isScroll = `style="overflow-y: scroll; height:400px;"`;
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
                    <div class="col-sm-12" ${isScroll}">
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
    } else if (source === 'mangabat') {
        $.getJSON(`http://127.0.0.1:4873/mangabat/api/comic/${$(this).data('endpoint')}`, function (result) {
            const data = result.data;

            $('.modal-title').text(`${data.title ? data.title : 'Invalid Name'}`);

            let isScroll = '';
            if (data.chapters.length > 7) isScroll = `style="overflow-y: scroll; height:400px;"`;
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
                            <li class="list-group-item"><b>Author:</b> ${data.author.map(a => `<a href="${a.link}">${a.name}</a>`).join(', ')}</li>
                            <li class="list-group-item"><b>Genre:</b> ${data.genre.map(a => `<a href="${a.url}">${a.name}</a>`).join(', ')}</li>
                        </ul>
                    </div>
                </div>
                
                <hr>

                <div class="row">
                    <div class="col-sm-12">
                        <p>${data.synopsis}</p>
                    </div>
                </div>

                <hr>

                <div class="row">
                    <div class="col-sm-12" ${isScroll}">
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
    }
});


function generateChapterList(array) {
    const temp = [];

    const firstPath = window.location.pathname.split('/')[1];
    array.forEach(function (a, i) {
        temp.push(`
            <tr>    
                <td>${a.name ? a.name : a.title}</td>
                <td><a href="/${firstPath}/chapter/${a.link.endpoint ? a.link.endpoint : a.endpoint}" target="_blank"><button type="button" class="btn btn-dark btn-sm btn-block">Baca Komik</button></a></td>
                <td><a href="#"><button type="button" class="btn btn-dark btn-sm btn-block"><i class="fa fa-download"></i></button></a></td>
            </tr>
        `);
    });

    return temp;
};


$('#mangas').on('click', '.favorite', function () {
    const endpoint = $(this).data('endpoint');
    const classes = $(this).attr('class');
    const changeClass = classes.replace('btn-dark', 'btn-danger');
    const changeClass2 = classes.replace('btn-danger', 'btn-dark');

    const toChange = $(this);

    $.getJSON('http://127.0.0.1:4873/komikindo/api' + endpoint, function (result) {
        const data = result.data;
        console.log(endpoint);
        const favorites = db.get('favorites');

        if (favorites) {
            const findSame = favorites.find(a => a.link.endpoint === data.link.endpoint);
            console.log(findSame);
            if (findSame) {
                favorites.splice(favorites.indexOf(findSame), 1);
                db.set('favorites', favorites);

                $(toChange).attr('class', changeClass2);
                alert(`${data.title} sudah dihapus dalam daftar favorit!`);
            } else {
                console.log(data);
                db.set('favorites', favorites.concat(data));
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

/*Get Favorite*/
function getFavorite() {
    const mangas = db.get('favorites');
    $('#mangas').append(`
        <hr>
        <div class="row" id="result-text"></div>
        <div class="row" id="manga-list"></div>
    `);
    if (mangas.length > 0) {
        $.each(mangas, function (index, value) {
            $('#manga-list').append(`
            <div class="col-md-4">
                <div class="card mb-3" style="width: auto;">
                    <img src="${value.thumb}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${value.title}</h5>
                            <a href="#" class="btn btn-dark btn-sm btn-block see-detail" data-toggle="modal" data-endpoint=komik/${value.link.endpoint} data-target="#exampleModal">Detail</a>
                            <a href="#" class="btn btn-danger btn-sm btn-block favorite" data-toggle="modal" data-endpoint=komik/${value.link.endpoint} data-target>⭐</a>
                        </div>
                </div>
            </div>
            `);
        });
    } else {
        $('#manga-list').html(`
            <div class="col">
                <h2 class="text-center">Belum ada manga yang difavorite</h2>
            </div>
        `);
    }
}

/* Navigator with Arrow Keyboard */
$(document).on('keyup', function (e) {
    switch (e.keyCode) {
        case 37:
            window.location.href = $('#prev').attr('href');
            break;

        case 39:
            window.location.href = $('#next').attr('href');
            break;
    }
});