---
layout: post
title: 'Truco linux: redimensionar imágenes desde la linea de comandos'
date: 2010-05-06 08:38:02.000000000 +02:00
tags:
- linux
status: publish
type: post
published: true
meta:
  _edit_last: '2'
  _syntaxhighlighter_encoded: '1'
  reddit: a:2:{s:5:"count";i:0;s:4:"time";i:1412838266;}
author:
  login: francho

  display_name: francho
  first_name: ''
  last_name: ''
excerpt: !ruby/object:Hpricot::Doc
  
---
Convert es un comando del paquete ImageMagic que nos permite manipular imágenes desde la línea de comandos, lo que lo hace muy útil para hacer scripts.

Una de las cosas para las que lo suelo usar más es para redimensionar lotes de imágenes

{% highlight bash %}
# Primero instalatelo (sin no lo tienes ya)
aptitude install imagemagick

# Redimensiona todos los archivos png del directorio actual (sin entrar en los subdirectorios) a un máximo de 32 pixeles de ancho

find . -maxdepth 1 -name "*.png" -exec convert -resize 32x {} {} \;
{% endhighlight %}
