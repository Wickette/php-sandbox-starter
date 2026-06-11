<?php
$age = 18;
// If statement
// if statement is used to execute some code if a condition is true
// if ($age >= 21) {
//     echo "You are old enough to drink in the US";
// }
// If-Else
// if-else statement is used to execute some code if a condition is true and some other code if the condition is false
// if ($age >= 21) {
//     echo "you are old enough to drink in the US";
// } else {
//     echo "you are NOT old enough to drink in the US";
// }
// Nested if statement
// nested if statement is used to execute some code if a condition is true and some other code if the condition is false, and then check another condition if the first condition is false
// if ($age >= 21) {
//     echo "you are old enough to drink in the US";
// } else {
//     if ($age >= 18) {
//         echo "you are old enough to vote in the US";
//     } else {
//         echo "You are NOT old enough to drink or vote in the US";
//     }
// }
// If-Else-If
// if-else-if statement is used to execute some code if a condition is true and some other code if the condition is false, and then check another condition if the first condition is false
if ($age >= 21) {
    echo "you are old enough to drink in the US";
    } else if ($age >= 18) {
        echo "You are old enough to vote in the US";
    } else {
        echo "You are NOT old enough to drink or vote in the US";   
    };