<?php  define('BASEPATH', dirname(__FILE__));
    ob_start();
    session_start([
      'cookie_lifetime' => 86400,
  ]);

    require('./curl.php');

    if (isset($_SESSION['user_id'])) {
        header('Location: /');
    }

    if (isset($_POST['submit'])) {

        $user = $_POST['user'];
        $pass = $_POST['pass'];

        if ($user == "" || $pass == "") {
            echo "<script>alert('Username tidak boleh kosong')</script>";
        } else {
            $body = json_encode([
              'username' => $user,
              'password' => $pass
            ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
            
            $response = auth($body);
            
            if ($response['success'] == true) {
                $_SESSION['user_id'] = $response['data']['user_id'];
                $_SESSION['username'] = $response['data']['username'];

                header('Location: /');
            } else {
                $err_message = $response['message'];
                echo "<script>alert('$err_message')</script>";
            }
        }
    }

    function redirect($url, $statusCode = 303){
      header('Location: ' . $url, true, $statusCode);
      die();
   }
?>

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Login Page">
    <meta name="author" content="Katoww">
    <meta name="generator" content="w">
    <link rel="icon" type="image/png" href="https://cdn.discordapp.com/emojis/750342786825584811.png" />
    <title>Login · Manga Reader</title>

    

    <!-- Bootstrap core CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
      .bd-placeholder-img {
        font-size: 1.125rem;
        text-anchor: middle;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
      }

      @media (min-width: 768px) {
        .bd-placeholder-img-lg {
          font-size: 3.5rem;
        }
      }
    </style>

    
    <!-- Custom styles for this template -->
    <link href="/assets/css/signin.css" rel="stylesheet">
  </head>
  <body class="text-center">
    
<main class="form-signin">
  <form action="" method="post">
    <img class="mb-4" src="https://cdn.discordapp.com/emojis/750342786825584811.png" alt="" width="75" height="75">
    <h1 class="h3 mb-3 fw-normal">Please sign in</h1>

    <div class="form-floating">
      <input type="username" class="form-control" id="floatingInput" placeholder="name@example.com" name="user">
      <label for="floatingInput">Username</label>
    </div>
    <div class="form-floating">
      <input type="password" class="form-control" id="floatingPassword" placeholder="Password" name="pass" required>
      <label for="floatingPassword">Password</label>
    </div>

    <div class="checkbox mb-3">
      <label>
        <input type="checkbox" value="remember-me"> Remember me
      </label>
    </div>
    <button type="submit" name="submit" value="submit" class="w-100 btn btn-lg btn-dark">Sign in</button>
    <p class="mt-5 mb-3 text-muted">&copy; <?php echo date('Y'); ?></p>
  </form>
</main>
    
  </body>
</html>
