<?php
 require_once "connect.php";

 function h($str) {
        return htmlspecialchars($str ?? '', ENT_QUOTES, 'UTF-8');
    }
 $messages = [];
 $errors = [];

    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        $uname = $_POST['uname'];
        $password = $_POST['password'];
        $confirm_password = $_POST['confirm_password'];

        if($password !== $confirm_password){
            $errors[] = "Passwords do not match.";
        }else{
        $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        $stmt->bind_param("ss", $uname, $password);
        $stmt->execute();
        $result = $stmt->get_result();

        if($stmt->affected_rows > 0){
            $messages[] = "Registration successful. Please wait for account approval.";
        }else{
            $errors[] = "Registration failed. Please try again.";
        }
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
    <h2>Banana Len Register Page</h2>
    <?php foreach($errors as $e):?>
        <p style='color: red;'><?=h($e)?></p>
    <?php endforeach;?>
    <br>
    <?php foreach($messages as $m):?>
        <p style='color: green;'><?=h($m)?></p>
    <?php endforeach;?>
    <form action="" method="post">
        <label for="">Username:</label>
        <input type="text" id="" name="uname" placeholder="Enter your username" required autofocus>
        <br>
        <label for="">Password:</label>
        <input type="password" id="" name="password" placeholder="Enter your password" required>
        <br>
        <label for="">Confirm Password:</label>
        <input type="password" id="" name="confirm_password" placeholder="Confirm your password" required>
        <br>
        <input type="submit" value="Register">
    </form>
    <p>Already have an account? <a href="index.php">Sign in here</a></p>
</body>
</html>