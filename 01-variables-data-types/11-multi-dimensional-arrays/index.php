<?php
$output = null;

// multi-dimensional array
$fruits = [
    ["apple", "red"],
    ["banana", "yellow"],
    ["orange", "orange"]
];

$output = $fruits[1][0]; // Accessing "banana"
$fruits[] = ["grape", "purple"]; // Adding a new fruit to the array

$users = [
    [
        "name" => "John Doe",
        "email" => "john@gmail.com",
        "age" => 30
    ],
    [
        "name" => "Mary Jane",
        "email" => "mary@gmail.com",
        "age" => 25
    ],
    [
        "name" => "Falicia Jones",
        "email" => "falicia@gmail.com",
        "age" => 28
    ]
];
$output = $users[0][1]; // Accessing the email of the first user (John Doe)
/* 
This is an associative array, meaning its keys are strings ("name", "email", "age"), not numeric indices like 0, 1, 2.

When you then try to access $users[0][1], PHP looks for a key 1 within that associative array, which doesn't exist, leading to the warning.
*/
$output = $users[0]["email"]; // Accessing the email of the first user (John Doe) correctly 

$users[] = [
    "name" => "Jane Smith",
    "email" => "jane@gmail.com",
    "age" => 26
]; // Adding a new user to the array
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

            <h2 class="text-2xl font-bold">User Information</h2>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6 mt-6">
            <p>
            <pre>
<?php print_r($users) ?>
    </pre>
            </p>

        </div>
        <div class="bg-white rounded-lg shadow-md p-6 mt-6">
            <p class="text-xl"><?= $output ?></p>

        </div>
    </div>
</body>

</html>