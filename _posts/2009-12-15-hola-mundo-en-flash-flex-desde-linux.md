---
layout: post
title: Hola mundo en Flash (Flex) desde Linux
date: 2009-12-15 14:40:34.000000000 +01:00
status: publish
type: post
published: true
meta:
  _edit_last: '2'
  _syntaxhighlighter_encoded: '1'
  reddit: a:2:{s:5:"count";i:0;s:4:"time";i:1413387334;}
author:
  login: francho

  display_name: francho
  first_name: ''
  last_name: ''
excerpt: !ruby/object:Hpricot::Doc
  options: {}
---
Para un experimento que quiero hacer tengo que retocar un código hecho en Flex. Como nunca he programado Flex ni ActionScript  me ha tocado bucear en la red. Siguiendo este [post](http://netpatia.blogspot.com/2009/09/flash-development-on-linux.html) y este [otro](http://netpatia.blogspot.com/2009/09/flash-development-on-linux-ii.html), he conseguido montar el entorno de desarrollo.

Eclipse ya lo tenía instalado desde el aptitude de mi Ubuntu 9.10 así que solo he tenido que añadirle los plugins que me faltaban ([AXDT](http://www.axdt.org)).

Este es el código con el que he probado que todo funciona:

{% highlight actionscript %}
<?xml version="1.0" encoding="utf-8"?>
<mx:Application xmlns:mx="http://www.adobe.com/2006/mxml"
                layout="vertical">
  <mx:Script>
    <![CDATA[
    public function about():void {
    texto.text = "https://franchojoven.files.wordpress.com/2009/12/pc_evolution.jpg";
    }

    public function hola():void {
    texto.text = "Hola";
    }

    ]]></mx:Script>
  <mx:Label id="texto">
    <mx:text>pulsa</mx:text>
  </mx:Label>
  <mx:Button id="btnHola" label="Hola" click="hola()" />
  <mx:Button id="btnAbout" label="About" click="about()" />
</mx:Application>
{% endhighlight %}
