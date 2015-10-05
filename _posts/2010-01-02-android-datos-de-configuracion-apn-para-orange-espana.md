---
layout: post
title: 'Android: Datos de configuración APN para Orange España'
date: 2010-01-02 01:50:30.000000000 +01:00
status: publish
type: post
published: true
meta:
  _edit_last: '2'
  _syntaxhighlighter_encoded: '1'
author:
  login: francho

  display_name: francho
  first_name: ''
  last_name: ''
excerpt: !ruby/object:Hpricot::Doc

---
Tras liberar mi móvil Android (un HTC Dream de Movistar) he tenido que configurar a mano los APN (nombre de punto de acceso) para poder aprovechar la tarifa plana de datos que tengo con Orange y para poder enviar y recibir mensajes MMS.

Estos son los pasos necesarios:

Entramos en el menú "Ajustes / Conexiones inalámbricas / Redes móviles / APN"

Creamos un APN para conectar a internet por la red telefónica
{% highlight bash %}
Nombre: orange internet
APN: internet
Proxy: <No establecido>
Puerto: <No establecido>
Nombre de usuario: orange
Contraseña: orange
Servidor: <No establecido>
MMSC: <No establecido>
Proxy MMS: <No establecido>
Puerto MMS: <No establecido>
MCC: 214
MNC: 03
Tipo de APN: default
{% endhighlight %}

Creamos otro APN para poder mandar/descargar MMS
{% highlight bash %}
Nombre: orange MMS
APN: orangemms
Proxy: <No establecido>
Puerto: <No establecido>
Nombre de usuario: orange
Contraseña: orange
Servidor: <No establecido>
MMSC: http://mms.orange.es
Proxy MMS: 172.022.188.025
Puerto MMS: 8080
MCC: 214
MNC: 03
Tipo APN: mms
{% endhighlight %}
Una vez creados hay que apagar y volver a encender el móvil para que la nueva configuración funcione.
