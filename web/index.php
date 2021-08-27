<?php define('BASEPATH', dirname(__FILE__)); 
    require('./curl.php');
?>

<!doctype html>
<html lang="id">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="assets/image/kato.png" />
    <!--CSS-->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css" 
        integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l" crossorigin="anonymous">
    <link rel="stylesheet" href="assets/css/default.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" 
        integrity="sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ==" 
            crossorigin="anonymous" referrerpolicy="no-referrer" />

    <title>Manga Reader</title>
</head>

<body class="d-flex flex-column min-vh-100">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <a class="navbar-brand" href="/">
            <img src="https://cdn.discordapp.com/emojis/750342786825584811.png" width="30" height="30"
                class="d-inline-block align-top" alt="">Manga Reader</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item">
                    <a class="nav-link" href="#favorite" target="_blank">Favorite</a>
                </li>
            </ul>
            <!-- <form class="form-inline my-lg-0">
                <input type="text" class="form-control" placeholder="Title...." id="search-input">
                <div class="input-group-prepend">
                    <button class="btn btn-outline-light" type="button" id="button-search">Search</button>
                </div>
            </form> -->
        </div>
    </nav>

    <div class="container" id="mangas">
    <?php 
        $s = isset($_GET['s']) ? $_GET['s'] : null;
        $c = isset($_GET['c']) ? $_GET['c'] : null; 
        if ($s) {
            require('./search.php');
        } else if ($c) { 
            require('./chapter.php');
        } else { ?>
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
    <?php } ?>

    </div>
    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel"></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                </div>
            </div>
        </div>
    </div>

    <button type="button" class="btn btn-danger btn-floating btn-lg" id="btn-back-to-top">
        <i class="fas fa-arrow-up"></i>
    </button>
    <!-- Footer -->
    <footer class="page-footer font-small mt-auto">
    <!-- Copyright -->
    <div class="footer-copyright text-center py-3">© 2021 All Rights Reserved.
        <a href="https://github.com/KatowProject/"> KatowProject</a>
    </div>
    <!-- Copyright -->
    </footer>
    <!-- Footer -->

    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"
        integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.bundle.min.js" 
        integrity="sha384-Piv4xVNRyMGpqkS2by6br4gNJ7DXjqk09RmUpJ8jgGtD7zP9yug3goQfGII0yAns" crossorigin="anonymous"></script>
    
    <!-- Optional JavaScript -->
    <script src="assets/js/script.js"></script>

</body>

</html>