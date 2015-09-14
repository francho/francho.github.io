---
layout: post
title: 'Android: creando nuestras propias Views'
date: 2011-10-16 21:06:34.000000000 +02:00
tags:
- android
status: publish
type: post
published: true
meta:
  _edit_last: '239693'
  tagazine-media: a:7:{s:7:"primary";s:76:"https://franchojoven.files.wordpress.com/2011/10/device-2011-10-16-170223.png";s:6:"images";a:1:{s:76:"https://franchojoven.files.wordpress.com/2011/10/device-2011-10-16-170223.png";a:6:{s:8:"file_url";s:76:"https://franchojoven.files.wordpress.com/2011/10/device-2011-10-16-170223.png";s:5:"width";s:3:"320";s:6:"height";s:3:"480";s:4:"type";s:5:"image";s:4:"area";s:6:"153600";s:9:"file_path";s:0:"";}}s:6:"videos";a:0:{}s:11:"image_count";s:1:"1";s:6:"author";s:6:"239693";s:7:"blog_id";s:8:"28029873";s:9:"mod_stamp";s:19:"2011-10-16
    15:09:25";}
  _wpas_done_twitter: '1'
  reddit: a:2:{s:5:"count";i:0;s:4:"time";i:1352959842;}
  _oembed_86f72baef744005dfdd869047cfaa843: "{{unknown}}"
  twitter_cards_summary_img_size: a:6:{i:0;i:320;i:1;i:480;i:2;i:3;i:3;s:24:"width="320"
    height="480"";s:4:"bits";i:8;s:4:"mime";s:9:"image/png";}
  _oembed_127122f320d5f72ea3cc74049a8348ea: "{{unknown}}"
author:
  login: francho

  display_name: francho
  first_name: ''
  last_name: ''
excerpt: !ruby/object:Hpricot::Doc
  options: {}
---
![device](/assets/device-2011-10-16-170223.png "device-2011-10-16-170223")

Hace unas semanas una conversación en Twitter con [@aeliasnet](https://twitter.com/#!/aeliasnet) me sirvió para darme cuenta lo que había cambiado mi forma de programar Android. Llevo ya unos cuantos meses (desde [el taller](http://gtugzaragoza.com/2011/07/03/android-google-app-engine-y-codigo-limpio/) de [@jbeerdev](https://twitter.com/#!/jbeerdev)) intentando plasmar las enseñanzas del libro [Clean Code](http://www.amazon.es/gp/product/0132350882/ref=s9_simh_gw_p14_d9_g14_i1?pf_rd_m=A1AT7YVPFBWXBL&pf_rd_s=center-1&pf_rd_r=1ST7M8MTTMHPSAVXBH2S&pf_rd_t=101&pf_rd_p=244298447&pf_rd_i=602357031) del "[tito Bob](https://sites.google.com/site/unclebobconsultingllc/)".

Una de las cosas que estoy haciendo para mantener mi código limpio es crear mis propios objetos View reutilizables y delegar en ellos la lógica que les afecta. De esta forma, entre otras cosas, consigo tener unas clases Activity mucho más claras.

Veamos un ejemplo: imaginemos que tengo que mostrar la nota de un alumno con los siguientes datos: nombre del alumno, asignatura, nota numérica y nota en texto. Además si es un suspenso la nota debe estar en rojo.

Antes me crearía un layout con todos los datos y en mi Activity, a base de findById() rellenaría los campos con los datos correspondientes. Mi activity también contendría la lógica necesaria para el cambio de colores.

Ahora lo que hago es crearme un "[compound view](http://developer.android.com/guide/topics/ui/custom-components.html)" que incrusto directamente donde corresponda en mi layout xml (como si fuera un objeto View más) y desde mi Activity le cargo los datos usando los métodos setter que he creado como interface.

Veamos como se haría este ejemplo paso a paso...

Primero lo que debemos crear es un clase que extienda de View (o de una de sus hijas) y colocarle la lógica necesaria. Yo en mi caso creo una que extiende de RelativeLayout. Mantengo los constructores del padre para asegurarme que funcionará en todos los supuestos.

{% highlight java %}
/**
* By Francho Joven - http://francho.org/lab/
*
* This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License.
* To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/
* or send a letter to Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*
*/
package org.francho.lab.customviews;

import android.content.Context;
import android.graphics.Color;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.widget.RelativeLayout;
import android.widget.TextView;

/**
* Sample compound view to show school marks:
*
* - The color of the mark depends of the qualification.
* - The mark is shows as text too
*
*
* @author francho
*
*/
public class SubjectMarkView extends RelativeLayout {

private TextView mStudent;
private TextView mSubject;
private TextView mMarkNumber;
private TextView mMarkText;

/**
* @param context
* @param attrs
* @param defStyle
*/
public SubjectMarkView(Context context, AttributeSet attrs, int defStyle) {
super(context, attrs, defStyle);
initView(context);
}

/**
* @param context
* @param attrs
*/
public SubjectMarkView(Context context, AttributeSet attrs) {
super(context, attrs);
initView(context);
}

/**
* @param context
*/
public SubjectMarkView(Context context) {
super(context);
initView(context);
}

/**
* Configure our custom view
*
* @param context
*/
private void initView(Context context) {
final LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);

inflater.inflate(R.layout.subjectmarkview, this, true);

mStudent = (TextView) findViewById(R.id.sm_student);
mSubject = (TextView) findViewById(R.id.sm_subject);
mMarkNumber = (TextView) findViewById(R.id.sm_marknumber);
mMarkText = (TextView) findViewById(R.id.sm_marktext);
}

/**
* Set the student name
*
* @param student
*/
public void setStudent(CharSequence student) {
mStudent.setText(student);
}

/**
* Set the subject name
*
* @param subject
*/
public void setSubject(CharSequence subject) {
mSubject.setText(subject);
}

/**
* Set the mark
*
* @param mark
*/
public void setMark(double mark) {
mMarkNumber.setText(""+mark);

int markTextId=R.string.mark_unknown;

if(mark >= 9){
markTextId = R.string.mark_a;
} else if(mark >= 7) {
markTextId = R.string.mark_b;
} else if(mark >= 6) {
markTextId = R.string.mark_c;
} else if(mark >= 5) {
markTextId = R.string.mark_d;
} else if(mark >= 0) {
markTextId = R.string.mark_e;
}

mMarkText.setText(markTextId);

int color= (mark>=5) ? Color.GREEN : Color.RED;

mMarkText.setTextColor(color);
mMarkNumber.setTextColor(color);

}
}

{% endhighlight %}

Aunque el diseño y los objetos View hijos podría haberlos creado con código, para este caso he preferido diseñarlo vía xml e inflar este layout desde mi clase.

{% highlight xml %}
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
                android:orientation="vertical" android:layout_width="fill_parent"
                android:layout_height="fill_parent">
  <TextView android:text="TextView" android:layout_height="wrap_content"
            android:layout_width="wrap_content" android:textAppearance="?android:attr/textAppearanceMedium"
            android:id="@+id/sm_student" android:layout_alignParentLeft="true" />

  <TextView android:text="TextView" android:layout_height="wrap_content"
            android:layout_width="wrap_content" android:textAppearance="?android:attr/textAppearanceMedium"
            android:id="@+id/sm_subject" android:layout_alignParentLeft="true"
            android:layout_below="@id/sm_student" android:textStyle="bold" />

  <TextView android:text="TextView" android:layout_height="wrap_content"
            android:layout_width="wrap_content" android:id="@+id/sm_marknumber"
            android:textAppearance="?android:attr/textAppearanceLarge"
            android:layout_alignParentTop="true" android:layout_alignParentRight="true"
            android:layout_toRightOf="@id/sm_student" android:gravity="right" />

  <TextView android:text="TextView" android:layout_height="wrap_content"
            android:layout_width="wrap_content" android:id="@+id/sm_marktext"
            android:layout_alignParentRight="true" android:layout_below="@+id/sm_marknumber"
            android:layout_alignLeft="@+id/sm_marknumber" android:gravity="right" />
</RelativeLayout>
{% endhighlight %}

Ya está todo listo, lo único que nos falta es usarlo dentro de nuestras Activity. Para ello primero deberemos maquetarlo dentro de nuestros layout, para ello deberemos usar el nombre completo de la clase (con el paquete y todo):

{% highlight xml %}
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
              android:orientation="vertical"
              android:layout_width="fill_parent"
              android:layout_height="fill_parent"
  >
  <TextView
    android:layout_width="fill_parent"
    android:layout_height="wrap_content"
    android:text="@string/hello"
    />

  <org.francho.lab.customviews.SubjectMarkView
    android:id="@+id/mark"
    android:layout_width="fill_parent"
    android:layout_height="wrap_content"

    android:layout_margin="10dip"/>
</LinearLayout>
{% endhighlight %}

Y en nuestra Activity usaremos findViewById para localizarlo y asignarle datos:

{% highlight java %}
/**
* By Francho Joven - http://francho.org/lab/
*
* This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License.
* To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/
* or send a letter to Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*
*/
package org.francho.lab.customviews;

import android.app.Activity;
import android.os.Bundle;

public class MainActivity extends Activity {
/** Called when the activity is first created. */
@Override
public void onCreate(Bundle savedInstanceState) {
super.onCreate(savedInstanceState);
setContentView(R.layout.main);

SubjectMarkView mark = (SubjectMarkView) findViewById(R.id.mark);

mark.setStudent("Fido Dido");
mark.setSubject("Biology");
mark.setMark(4.5);
}
}
{% endhighlight %}

El código completo de este ejemplo lo tenéis en el repositorio GitHub:

[https://github.com/francho/francho.org-lab/tree/master/1037-CustomViews](https://github.com/francho/francho.org-lab/tree/master/1037-CustomViews)
