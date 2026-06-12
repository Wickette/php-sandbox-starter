<!-- /*
switch statements are a control structure that allows you to execute different code based on the value of a variable. They are often used as an alternative to if-else statements when you have multiple conditions to check.
The syntax for a switch statement is as follows:

switch (variable) {
    case value1:
        // code to execute if variable == value1
        break;
    case value2:
        // code to execute if variable == value2
        break;
    ...
    default:
        // code to execute if variable does not match any case
}
*/ -->
<?php $dayOfWeek = date('l'); // Get the current day of the week

switch($dayOfWeek){
case "Monday":
  $message = "Monday blues!";
  $color = "blue";
  break;
  case "Tuesday":
  $message = "At least it's not Monday!";
  $color = "green";
  break;
  case "Wednesday":
  $message = "Hump day!";
  $color = "magenta";
  break;
  case "Thursday":
  $message = "Thirsty Thursday!";
  $color = "orange";
  break;
  case "Friday":
  $message = "TGIF!";
  $color = "red";
  break;
  case "Saturday":
  $message = "Have a nice weekend!";
  $color = "purple";
  break;
  case "Sunday":
  $message = "Have a nice weekend!";
  $color = "purple";
  break;
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>What Day Is It?</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Roboto', sans-serif;
      background-color: <?= $color ?>;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
  </style>
</head>

<body>
  <h1><?= $message ?></h1>
</body>

</html>