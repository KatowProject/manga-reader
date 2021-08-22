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


/*Checking query paramter*/
const url = window.location.href;
const params = new URL(url);

// if (params.hash == '#favorite') {
//     // <div class="row mt-4 justify-content-center">
//     //     <div class="col">
//     //         <h1 class="text-center">Search Manga</h1>

//     //         <div class="input-group mb-3">
//     //             <input type="text" class="form-control" placeholder="Title...." id="search-input">
//     //             <div class="input-group-append">
//     //                 <button class="btn btn-outline-dark" type="button" id="button-search">Search</button>
//     //             </div>
//     //         </div>
//     //     </div>
//     // </div>
//     $('#mangas').append(`
//         <hr>
//         <div class="row" id="result-text"></div>
//         <div class="row" id="manga-list"></div>
//     `);
// };

if (params.hash.length > 0) {
    console.log(window.location);
    $('#mangas').html(`
                <div class="row mt-4 justify-content-center">
                    <h1> Tunggu sebentar ya! </h1>
                </div>
            `);

    const endpoint = params.hash.substr(1);
    $.getJSON('http://localhost:3000/chapter/' + endpoint, function (result) {
        const data = result.data;

        document.title = `${data.chapter_name}`;

        const images = data.chapter_images.map(a => `<img src="${a}" class="img-fluid" alt="Responsive image">`);
        const nav = data.chapter;
        const next = nav.next ?
            `<a href="#${nav.next}" class="btn btn-dark navv" target="_blank">Chapter Selanjutnya</a> `
            : `<button type="button" class="btn btn-dark mx-1" disabled>Chapter Selanjutnya</button>`;
        const prev = nav.previous ?
            `<a href="#${nav.previous}" class="btn btn-dark mx-1 navv" target="_blank">Chapter Sebelumnya</a>`
            : `<button type="button" class="btn btn-dark mx-1" disabled>Chapter Sebelumnya</button>`;


        $('#mangas').html(`
                <div class="row mt-4 justify-content-center">
                    <p class="text-center"><h1>${data.chapter_name}</h1></p>
                </div>

                <div class="row mt-4 justify-content-center">
                    ${images.join('\n')}
                </div>
                <hr>
                <div class="row mt-4">
                    <div class="col-sm-12">
                        <div class="row flex justify-content-center">
                            <div class="btn-group btn-group-toggle btn-group-lg btn-block mx-1">
                                    ${prev}
                                    ${next}
                            </div>
                        </div>
                    </div>
                </div>
                <hr>
            `);
    });
} else {
    $('#mangas').append(`
        <div class="row mt-4 justify-content-center">
            <div class="col">
                <h1 class="text-center">Search Manga</h1>
    
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="Title...." id="search-input">
                    <div class="input-group-append">
                        <button class="btn btn-outline-dark" type="button" id="button-search">Search</button>
                    </div>
                </div>
            </div>
        </div>
    
        <hr>
        <div class="row" id="result-text"></div>
        <div class="row" id="manga-list"></div>
    `);
}


$('#mangas').on('click', '.navv', function (e) {
    window.close();
});

$('#button-search').on('click', function () {
    searchManga();
});

$('#search-input').on('keyup', function (e) {
    if (e.keyCode == 13) {
        searchManga();
    }
});

$('#manga-list').on('click', '.see-detail', function () {
    $('.modal-title').text('');
    $('.modal-body').html(`
        <div class="text-center">
            <b>Please Wait!!!</b>
                <br>
            <img src="https://cdn.discordapp.com/attachments/795771950076133438/878943216370610216/menhera.gif" class="rounded">
        </div>
        
    `);

    $.getJSON('http://localhost:3000/' + $(this).data('endpoint'), function (result) {
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
                            <li class="list-group-item"><button class="btn btn-outline-dark" type="button">Favorit</button></li>
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

// function addFavorite() {
//     db.set('favorites', [...db.get('favorites'), data]).write();
//     alert('Berhasil ditambahkan ke favorit');
// }

function generateChapterList(array) {
    const temp = [];
    array.forEach(function (a, i) {
        temp.push(`
            <tr>    
                <td>${a.title}</td>
                <td><a href="#${a.endpoint}" target="_blank"><button type="button" class="btn btn-dark btn-sm btn-block">Baca Komik</button></a></td>
                <td><a href="${a.download.pdf}"><button type="button" class="btn btn-dark btn-sm btn-block"><i class="fa fa-download"></i></button></a></td>
            </tr>
        `);
    });

    return temp;
};

function searchManga() {
    let input = $('#search-input').val();
    input = input.split(' ').join('+');
    $('#manga-list').html('');
    $('#result-text').html('');

    $.getJSON('http://localhost:3000/cari/' + input, function (result) {
        console.log(result);
        if (result.data.length > 0) {

            const mangas = result.data;
            $.each(mangas, function (index, value) {
                $('#manga-list').append(`
                <div class="col-md-4">
                    <div class="card mb-3" style="width: 18rem;">
                        <img src="${value.thumb}" class="card-img-top" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${value.title}</h5>
                                <a href="#" class="btn btn-dark btn-sm btn-block see-detail" data-toggle="modal" data-endpoint=${value.link.endpoint} data-target="#exampleModal">Detail</a>
                            </div>
                    </div>
                </div>
                `);
            });
            $('#result-text').html(`<h2>Hasil Pencarian:</h2><br>`);
            $('#search-input').val('');
        } else {
            $('#manga-list').html(`
            <div class="col">
                <h1 class="text-center">Manga tidak ditemukan!</h1>
            </div>
            `);
        }
    });
}