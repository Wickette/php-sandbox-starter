<?php

// Comparison Operators and Logical Operators in PHP
// In PHP, comparison operators are used to compare two values, while logical operators are used to combine multiple conditions.

/*
| Comparison Operators
| Operator | Description              |
| -------- | ------------------------ |
| ==       | Equal to                 |
| == only tests for value, not type. So 10 == "10" is true.
| ===      | Identical to             |
| === tests for both value and type. So 10 === "10" is false.
| !=       | Not equal to             |
| != only tests for value, not type. So 10 != "10" is false.
| <>       | Not equal to             |
| <> is an alternative to != and has the same behavior.
| !==      | Not identical to         |
| !== tests for both value and type. So 10 !== "10" is true.
| <        | Less than                |
| < tests if the left operand is less than the right operand. So 5 < 10 is true, but 10 < 5 is false.
| >        | Greater than             |
| > tests if the left operand is greater than the right operand. So 10 > 5 is true, but 5 > 10 is false.
| <=       | Less than or equal to    |
| <= tests if the left operand is less than or equal to the right operand. So 5 <= 10 is true, and 10 <= 10 is also true, but 15 <= 10 is false.
| >=       | Greater than or equal to |
| >= tests if the left operand is greater than or equal to the right operand. So 10 >= 5 is true, and 10 >= 10 is also true, but 5 >= 10 is false.
*/


/*
| Logical Operators
| Operator | Description            |
| -------- | ---------------------- |
| and      | True if both are true  |
| &&       | True if both are true  |
| or       | True if either is true |
| ||       | True if either is true |
| xor      | True if one is true    |
| !        | True if it is not true |
*/

$x = 10;
$y = "10";

//die() is a function that terminates the script. It can be used to stop the execution of the script and output a message. In this case, we will use it to stop the script and output the results of our comparisons.

var_dump($x == $y); // true
var_dump($x === $y); // false    
//testing git push