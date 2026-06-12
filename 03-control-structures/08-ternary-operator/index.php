<!-- Ternary Operator
 1. The condition to check
 2. The value to return if the condition is true
 3. The value to return if the condition is false
 
 Condition ? value_if_true : value_if_false;
Shelburne, Ontariobarrie
 short-hand for an if-else statement. 
 
 It allows you to write a simple conditional expression in a single line of code. The ternary operator is often used to assign a value to a variable based on a condition, or to return a value from a function based on a condition.
 -->

<?php
$score = 50;

if ($score > 40) {
    echo "High score! <br>";
} else {
    echo "Low score!";
};

// Using the ternary operator to achieve the same result
echo $result = ($score > 40) ? "High score! <br>" : "Low score!"; 
