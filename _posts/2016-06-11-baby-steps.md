---
layout: post
title: Baby steps
date: 2016-06-11 12:26
tags: []
---
![baby steps](/assets/baby_steps.jpg)

Los programadores debemos estar formándonos continuamente. El hacer katas (pequeños ejercicios de programación enfocados a aprender “movimientos”) es una forma divertida de hacerlo.

Una de las katas que me gusta repetir de vez en cuando es la [Guilded Rose](https://github.com/francho/kata-gilded-rose-ruby/blob/master/README_es.md), un ejercicio de refactorización de un código espagueti legado. Es una kata bastante famosa y [está disponible para la mayoría de lenguajes de programación](https://github.com/emilybache/GildedRose-Refactoring-Kata). Suelo hacerla a modo de “hola mundo” cuando empiezo a aprender un nuevo lenguaje o cuando quiero probar nuevos enfoques (a lo funcional, orientada a objetos, con patrones, sin ifs…). En definitiva, la he escrito tantas veces que ya he perdido la cuenta.

Ayer acudí [al dojo](https://agile-aragon.org/2016/06/02/fridaydojo-kata-gilded-rose-segunda-parte/) organizado por [Agile Aragon](https://twitter.com/agilearagon) y los [Senpai Devs](https://twitter.com/senpaidevs) a practicar de nuevo con esta kata. Me apetecía hacerla en Ruby para aplicar lo que he aprendido en los últimos años. Así que me puse de pareja con [@SAReyes_](https://twitter.com/sareyes_) que no conocía el lenguaje y quería probarlo. Partimos de un código cubierto por unos tests que encontré por internet (me gustaron por el uso de la librería rspec/given). 

Los primeros pasos fueron bastante bien pero llegados a un punto nos quedamos atascados (no podíamos continuar sin hacer un megarefactor). Al tratar de explicar nuestro enfoque a [@gualison](https://twitter.com/gualison) que ejercía de facilitador nos dimos cuenta que estaba demasiado condicionado con la solución a la que pretendía llegar (tenía en la cabeza la que implementé la última vez)… ¡habíamos hecho sobreingeniería! 

Tratamos de recular, pero el tiempo se nos echó encima, así que me fui a casa con la mosca detrás de la oreja. 

Como me conozco y sabía que no iba a poder dormir si no me la quitaba decidí hacer de nuevo la kata. Con la música sonando a todo trapo en los cascos traté de dejar la mente en blanco, olvidando cualquier solución previa que pudiera condicionarme, y fui avanzando en pequeños pasos, optando primero por el paso más sencillo o el más evidente. Esto me permitió retrasar decisiones de diseño hasta los (últimos commits)[https://github.com/francho/kata-gilded-rose-ruby/commits/francho-solution]. 

[![](/assets/kata-gilded-rose-history.png)](https://github.com/francho/kata-gilded-rose-ruby/commits/francho-solution)

El [código resultante](https://github.com/francho/kata-gilded-rose-ruby/tree/francho-solution) me gusta bastante y es mucho mas bonito que el que tenía en mente cuando acudí al dojo. Está claro que cuando nos enfrentamos a problemas de este tipo, con código mostruoso los "baby steps" ayudan mucho... ¡lección aprendida!

¿Y a vosotr@s que os parece el código?... se admiten code reviews ;)
