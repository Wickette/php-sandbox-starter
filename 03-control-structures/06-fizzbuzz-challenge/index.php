<?php
// copilot: disable inline suggestions for this file

/*
Fizzbuzz Challenge:
Write a program that prints the numbers from 1 to 100. 
But for multiples of three print “Fizz” instead of the number and 
for the multiples of five print “Buzz”. For numbers which are multiples of both three and five print “FizzBuzz”. Remember, you can use the modulus operator to check if a number is divisible by another number.
*/
$number = 1;
for($number = 1; $number <= 100; $number++) {
    if($number %3 == 0 && $number %5 == 0) {
        echo "fizzbuzz <br>";
    } else if($number %3 == 0) {    
        echo "fizz <br>";
        } else if($number %5 == 0) {
            echo "buzz <br>";       
        } else {
            echo $number . "<br>";
        }
    }
