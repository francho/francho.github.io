---
layout: post
title: 'Java: Ejemplo de uso de tipos enumerados (enum)'
date: 2010-01-07 20:57:14.000000000 +01:00
status: publish
type: post
published: true
meta:
  _edit_last: '2'
  _syntaxhighlighter_encoded: '1'
  reddit: a:2:{s:5:"count";i:0;s:4:"time";i:1422067324;}
author:
  login: francho

  display_name: francho
  first_name: ''
  last_name: ''
excerpt: !ruby/object:Hpricot::Doc

---
Los tipos enumerados sirven para restringir el contenido de una variable a una serie de valores predefinidos. Esto suele ayudar a reducir los errores en nuestro código.

A partir de Java SE 5.0 se incluyo una modalidad de <a href="http://java.sun.com/docs/books/tutorial/java/javaOO/enum.html">tipos enumerados</a> que mantiene la seguridad de los tipos. En la práctica viene a ser como si definiéramos nuestros propios tipos de variables.

En Java, los tipos enumerados se pueden definir fuera o dentro de una clase. Otra ventaja que traen los tipos enum de Java es que al ser una "especie de clase" podemos añadirles métodos, variables de instancia, constructores, etc... lo que los hace muy potentes.

A continuación os dejo un pequeño ejemplo que ilustra todos estos conceptos.

{% highlight java %}
/*
 *   http://creativecommons.org/licenses/by-nc/3.0/deed.es
 */
 
package org.francho.java.ejemplos;

/*
 *
 * @author francho - http://francho.org/lab/
 */
 
/*
 * Un tipo enumerado &quot;complejo&quot;, tiene sus propios métodos y constructor
 */
 
enum Vaso {
    // Tipos de vaso disponibles. Pasan al constructor su capacidad en cc.
    JARRA(500), TUBO(250), TERCIO(333), CAÑA(200);
    private int cc; // Variable interna donde almacenaremos la capacidad
    // Nuestro constructor nos fuerza a pasar parámetros al definir un nuevo tipo
    Vaso(int cc) {
        this.cc = cc;
    }
    // Devuelve la capacidad del vaso
    public int getCentimetrosCubicos() {
        return cc;
    }
}

/*
 * Definimos un tipo de bebida
 */
class BebidaCerveza {
    enum MarcaCerveza { AMBAR, GUINNESS, HEINEKEN } // Tipos enumerados sencillos. Solo tenemos estas marcas
    private Vaso vaso;
    private MarcaCerveza marca;
    BebidaCerveza(MarcaCerveza marca, Vaso vaso) {
        this.marca = marca;
        this.vaso = vaso;
    }
    public void servir() {
        System.out.println("Sirviendo " + vaso.getCentimetrosCubicos() + "cc. de cerveza " + marca);
    }
}

/*
 * Clase pública que prueba todo esto
 */
public class PruebaEnum {
    public static void main(String[] args) {
        BebidaCerveza birra = new BebidaCerveza(BebidaCerveza.MarcaCerveza.AMBAR, Vaso.JARRA);
        birra.servir();
    }
}
{% endhighlight %}
