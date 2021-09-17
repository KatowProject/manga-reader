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
    $('.modal-title').text('');
    $('.modal-body').html(`
        <div class="text-center">
            <b>Please Wait!!!</b>
            <br>
            <img src="/assets/image/menhera.gif" class="rounded">
        </div>  
    `);

    const source = $(this).data('source');
    switch (source) {
        case 'komikindo':
            $.getJSON('/komikindo/api/' + $(this).data('endpoint'), function (result) {
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
            break;

        case 'mangabat':
            $.getJSON(`/mangabat/api/comic/${$(this).data('endpoint')}`, function (result) {
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
            break;
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
                <td><a href="/${firstPath}/download/${a.link.endpoint ? a.link.endpoint : a.endpoint}"><button type="button" class="btn btn-dark btn-sm btn-block"><i class="fa fa-download"></i></button></a></td>
            </tr>
        `);
    });

    return temp;
};

/* Add Favorite */
$('.favorite').on('click', async function () {
    const cookie = document.cookie.split(';');
    const btn = $(this);

    const username = cookie[2].split('=')[1];
    const endpoint = $(this).data('endpoint');

    const data = await $.get(`/komikindo/api/${endpoint}`);
    if (!data.success) return;

    const json = {
        username: username,
        type: 'add',
        favorites: data.data
    };

    $.ajax({
        url: `/api/account/favorit`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(json)
    }).done(function (result) {
        if (result.success) {
            btn.removeClass('btn-dark').addClass('btn-danger');
            btn.removeClass('favorite').addClass('unfavorite');
            alert('Telah berhasil ditambahkan ke daftar favorit!');
        } else {
            alert(result.message);
        }
    })
});

$('.unfavorite').on('click', async function () {
    const cookie = document.cookie.split(';');
    const btn = $(this);

    const username = cookie[2].split('=')[1];
    const endpoint = $(this).data('endpoint');

    const data = await $.get(`/komikindo/api/${endpoint}`);
    if (!data.success) return;

    const json = {
        username: username,
        type: 'remove',
        favorites: data.data
    };

    $.ajax({
        url: `/api/account/favorit`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(json)
    }).done(function (result) {
        if (result.success) {
            btn.removeClass('btn-danger').addClass('btn-dark');
            btn.removeClass('unfavorite').addClass('favorite');
            alert('Telah berhasil dihapus dari daftar favorit!');
        } else {
            alert(result.message);
        }
    });

});

/* Dynamic Pagination */
$('#pagination').on('click', 'a', function () {
    const source = $(this).data('source');
    const endpoint = $(this).data('endpoint');

    switch (source) {
        case 'komikindo':
            $.getJSON(`/komikindo/api/${endpoint}`, function (result) {
                $('#manga-list').html('');
                $('#pagination').html('');

                const datas = result.data;
                datas.manga.forEach(function (a, i) {
                    $('#manga-list').append(`
                    <div class="col-md-3">
                        <div class="card mb-3" style="width: auto;">
                            <img src=${a.thumb} class="card-img-top" alt="">
                            <div class="card-body">
                                <h5 class="card-title text-center">${a.title}</h5>
                                <a class="btn btn-dark btn-sm btn-block see-detail" href="#" data-toggle="modal" data-source="komikindo" data-endpoint=${a.link.endpoint} data-target="#exampleModal">Detail</a>
                            </div>
                        </div>
                    </div>
                    `);
                });

                datas.pagination.forEach(function (a, i) {
                    if (!a.url && !a.endpoint) {
                        $('#pagination').append(`<li class='page-item active'><a class='page-link bg-dark text-white'>${a.name}</a></li>`);
                    } else if (a.endpoint.includes('page')) {
                        $('#pagination').append(`<li class='page-item'><a class='page-link text-dark' data-source='komikindo' data-endpoint=${a.endpoint} href='#'>${a.name}</a></li>`);
                    } else {
                        $('#pagination').append(`<li class='page-item'><a class='page-link text-dark' data-source='komikindo' data-endpoint=${a.endpoint}/page/1 href='#'>${a.name}</a></li>`);
                    }
                });
            });
    }
})