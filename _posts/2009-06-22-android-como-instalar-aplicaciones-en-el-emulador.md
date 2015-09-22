---
layout: post
title: 'Android: cómo instalar aplicaciones en el emulador'
date: 2009-06-22 15:03:33.000000000 +02:00
tags:
- android
status: publish
type: post
published: true
meta:
  _syntaxhighlighter_encoded: '1'
  _edit_last: '2'
  reddit: a:2:{s:5:"count";i:0;s:4:"time";i:1413416029;}
author:
  login: francho

  display_name: francho
  first_name: ''
  last_name: ''
excerpt: !ruby/object:Hpricot::Doc
  
---
Situación incial:

*   Máquina de desarrollo Linux (Ubuntu 9.04)
*   SDK de Android instalado en /opt/android-sdk-linux_x86-1.5_r1/
*   El emulador ya ha sido lanzado desde Eclipse creandose un perfil al que he llamado "Test"

Caso real: quiero instalar OpenIntents en mi emulador:

[bash]
cd /tmp
wget http://openintents.googlecode.com/files/openintents-binary-0.9.0.zip
unzip openintents-binary-0.9.0.zip
export SDK_ROOT="/opt/android-sdk-linux_x86-1.5_r1"
cd /opt/android-sdk-linux_x86-1.5_r1/tools
./emulator -avd Test
./adb install /tmp/openintents-binary-0.9.0/OpenIntents.apk
[/bash]

Explicación:

1.  Nos colocamos en el directorio temporal para no ensuciar otras carpetas
2.  Descargamos el paquete a instalar
3.  Lo descomprimimos
4.  Creamos la variable de entorno SDK_ROOT y la hacemos apuntar al sitio donde tenemos el SDK de Android
5.  Vamos al directorio tools del SDK (donde está el emulador y algunas herramientas complementarias)
6.  Arrancamos el emulador con el perfil "Test". Los perfiles están guardados en ~/.android/avd/
7.  Instalamos la aplicación

Basado en un artículo de Open Handset Magazine http://openhandsetmagazine.com/2008/01/tips-how-to-install-apk-files-on-android-emulator/
