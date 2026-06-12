<?php
echo "<h1>Conditionals in Loops</h1>";

echo "<h2> Basic Example</h2>";
$number = 1;

while($number <= 10) {
    if($number % 2 == 0) {
        echo $number . " is even <br>";
    } else {
        echo $number . " is odd <br>";
    }
    $number++;
}
// In this example, we have a while loop that iterates from 1 to 10. Inside the loop, we use an if statement to check if the current number is even or odd. If the number is even (i.e., divisible by 2), we print that it is even; otherwise, we print that it is odd. After each iteration, we increment the number by 1 to move to the next number in the sequence.

// break statement example

echo "<h2>Break Statement Example</h2>";
// a break statement is used to exit a loop prematurely. In this example, the loop will stop executing when $i reaches 5, so it will only print numbers 1 through 4.
for ($i = 1; $i<= 10; $i++){
    if($i == 5){
        // once this condition is true, the loop will stop executing and exit the loop.
        break;
    }
    echo $i . "<br>";
}

// continue statement example
echo "<h2>Continue Statement Example</h2>";
// a continue statement is used to skip the current iteration of a loop and move on to the next iteration. In this example, the loop will skip the number 5 and continue with the next iteration, so it will print numbers 1 through 4 and then 6 through 10.
for ($i = 1; $i <=10; $i++){
    if($i == 5){
        // once this condition is true, the loop will skip the current iteration and move on to the next iteration.
        continue;
        // so it will skip the number 5 and continue with the next iteration, which is 6. Therefore, it will print numbers 1 through 4 and then 6 through 10, but it will not print the number 5.
    }
    echo $i . "<br>";
}

$student_grades = array(
    "Alice" => 85,
    "Bob" => 92,
    "Charlie" => 78,
    "David" => 90,
    "Eve" => 88
);


echo "<h2>Conditionals in Loops Example</h2>";
foreach ($student_grades as $student => $grade) {
    if ($grade >= 90) {
        echo $student . " has an excellent grade.<br>";
    }
}
?>