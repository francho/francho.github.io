---
layout: post
title: Desarrollando Android con Ubuntu
date: 2009-06-12 12:43:22.000000000 +02:00
tags:
- android
- linux
status: publish
type: post
published: true
meta:
  syntaxhighlighter_encoded: '1'
  _edit_last: '2'
  _oembed_35670e88da8de9f905d1eb39063076bc: "{{unknown}}"
  _oembed_d7c9c312ccef7a707a31838fb20846d2: "{{unknown}}"
  _oembed_a831bac250a7ed8725b043d635ecb3ea: "{{unknown}}"
  reddit: a:2:{s:5:"count";i:0;s:4:"time";i:1413415914;}
  _oembed_217da388aaa35fd69983cdd4b2158544: "{{unknown}}"
  _oembed_e93ecaa9310783eb37c45437c90707b7: "{{unknown}}"
  _oembed_e5416679c020474c07d026fb3ec8d4f9: "{{unknown}}"
author:
  login: francho

  display_name: francho
  first_name: ''
  last_name: ''
excerpt: !ruby/object:Hpricot::Doc
  options: {}
---
Una de las mejores cosas que tiene Android es su entorno de desarrollo o SDK. Funciona bajo Linux, Mac y Windows y puede descargarse gratuitamente desde http://developer.android.com/sdk/

Para facilitar el trabajo, además del SDK deberemos instalar un plugin en nuestro IDE de desarrollo preferido. (A día de hoy el plugin de Netbeans no funciona con el SDK 1.5 supongo que se solucionará en breve).

Este artículo explica los pasos que seguí para convertir mi Ubuntu 9.04 en una estación de desarrollo Android ;-)

Esto es un resumen a modo recordatorio de lo que he hecho (por si me toca reinstalarlo), si necesitas más ayuda busca en Google que hay un montón de páginas que indican paso a paso con pantallazos y todo ;-)

1.  Insalar Java JDK. Yo en mi caso ya tenia instalado sun-java6-jdk (si no lo puedes instalar desde aptitude)
2.  Instalar ant (utilidades de compilación de Java). Están en los repositorios.
3.  Bajarse e instalar la última versión de [Eclipse](http://www.eclipse.org/downloads/) . Aunque está en aptitude, yo he preferido instalarme la última versión disponible "a pelo" ;)
4.  Bajarse e instalar la última version de [Android](http://developer.android.com/sdk/). En mi caso la 1.5_r2.
5.  Siguiendo las instrucciones del "Install" de Android http://developer.android.com/sdk/1.5_r2, installar el plugin de Android para Eclipse
`
1\. Start Eclipse, then select Help > Software Updates....
2\. In the dialog that appears, click the Available Software tab.
3\. Click Add Site...
4\. Enter the Location:`

https://dl-ssl.google.com/android/eclipse/

If you have trouble aqcuiring the plugin, try using "http" in the Location URL, instead of "https" (https is preferred for security reasons).

Click OK.
5\. Back in the Available Software view, you should see the plugin listed by the URL, with "Developer Tools" nested within it. Select the checkbox next to Developer Tools and click Install...
6\. On the subsequent Install window, "Android DDMS" and "Android Development Tools" should both be checked. Click Next.
7\. Read and accept the license agreement, then click Finish.
8\. Restart Eclipse.

Adicional:

Personalizar las plantillas de eclipse para que aparezca la URL del blog y la licencia Creative Commons ;)

1.  Eclipse > Window > Preferences > Java > Code Style > Code Templates
