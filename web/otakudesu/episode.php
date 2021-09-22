<?php defined('BASEPATH') or die('No direct script access allowed'); 
    $url = 'http://127.0.0.1:4873/otakudesu/api/anime/eps/'.urlencode($_GET['c']);
    $response = getSearch($url);

    $title = $response['data']['title'];
    $stream_link = $response['data']['stream_link'];
    $download_link = $response['data']['download_link'];
    $mirror_link = $response['data']['mirror_stream_link'];
    $eps_list = $response['data']['eps_list'];

    echo "<script>document.title = '$title'</script>";
?>

<hr>
    <div class="row mt-4 justify-content-center">
        <p class="flex-center"><h2><?php echo $title ?></h2></p>
    </div>
<hr>
<br>
    <div class="row mt-4" id="video-player">
        <?php if (preg_match('/\b.html\b/', $stream_link)): ?>
        <div class="embed-responsive embed-responsive-16by9">
            <iframe class="embed-responsive-item" src=<?= $stream_link ?> allowfullscreen></iframe>
        </div>
        <?php elseif (preg_match('/\bgdriveplayer\b/', $stream_link)): ?>
        <div class="embed-responsive embed-responsive-16by9">
            <iframe class="embed-responsive-item" src=<?= $stream_link ?> allowfullscreen></iframe>
        </div>
        <?php else: ?>
        <video id="my-video" class="video-js mx-auto" controls preload="auto" width="800"height="400" poster="https://cdn.discordapp.com/emojis/746208811848695849.png" data-setup="{}">
            <source src=<?php echo $stream_link ?> type="video/mp4" />
        </video>
        <?php endif; ?>
    </div>

    <div class="row mt-3 mx-auto" style="width: 200px;">
        <div class="btn-group" role="group" aria-label="Button group with nested dropdown">
            <a class="btn btn-secondary">Mirror</a>

        <?php foreach ($mirror_link as $mirror): ?>
            <div class="btn-group" role="group">
                <button id="btnGroupDrop1" type="button" class="btn btn-outline-dark dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <?php echo $mirror['name'] ?>
                </button>
                <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                    <?php foreach ($mirror['data'] as $link): ?>
                    <a class="dropdown-item" href="#" data-query=<?php echo $link ['url']?>><?php echo $link['title']?></a>
                    <?php endforeach; ?>
                </div>
            </div>
        <?php endforeach; ?>
        </div>
    </div>

    <div class="row mt-5">
        <div class="input-group">
            <select class="custom-select" id="eps-selected" aria-label="Example select with button addon">
                <?php foreach ($eps_list as $ep):
                    $title = $ep['title'];
                    $endpoint = $ep['endpoint'];

                    if ($ep['url'] == '0' and $ep['endpoint'] == '0'):
                        echo "<option value='0' selected>Choose Episode...</option>";
                    else:
                        echo "<option value='$endpoint'>$title</option>";
                    endif;

                    endforeach;
                ?>
            </select>
            <div class="input-group-append">
                <button class="btn btn-outline-secondary" type="button" id="btn-eps-selected">Go! </button>
            </div>
        </div>
    </div>
<br>
<hr>
    <div class="row mt-4 justify-content-center">
        <p class="flex-center"><h3>Download Link</h3></p>
    </div>
<hr>

<div class="accordion">
    <?php for ($i = 0; $i < count($download_link); $i++):?>

    <div class="card">
        <div class="card-header" id=<?php echo "heading-".$i?> >
            <h4 class="mb-0 text-center">
                <?= $download_link[$i]['name'] ?>
            </h4>
        </div>

        <div class="collapse show">
            <div class="card-body">
                <?php foreach ($download_link[$i]['data'] as $link): ?>
                    <a href="<?php echo $link['url'] ?>" class="btn btn-primary btn-block" target="_blank"> <?php echo $link['title'] ?> </a>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
    <?php endfor; ?>
</div>