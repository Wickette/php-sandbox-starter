<?php
// global scope is anything outside of a function

$name = "Steph";
// this would be global

function sayHello() {
    global $name;
    // this is local scope - inside a function

    echo "hello " . $name;
}

sayHello();

echo $name;
?>