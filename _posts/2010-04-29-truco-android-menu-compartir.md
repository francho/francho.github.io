---
layout: post
title: 'Truco Android: menú compartir'
date: 2010-04-29 18:53:56.000000000 +02:00
tags:
- android
status: publish
type: post
published: true
meta:
_edit_last: '2'
_syntaxhighlighter_encoded: '1'
reddit: a:2:{s:5:"count";i:0;s:4:"time";i:1412784526;}
author:
login: francho

display_name: francho
first_name: ''
last_name: ''
excerpt: !ruby/object:Hpricot::Doc

---
Hoy en día para ser un 2.0 auténtico hace falta compartir todo ;-) por eso, he decidido añadir esta funcionalidad a alguna de mis aplicaciones Android.

La idea es que cuando el usuario pulse el botón compartir se abra un desplegable con las aplicaciones "sociales" (Twitter, Facebook, email, sms...) que tenga instaladas y a través de ellas suba el contenido (que irá precargado).

Había empezado a programar esa solución, pero buscando un poco me he encontrado con [este post](http://labs.emich.be/2010/01/23/how-to-send-to-twitter-or-facebook-from-your-android-application/) que dá una solución muy sencilla y efectiva.

Con la idea de reutilizar el código lo he convertido en una clase estática que puedo llamar directamente desde cualquiera de mis "Activity"

{% highlight java %}
/**
* Share a content using the user's installed apps
*
* Thanks to : http://labs.emich.be/2010/01/23/how-to-send-to-twitter-or-facebook-from-your-android-application/
*
* @author http://francho.org/lab/
*
*/
public class Social {
/**
* Open a contextual Menu with the available applications to share
*
* @param the Context (to open the menú and the new activity)
* @param the subject
* @param the text
*/
public static void share(Context ctx, String subject,String text) {
  final Intent intent = new Intent(Intent.ACTION_SEND);
  
  intent.setType("text/plain");
  intent.putExtra(Intent.EXTRA_SUBJECT, subject);
  intent.putExtra(Intent.EXTRA_TEXT, text);
  
  ctx.startActivity(Intent.createChooser(intent, ctx.getString(R.string.tit_share)));
  }
}
{% endhighlight %}
