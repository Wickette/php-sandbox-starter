<?php
$output = null;
$ids = [10, 22, 15, 45, 33, 67];
$users = array("user1", "user2", "user3");

// count() function counts the number of elements in an array
$output = count($ids);

// sort() function sorts an array in ascending order
sort($ids);

//rsort() function sorts an array in descending order
rsort($ids);
rsort($users);

// array_push() function adds one or more elements to the end of an array
array_push($users, "user4", "user5");
array_push($ids, 100);

// array_pop() function removes the last element from an array
array_pop($users);
array_pop($ids);

// array_shift() function removes the first element from an array
array_shift($users);
array_shift($ids);

// array_unshift() function adds one or more elements to the beginning of an array
array_unshift($users, "user3");
array_unshift($ids, 5);

// array_slice() function returns a portion of an array
$ids2 = array_slice($ids, 2, 3); // returns 33, 22, 15
// var_dump($ids2);

//r_splice() function removes a portion of an array and replaces it with something else
array_splice($ids, 1, 1, "New Id");
array_splice($users, 0, 1, "New User");

// array_sum() function calculates the sum of values in an array
array_splice($ids, 1, 1, 100); // remove the "New Id" string to avoid errors)
$output = "Sum of IDs: " . array_sum($ids);

// array_search() function searches an array for a specific value and returns the key if found
$output = "User 4 is at index: " . array_search("user4", $users);

// in_array() function checks if a value exists in an array
array_push($users, "user3");
$output = "Is user3 in the users array? " . (in_array("user3", $users) ? "Yes" : "No");

// explode() function splits a string into an array
$string = "Hello,World,PHP,From,Scratch";
$exploded = explode(",", $string);
// var_dump($exploded);

// implode() function joins array elements into a string
$imploded = implode("-", $users);
// var_dump($imploded);
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <title>PHP From Scratch</title>
</head>

<body class="bg-gray-100">
  <header class="bg-blue-500 text-white p-4">
    <div class="container mx-auto">
      <h1 class="text-3xl font-semibold">PHP From Scratch</h1>
    </div>
  </header>
  <div class="container mx-auto p-4 mt-4">
    <div class="bg-white rounded-lg shadow-md p-6 mt-6">
      <p class="text-xl"><?= $output ?></p>
    </div>
    <div class="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 class="text">ID's Array:</h2>
      <p>
      <pre><?= print_r($ids) ?></pre>
      </p>
    </div>
    <div class="bg-white rounded-lg shadow-md p-6 mt-6">

      <h2 class="text">Users Array:</h2>
      <p>
      <pre><?= print_r($users) ?></pre>
      </p>
    </div>
  </div>
</body>

</html>