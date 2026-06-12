<!-- null coalescing operator
this operator is used to check if a variable is set and is not null. It returns the value of the variable if it is set and not null, otherwise it returns a default value. The syntax for the null coalescing operator is as follows: 
variable ?? default_value;  
This operator is often used to provide a default value for a variable that may not be set or may be null. It can also be used to check if a variable is set and is not null before using it in an expression. For example, if you have a variable $name that may or may not be set, you can use the null coalescing operator to provide a default value like this: 
$name = $name   
-->

<?php 
$favColor = "Green";
$seondFavColor = "Orange";

$color = isset($favColor) ? $favColor : "blue";
$color = $favColor ?? "blue";
// if whatever on the left is null, it'll produce whatever is on the right

$color = isset($favColor) ? $favColor : (isset($seondFavColor) ? $seondFavColor : "Blue");
$color = $favColor ?? $seondFavColor ?? "Blue";
// checks favColor, if that is null - it moves onto the second argument - else goes to the very last option

?>