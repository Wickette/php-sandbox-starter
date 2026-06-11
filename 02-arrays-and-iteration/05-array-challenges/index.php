<?php

/*
  Challenge 1: Sum of an array
  
  1. Create an array of numbers 
  2. Get the sum of all of the numbers combined and put into a variable.
  4. Get the amount of numbers in the array and put into a variable.
  5. Print out 'The sum of the {amount} numbers is: {sum} '. For example, if the array is [1, 2, 3, 4, 5], the output should be 'The sum of the 5 numbers is: 15'. 
*/

$numbers = [1, 2, 3, 4, 5];
$sum = array_sum($numbers);


/*
  Challenge 2: Colors array

  1. Reverse the `$colors` array.
  2. Add 'purple' and 'orange' to the end of the array.
  3. Replace the second color with 'pink'
  4. Remove the last element of the array.

You should end up with the following array: ['yellow', 'pink', 'blue', 'red', 'purple']
*/


$colors = ['red', 'blue', 'green', 'yellow'];
$colors = array_reverse($colors);
$colors = array_merge($colors, ["purple", "orange"]);
array_splice($colors, 1, 1, "pink");
array_pop($colors);

/*
  Challenge 3: Job listings array

  1. Create a multi-dimensional array of associative arrays of 3 job listings with the fields id, job_title, company, contact_email, and contact_phone. Also add an array field for skills. The skills array should be an array of strings with each skill a person has. For example, 'PHP', 'MySQL', 'JavaScript', 'HTML', 'CSS', etc.
  2. Create a new listing using the `array_push()` function. The new listing should have the same fields as the others.
  3. Print out the job_title of the second job listing in the array.
  4. Print out the first skill of the third job listing in the array.
*/


$job_listings = [
  [
    "id" => "111",
    "job_title" => "accountant",
    "company" => "modern sales",
    "contact_email" => "jane@gmail.com",
    "contact_phone" => "705-111-1111",
    "skills" => ["math", "numbers", "counting"]
  ],
  [
    "id" => "222",
    "job_title" => "coder",
    "company" => "mozilla",
    "contact_email" => "john@gmail.com",
    "contact_phone" => "705-222-2222",
    "skills" => ["PHP", "Java", "Tailwind"]
  ],
  [
    "id" => "333",
    "job_title" => "designer",
    "company" => "sears",
    "contact_email" => "jill@gmail.com",
    "contact_phone" => "705-333-333",
    "skills" => ["color", "texture", "feel"]
  ]
];

array_push($job_listings, [
  "id" => "444",
  "job_title" => "dishwasher",
  "company" => "montanas",
  "contact_email" => "jack@gmail.com",
  "contact_phone" => "705-444-4444",
  "skills" => ["water", "soap", "heat"]
]);

$job2 = $job_listings[1]["job_title"];

$skill1 = $job_listings[2]["skills"][0];

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
      <h2 class="text-2xl font-bold">Sum of an Array: <?php echo $sum ?></h2>
    </div>
    <!-- Challenge 2 -->
    <div class="bg-white rounded-lg shadow-md p-6 mt-6">
      <p>
      <pre>
          <h2 class="text-2xl font-bold">List of Colors: <br> <?php print_r($colors) ?></h2>
        </pre>
      </p>
    </div>

    <!-- Challenge 3 -->
    <p>
    <pre>
          <h2 class="text-2xl font-bold">Job Listings: <br> <?php print_r($job_listings) ?></h2>
          <p class="text-2xl font-bold"><?php print_r($job2) ?></p>
          <p class="text-2xl font-bold"><?php print_r($skill1) ?></p>
        </pre>
    </p>
  </div>
  </div>

</body>

</html>