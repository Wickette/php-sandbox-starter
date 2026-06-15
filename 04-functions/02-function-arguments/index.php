<?php
function add($a, $b) {
return $a + $b;
}

// parameters as the value holders in the function when you initially create it
// arguments are the values you pass into the function

echo add(1,1);
echo "<br>";
echo add(100,250);

function sayHello($name) {
    return "Hello " . $name;
}
echo "<br>";
echo sayHello("Steph");

function addAll(...$numbers) {
    $total = 0;
    foreach($numbers as $number) {
        $total += $number;
    }
    return $total;
}

echo "<br>";

echo addAll(1,1,1,1,1,1,2);

?>