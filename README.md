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

Set background red and color black for a button with class 'styled'

Similar to CSS styles

```dye
$ button.styled backgroundColor red color black
or
style button.styled backgroundColor red color black
```

### DyeScript classes

Define the class bordered with the following properties

- border width 4px
- border color gold
- border style solid

```dye
.$ bordered borderWidth 4px borderColor gold borderStyle solid
or
class bordered borderWidth 4px borderColor gold borderStyle solid
```

Apply the class bordered to a button, img and .card

```dye
$bordered button img .card
```

You can also apply the class to another class

```dye
$bordered $anotherClass
```

The class `anotherClass` will inherit all the properties of `bordered`

> **Note** : DyeScript classes do not appear in the final output

### Utility-First Classes

DyeScript provide a bunch of utility classes to speed up the creation of custom styles

Let's recreate the class bordered from the previous example using Utility classes

```dye
@@ <Borders>

$Border|3 $bordered
$Border|solid $bordered
.$ bordered borderColor gold
```

## License

[Apache 2.0](https://opensource.org/license/apache-2-0/)

Copyright (c) 2023-present, Yazid Slila (yokgs)
