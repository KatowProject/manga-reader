<?php 
    defined('BASEPATH') or die("No Access Allowed");

    $url = 'http://127.0.0.1:4873/api/cari/'.urlencode($_GET['s']);
    $response = getSearch($url);
    $len = count($response);
    $komik_list = $response['data'];

    if ($len > 0) { ?>
    <div class="row py-5" id="manga-list">
        <div class="col-md-12 py-3"> <h2 class="text-center"> Hasil Pencarian: </h3></div>
    <?php foreach ($komik_list as $value) { 
                $thumb = $value['thumb'];
                $title = $value['title'];
                $endpoint = $value['link']['endpoint'];
    ?>
        <div class="col-md-4">
            <div class="card mb-3" style="width: auto;">
                <img src=<?php echo $thumb ?> class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title text-center"><?php echo $title ?></h5>
                    <a class="btn btn-dark btn-sm btn-block see-detail" href="#" data-toggle="modal" data-endpoint=<?php echo $endpoint ?> data-target="#exampleModal">Detail</a>
                    <a class="btn btn-dark btn-sm btn-block favorite" data-toggle="modal" data-endpoint=<?php echo $endpoint ?> data-target="">⭐</a>
                </div>
            </div>
        </div>

        <?php } ?>
        <hr>
    </div>

<?php } ?>