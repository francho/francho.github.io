---
layout: post
title: 'Truco Android: Un solo código, varias aplicaciones'
date: 2010-09-16 17:28:37.000000000 +02:00
tags:
- android
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
![android_compilando_ant](/assets/android_compilando_ant.png "android_compilando_ant")
En muchas situaciones necesitamos generar varias aplicaciones a partir de un mismo código fuente. El caso típico es cuando queremos sacar una versión lite, con menos funcionalidades para abrir boca y que los usuarios se animen a comprar la versión pro que es de pago ;)

Una forma de hacerlo es mantener dos proyectos separados pero, a la larga, este sistema acaba volviéndose contra nosotros ya que nos obliga a aplicar los cambios por duplicado.

Buscando una forma de simplificar esta tarea rutinaria me topé con este a [artículo](http://blog.elsdoerfer.name/2010/04/29/android-build-multiple-versions-of-a-project/) que me puso sobre la pista:

La idea es hacer un único proyecto que contenga toda la funcionalidad y luego usar [Ant](http://ant.apache.org/) para compilarlo y generar las dos versiones (lite y pro).

Con unos mínimos cambios en el código y un pequeño script conseguí automatizar totalmente la generación de los "sabores" de mi aplicación.

Estos son los pasos a realizar....

**1º organización de código**

Hay que reescribir el código para que, cuando necesite activar o desactivar funcionalidades dependientes de la versión, haga uso de una la clase Application que contiene un método (por ejemplo isLite() ). Este método consulta el nombre de paquete de la aplicación para determinar la aplicación que está corriendo:

{% highlight java %}
public class MiappApplication extends Application {
public boolean isLite() {
return getApplicationContext().getPackageName().equals("org.francho.miapp.lite");
}
}
{% endhighlight %}

Se mueven todas las Activity a un subpaquete ( org.francho.miapp.activities ) de esta forma nos obligamos aimport de la clase R en cada una de ellas para evitar que su referencia sea ambigua.

En los casos necesarios se crean nuevas layouts (más limitadas) para la versión lite. Por supuesto, el setContentView() de las actividades que las usan va dentro de una condición que llama al método isLite() antes mencionado. Además hay que asegurarse de que el código no fallará en ninguna de las dos versiones (por ejemplo con NullPointerException)

**2º Configurar ANT para crear la versión Lite**

Siguiendo las instrucciones del manual de Android (capítulo desarrollando con otros IDE) se genera un proyecto temporal vacío:

1.  Si no lo tenemos ya, añadimos la ruta de las herramientas Android a nuestro path: {% highlight bash %}export PATH=$PATH:/opt/android-sdk-linux_86/tools/{% endhighlight %}
2.  Creamos un proyecto temporal {% highlight bash %}android create project --target 8 --name dummyname --package dummy.package --activity DummyActivity --path ./dummy_project{% endhighlight %}

Esto nos crea toda la estructura del proyecto y los scripts necesarios para compilarlo usando ant, esos son los que queremos. Así que los copiamos a una nueva carpeta (luego podemos borrar el proyecto temporal):

{% highlight bash %}
$ mkdir miapp_lite_ant
$ cp dummy_project/build.* miapp_lite_ant/
$ cp dummy_project/default.properties miapp_lite_ant/
$ cp dummy_project/local.properties miapp_lite_ant/
{% endhighlight %}

Editamos **build.xml** y añadimos al final (después del setup) nuestras reglas personalizadas, en nuestro caso hemos añadido unas que antes de generar el fichero de recursos R cambia el nombre del paquete de la aplicación principal por el de la aplicación secundaria. De esta forma las referencias a la clase R no fallarán. También cambian el nombre del paquete en el AndroidManifest (si no tienen paquetes diferentes no podremos subirlas al Market de forma simultánea):

{% highlight xml %}
<!-- Generates the R.java file for this project's resources. -->
<target name="-resource-src" depends="-dirs">
  <echo>Generating R.java / Manifest.java from the resources...</echo>

  <!-- francho -->
  <replace dir="src" includes="**/*.java" >
    <replacetoken><![CDATA[import org.francho.miapp.R]]></replacetoken>
    <replacevalue><![CDATA[import org.francho.miapp.lite.R]]></replacevalue>
  </replace>

  <replace file="AndroidManifest.xml">
    <replacetoken><![CDATA[package="org.francho.miapp"]]></replacetoken>
    <replacevalue><![CDATA[package="org.francho.miapp.lite"]]></replacevalue>
  </replace>

  <!-- -->

  <exec executable="${aapt}" failonerror="true">
    <arg value="package" />
    <arg line="${v.option}" />
    <arg value="-m" />
    <arg value="-J" />
    <arg path="${gen.absolute.dir}" />
    <arg value="-M" />
    <arg path="AndroidManifest.xml" />
    <arg value="-S" />
    <arg path="${resource.absolute.dir}" />
    <arg value="-I" />
    <arg path="${android.jar}" />

  </exec>

</target>
{% endhighlight %}

El fichero build.xml se puede personalizar al gusto, por ejemplo para que use un icono o un nombre diferente por cada aplicación bastaría añadir nuevas reglas similares a las anteriores.

Si no queremos teclear la contraseña de la firma cada vez que generemos la aplicación podemos editar el fichero **build.properties** y colocar los datos de nuestro almacen de claves :

{% highlight xml %} key.store=../../mi.keystore
key.alias=misclaves
key.store.password=123456
key.alias.password=123456
{% endhighlight %}

**3º Generando la aplicación Lite**

Una vez que hemos generado todo el código y hemos compilado y probado nuestra aplicación completa (versión gold) con el Eclipse vamos a generar la versión lite.

Para ello tenemos que copiar el código fuente, copiar la configuración de Ant y luego llamar al comando Ant correspondiente:

{% highlight bash %}
$ cp -rf ./miapp_gold/ ./miapp_lite/
$ cp -rf ./miapp_lite_ant/* ./miapp_lite/
$ cd ./miapp_lite/
{% endhighlight %}

Limpiamos el rastro que haya podido dejar la compilación de la Gold

{% highlight bash %}
$ ant clean
{% endhighlight %}

Generamos una versión de debug y la probamos (la instalará en el dispositivo por defecto conectado)

{% highlight bash %}
$ ant install
{% endhighlight %}

Cuando hemos comprobado que todo va ok, generamos la release. Ant se encarga de compilar, firmar y aplicar el zipalign.

{% highlight bash %}
$ ant release
{% endhighlight %}

Ya solo nos queda subir nuestro flamante apk al Android Market y ver crecer el numero de descargas ;-)
