<?php
$output = null;

// associative array    

$user = [
    'name' => 'John Doe',
    'email' => 'john@gmail.com',
    'password' => 'password123',
    'hobbies' => ['coding', 'gaming', 'traveling']
];

$output = $user["name"];
$output = $user["email"];
$output = $user["hobbies"][1];


$user["address"] = "123 Main St, Anytown, USA";
unset($user["address"]);
$output = $user["address"];
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
<?php print_r($user) ?>
    </pre>
            </p>

        </div>
        <div class="bg-white rounded-lg shadow-md p-6 mt-6">
            <p class="text-xl"><?= $output ?></p>

        </div>
    </div>
</body>

</html>