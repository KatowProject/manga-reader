<?php 
    defined('BASEPATH') or die("No Access Allowed");
    $query = $_GET['s'];

    $url = "http://127.0.0.1:4873/otakudesu/api/search/$query";
    $response = getSearch($url);
    
    $komik_list = $response['data'];
    $len = count($komik_list);

    if ($len > 0): ?>
    <div class="row" id="manga-list">
        <div class="col-md-12"> 
            <hr>
            <h2 class="text-center"> Hasil Pencarian: </h3>
            <hr>
        </div>
    <?php foreach ($komik_list as $value):
                $thumb = $value['thumb'];
                $title = $value['name'];
                $endpoint = $value['endpoint'];
    ?>
        <div class="col-md-3">
            <div class="card mb-3" style="width: auto;">
                <img src=<?php echo $thumb ?> class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title text-center"><?php echo $title ?></h5>
                    <a class="btn btn-dark btn-sm btn-block see-detail" href="#" data-toggle="modal" data-source="otakudesu" data-endpoint=<?php echo $endpoint ?> data-target="#exampleModal">Detail</a>
                </div>
            </div>
        </div>
        <?php endforeach; ?>
    </div>
<?php else: 
   // echo "<script>alert('Manga tidak ditemukan!')</script>";
endif; ?>
