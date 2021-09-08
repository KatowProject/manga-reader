<?php defined('BASEPATH') or die('No direct script access allowed'); 
    $url = 'http://127.0.0.1:4873/komikindo/api/chapter/'.urlencode($_GET['c']);
    $response = getSearch($url);

    $next = $response['data']['chapter']['next'];
    $prev = $response['data']['chapter']['previous'];
    $title = $response['data']['chapter_name'];
    $images = $response['data']['chapter_images'];

    echo "<script>document.title='$title'</script>"
?>
    <hr>
    <div class="row mt-4 justify-content-center">
        <p><h2 class="text-justify"><?php echo $title ?></h2></p>
    </div>
    <hr>

    <div class="row mt-4">
        <div class="col-sm-12">
            <div class="row flex justify-content-center">
                <div class="btn-group btn-group-toggle btn-group-lg btn-block">
                    <?php 
                    if ($prev != null) {
                        echo "<a href='/komikindo/chapter/$prev' class='btn btn-outline-secondary'>Previous</a>";
                    } else {
                        echo "<a href='#' class='btn btn-outline-secondary disabled'>Previous</a>";
                    }
                    
                    if ($next != null) {
                        echo "<a href='/komikindo/chapter/$next' class='btn btn-outline-secondary'>Next</a>";
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
        <?php foreach ($images as $image) echo "<img src='$image' class='img-fluid' alt='Responsive image'>"?>
    </div>
<hr>
    <div class="row mt-4">
        <div class="col-sm-12">
            <div class="row flex justify-content-center">
                <div class="btn-group btn-group-toggle btn-group-lg btn-block">
                    <?php 
                    if ($prev != null) {
                        echo "<a id='prev' href='/komikindo/chapter/$prev' class='btn btn-outline-secondary'>Previous</a>";
                    } else {
                        echo "<a href='#' class='btn btn-outline-secondary disabled'>Previous</a>";
                    }
                    
                    if ($next != null) {
                        echo "<a id='next' href='/komikindo/chapter/$next' class='btn btn-outline-secondary'>Next</a>";
                    } else {
                        echo "<a href='#' class='btn btn-outline-secondary disabled'>Next</a>";
                    }
                    ?>
                </div>
            </div>
        </div>
    </div>
<hr>