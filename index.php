<?php
 require_once "connect.php";

 function h($str) {
        return htmlspecialchars($str ?? '', ENT_QUOTES, 'UTF-8');
    }

 $errors = [];

    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        $uname = $_POST['uname'];
        $password = $_POST['password'];

        $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->bind_param("s", $uname);
        $stmt->execute();
        $result = $stmt->get_result();

        $user = $result->fetch_assoc();

        $stmt->close();

        if($user && $password === $user['password']){
            if($user['status'] !== "approved"){
                $errors[] = "Your account is not approved yet.";
            } else {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['role'] = $user['role'];
                header("Location: storage.html");
                exit();
            }
        } else {
            $errors[] = "Invalid username or password.";
        }
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Banana Len</title>
</head>
<body>
    <h2>Banana Len Sign In Page</h2>
    <?php foreach($errors as $e):?>
        <p style='color: red;'><?=h($e)?></p>
    <?php endforeach;?>
    <form action="" method="post">
        <label for="">Username:</label>
        <input type="text" id="" name="uname" placeholder="Enter your username" required autofocus>
        <br>
        <label for="">Password:</label>
        <input type="password" id="" name="password" placeholder="Enter your password" required>
        <br>
        <input type="submit" value="Sign In">
    </form>
    <p>Don't have an account? <a href="register.php">Register here</a></p>
</body>
</html>