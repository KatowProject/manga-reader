<?php defined('BASEPATH') or die('No direct script access allowed'); 
    $url = 'http://127.0.0.1:4873/mangabat/api/chapter/'.urlencode($_GET['c']);

    $response = getSearch($url);
    $next = $response['data']['navigation']['next'];
    $prev = $response['data']['navigation']['prev'];
    $title = $response['data']['chapter_title'];
    $images = $response['data']['chapter_images'];

    echo "<script>document.title='$title'</script>"
?>
    <hr>
    <div class="row mt-4 justify-content-center">
        <p class="flex-center"><h2><?php echo $title ?></h2></p>
    </div>
    <hr>

    <div class="row mt-4">
        <div class="col-sm-12">
            <div class="row flex justify-content-center">
                <div class="btn-group btn-group-toggle btn-group-lg btn-block">
                    <?php 
                    if ($prev != null) {
                        echo "<a href='/mangabat/chapter/$prev' class='btn btn-outline-secondary'>Previous</a>";
                    } else {
                        echo "<a href='#' class='btn btn-outline-secondary disabled'>Previous</a>";
                    }
                    
                    if ($next != null) {
                        echo "<a href='/mangabat/chapter/$next' class='btn btn-outline-secondary'>Next</a>";
                    } else {
                        echo "<a href='#' class='btn btn-outline-secondary disabled'>Next</a>";
                    }
                    ?>
                </div>
            </div>
        </div>
    </div>
    
    <hr>
    <div class="row mt-4 justify-content-center">
        <?php foreach ($images as $image) {
            $img = $image['url'];
            $alt = $image['name'];
            if (preg_match('/\bmangakakalot\b/', $img)) {
                $parse_url = parse_url($img);
                $img_url = 'http://cdn-mangakakalot.snowfagz.workers.dev'.$parse_url['path'];
                echo "<img src='$img_url' class='img-fluid' alt='$alt'>";
            } else if (preg_match('/\bmgicdn\b/', $img)) {
                $parse_url = parse_url($img);
                var_dump($parse_url);
                // $path = base64_decode($img);
                // $img_url = '';
            }
        }?>
    </div>
<hr>
    <div class="row mt-4">
        <div class="col-sm-12">
            <div class="row flex justify-content-center">
                <div class="btn-group btn-group-toggle btn-group-lg btn-block">
                    <?php 
                    if ($prev != null) {
                        echo "<a href='/mangabat/chapter/$prev' class='btn btn-outline-secondary'>Previous</a>";
                    } else {
                        echo "<a href='#' class='btn btn-outline-secondary disabled'>Previous</a>";
                    }
                    
                    if ($next != null) {
                        echo "<a href='/mangabat/chapter/$next' class='btn btn-outline-secondary'>Next</a>";
                    } else {
                        echo "<a href='#' class='btn btn-outline-secondary disabled'>Next</a>";
                    }
                    ?>
                </div>
            </div>
        </div>
    </div>
<hr>