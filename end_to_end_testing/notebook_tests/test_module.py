
# Put the widget inside a module so we can hide the test string from the notebook source

import widget_cookie_cutter_test

test_string = "THIS IS THE SECRET TEST STRING"

def get_a_widget():
    result = widget_cookie_cutter_test.example.HelloWorld()
    result.value = test_string
    return result
