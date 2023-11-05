# DyeScript-Light

![downloads](https://img.shields.io/npm/dt/@yokgs/dyescript-light?style=flat-square)
![version](https://img.shields.io/npm/v/@yokgs/dyescript-light?style=flat-square)

Command Line Interface of lightweight (&amp; pre-published) version of [@yokgs/DyeScript](https://github.com/yokgs/DyeScript) with integrated css utilities

> **Powered by [@yokgs/bluedyejs](https://github.com/yokgs/BlueDyeJS)**

## Installation

```sh
npm install -g @yokgs/dyescript-light
```

## Usage

To compile `myfile.dye` and save the resulting css to `/dist/css` folder use the following command

```sh
dyec -p myfile -o ./dist/css
```

For incremental builds, use the -w option:

```sh
dyec -p myfile -o ./dist/css -w
```

To specify an appropriate target for the build, use the -t option followed by the target code:

- `-t default`: Generates both regular CSS and minified CSS files (default).
- `-t c`: Generates a Cascading Style Sheet file (.css).
- `-t m`: Generates a minified CSS file (.min.css).
- `-t s`: Generates a Static DyeScript file (.static.dye) (experimental).
- `-t r`: Generates a React StyleSheet file (.js) (experimental).
- `-t a`: Generates all supported targets (.css, .dye, and .js) (experimental).

Remember that some targets are experimental and may not be fully supported.

## Syntax

### Import (`@@` operator)

include a utility file `Margin.dye`

```dye
@@ <Margin>
or
import <Margin>
```

include a dye file `my-buttons.dye`

```dye
@@ ./my-buttons
or
import ./my-buttons
```

### Style definitions

You can define styles using the following syntax:

```dye
style <selector> <property> <value> <property> <value>...
```

You can also use the style shorthand version `$`:

```dye
$ <selector> <property> <value> <property> <value>...
```

For example, to set the background color to red and the text color to black for a button with the class 'styled':

Similar to CSS styles

```dye
style button.styled backgroundColor red color black
```

Or, you can format it like this:

```dye
$ button.styled backgroundColor red
    color black
```

You can attribute the same value to different properties using a concise syntax:

```dye
$ button color, borderColor black
$ body margin, padding 0px
```

### DyeScript classes

Define the class bordered with the following properties

- border width 4px
- border color gold
- border style solid

```dye
class bordered borderWidth 4px
    borderColor gold
    borderStyle solid
```

Alternatively, you can use the class shorthand `.$`:

```dye
.$ bordered borderWidth 4px
    borderColor gold
    borderStyle solid
```

You can apply the bordered class to elements like buttons, images, and elements with the .card class:

```dye
$bordered button img .card
```

Additionally, you can apply the bordered class to another class:

```dye
$bordered $anotherClass
```

The class `anotherClass` will inherit all the properties of `bordered`

> **Note** : DyeScript classes do not appear in the final output

### Utility-First Classes

DyeScript provides a set of utility classes that accelerate the creation of custom styles. You can recreate the `bordered` class from the previous example using utility classes:

```dye
@@ <Borders>

$Border|3 $bordered
$Border|solid $bordered
.$ bordered borderColor gold
```

### Animations

DyeScript offers animation support, allowing you to create animations using the `@keyframes` keyword or its shorthand  `@keys`. Here's how you can define an animation:

```dye
@keyframes <animation name> 
    <state> <property> <value> 
    <state> <property> <value>...
```

For instance, creating a colorful rotation animation:

```dye
@keyframes colorfull-rotation
    from rotate 0deg
    to rotate 359deg
    from,to backgroundColor red
    33% backgroundColor green
    66% backgroundColor blue
```

You can also associate classes with animation states:

```dye
.$ Initial rotate 0deg backgroundColor red
.$ Final rotate 359deg backgroundColor red

@keyframes colorfull-rotation 
    from $Initial
    to $Final
    33% backgroundColor green
    66% backgroundColor blue
```

### CSS variables

DyeScript offers a convenient way to define global variables. Instead of the traditional approach:

```dye
$ :root --primary-color blue --secondary-color gray
```

You can use the following syntax:

```dye
+ primary-color blue secondary-color gray
```

When using variables in your styles:

```dye
$ button.primary backgroundColor --primary-color
```

instead of `var(--primary-color)`

## License

[Apache 2.0](https://opensource.org/license/apache-2-0/)

Copyright (c) 2023-present, Yazid Slila (yokgs)
