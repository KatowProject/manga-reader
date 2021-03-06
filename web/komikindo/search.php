<?php 
    defined('BASEPATH') or die("No Access Allowed");
    
    $query = $_GET['s'];
    $pagination = $_GET['p'] ? $_GET['p'] : 1;

    $query = str_replace(' ', '+');
    $url = "http://127.0.0.1:4873/komikindo/api/cari/$query/page/$pagination";
    $response = getSearch($url);
    $len = count($response['data']['manga']);
    $komik_list = $response['data'];

    $body_array = json_encode([
        'username' => $_COOKIE['username'],
        'type' => 'list'
    ]);
    $response_fav = getList($body_array);

    if ($len > 0): ?>
    <div class="row" id="manga-list">
        <div class="col-md-12"> 
            <hr>
            <h2 class="text-center"> Hasil Pencarian: </h3>
            <hr>
        </div>
    <?php foreach ($komik_list['manga'] as $value): 
                $thumb = $value['thumb'];
                $title = $value['title'];
                $endpoint = $value['link']['endpoint'];
    ?>
        <div class="col-md-3">
            <div class="card mb-3" style="width: auto;">
                <img src=<?php echo $thumb ?> class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title text-center"><?php echo $title ?></h5>
                    <a class="btn btn-dark btn-sm btn-block see-detail" href="#" data-toggle="modal" data-source="komikindo"data-endpoint=<?php echo $endpoint ?> data-target="#exampleModal">Detail</a>
                    <?php
                    $sss = "<a class='btn btn-dark btn-sm btn-block favorite' data-toggle='modal' data-endpoint='$endpoint' data-target=''>⭐</a>";
                    
                    foreach ($response_fav['data'] as $favv):
                        if (strpos($favv['title'], $title) !== false):
                            $sss = "<a class='btn btn-danger btn-sm btn-block unfavorite' data-toggle='modal' data-endpoint='$endpoint' data-target=''>⭐</a>";
                        endif;
                    endforeach;
                    echo $sss;
                    ?>
                </div>
            </div>
        </div>
        <?php endforeach; ?>

        <div class="col-md-12">
            <hr>
            <nav aria-label="Page navigation example">
                <ul class="pagination justify-content-center">
                    <?php 
                        foreach ($komik_list['pagination'] as $value):
                            $name = $value['name'];
                            $endpoint = $value['endpoint'];
                            if ($value['url'] == NULL && $value['endpoint'] == NULL):
                                echo "<li class='page-item active'><a class='page-link bg-dark text-white'>$name</a></li>";
                            elseif (preg_match('/\bpage\b/', $value['endpoint']) == false):
                                echo "<li class='page-item'><a class='page-link text-dark' href='/komikindo/search/page/1/$endpoint'>$name</a></li>";
                            else:
                                echo "<li class='page-item'><a class='page-link text-dark' href='/komikindo/search/$endpoint'>$name</a></li>";  
                            endif;
                        endforeach;
                    ?>
                </ul>
            </nav>
            <hr>
        </div>
    </div>
<?php else:
    echo "<script>alert('Manga tidak ditemukan!')</script>";
endif;?>
