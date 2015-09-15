---
layout: post
title: 'Android: Usando ContactsContract para sacar el listado de teléfonos de la
  ageda'
date: 2011-01-11 22:38:59.000000000 +01:00
categories:
- android
tags: []
status: publish
type: post
published: true
meta:
  _edit_last: '2'
  _syntaxhighlighter_encoded: '1'
  reddit: a:2:{s:5:"count";i:0;s:4:"time";i:1352959864;}
  twitter_cards_summary_img_size: a:6:{i:0;i:480;i:1;i:800;i:2;i:3;i:3;s:24:"width="480"
    height="800"";s:4:"bits";i:8;s:4:"mime";s:9:"image/png";}
  _oembed_ca92b77017281efa5d2556d5f856340d: "{{unknown}}"
  _oembed_c377dcbda8d967548d1994e092cc23a8: "{{unknown}}"
  _oembed_c9601e78af04af9aaa48c930175b3d9c: "{{unknown}}"
author:
  login: francho

  display_name: francho
  first_name: ''
  last_name: ''
excerpt: !ruby/object:Hpricot::Doc
  options: {}
---
![choose_a_phone_device](/assets/choose_a_phone_device1.png)Uno de los primeros códigos de Android que teclee fué un [buscador de contactos](/2009/05/19/android-buscando-contactos-por-de-telefono/)... anda que no han pasado cosas desde entonces ;)

Uno de los principales cambios introducidos en Android 2.0 (Api 5) fue la nueva organización de los contactos y la superclase [ContactsContract](http://developer.android.com/reference/android/provider/ContactsContract.html) que permite acceder a los datos de la agenda desde diferentes puntos de vista.

El siguiente ejemplo ilustra uno de ellos. Se trata de crear una Activity que permita seleccionar un teléfono de la agenda para que sea utilizado por otra. Para ello hemos creado un ListActivity que mediante una consulta a la agenda obtiene el listado de teléfonos disponible junto con el nombre del contacto.

Cuando el usuario pulsa sobre uno de ellos, la actividad del selector se cierra devolviendo el número de teléfono elegido.

Lo primero es crear la actividad que se encargará de mostrar el listado. Para ello hemos usado un ListActivity que como adapter usa un SimpleCursorAdapter.

{% highlight java %}
/**
* Simple ActivityList to show the phones of our addressbook
*
* @author https://franchojoven.files.wordpress.com/2011/01/choose_a_phone_device1.png
*
*/
package org.francho.test.getphones;

import android.app.Activity;
import android.app.ListActivity;
import android.content.Intent;
import android.database.Cursor;
import android.os.Bundle;
import android.provider.ContactsContract.Data;
import android.provider.ContactsContract.CommonDataKinds.Phone;
import android.view.View;
import android.widget.ListAdapter;
import android.widget.ListView;
import android.widget.SimpleCursorAdapter;

public class ChoosePhoneActivity extends ListActivity {
/** Called when the activity is first created. */
@Override
public void onCreate(Bundle savedInstanceState) {
super.onCreate(savedInstanceState);
setContentView(R.layout.list);
setTitle("Choose a phone");

// Query: contacts with phone shorted by name
Cursor mCursor = getContentResolver().query(
Data.CONTENT_URI,
new String[] { Data._ID, Data.DISPLAY_NAME, Phone.NUMBER,
Phone.TYPE },
Data.MIMETYPE + "='" + Phone.CONTENT_ITEM_TYPE + "' AND "
+ Phone.NUMBER + " IS NOT NULL", null,
Data.DISPLAY_NAME + " ASC");

startManagingCursor(mCursor);

// Setup the list
ListAdapter adapter = new SimpleCursorAdapter(this, // context
android.R.layout.simple_list_item_2, // Layout for the rows
mCursor, // cursor
new String[] { Data.DISPLAY_NAME, Phone.NUMBER }, // cursor
// fields
new int[] { android.R.id.text1, android.R.id.text2 } // view
// fields
);
setListAdapter(adapter);
}

@Override
protected void onListItemClick(ListView l, View v, int position, long id) {
Intent result = new Intent();

// Get the data
Cursor c = (Cursor) getListAdapter().getItem(position);
int colIdx = c.getColumnIndex(Phone.NUMBER);
String phone = c.getString(colIdx);

// Save the phone to return it to the caller
result.putExtra("phone", phone);
setResult(Activity.RESULT_OK, result);

// Close this activity (return to caller)
finish();
}
}
{% endhighlight %}

Un ejemplo de Activity llamadora sería esta (el boton lanza el selector, y cuando este devuelve el teléfono lo muestra en un TextView)

{% highlight java %}
package org.francho.test.getphones;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.TextView;

public class MainActivity extends Activity implements OnClickListener {
private static final int REQUEST_CHOOSE_PHONE = 1;
private TextView vPhone;

@Override
protected void onCreate(Bundle savedInstanceState) {
super.onCreate(savedInstanceState);
setContentView(R.layout.main);

vPhone = (TextView) findViewById(R.id.TextView01);
findViewById(R.id.Button01).setOnClickListener(this);

}

@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
if ((requestCode == REQUEST_CHOOSE_PHONE)
&& (resultCode == Activity.RESULT_OK)) {
try {
String phone = data.getStringExtra("phone");
vPhone.setText(phone);
} catch (Exception e) {
e.printStackTrace();
}
}
}

public void onClick(View v) {
Intent intent = new Intent("org.francho.CHOOSE_PHONE");
startActivityForResult(intent, REQUEST_CHOOSE_PHONE);
}
}
{% endhighlight %}

En el AndroidManifest.xml hemos definido las dos Activity, creando un filtro para simplificar la llamada al intent del listado. Además al listado también le hemos aplicado el estilo de Dialog, para que tenga el efecto visual de ventana flotante.
No debemos olvidarnos de dar permiso para leer los contactos.

{% highlight xml %}
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
					package="org.francho.test.getphones" android:versionCode="1"
					android:versionName="1.0">
	<application android:icon="@drawable/icon" android:label="@string/app_name">
		<activity android:name=".MainActivity" android:label="@string/app_name">
			<intent-filter>
				<action android:name="android.intent.action.MAIN" />
				<category android:name="android.intent.category.LAUNCHER" />
			</intent-filter>
		</activity>

		<activity android:name=".ChoosePhoneActivity" android:label="@string/app_name"
							android:theme="@android:style/Theme.Dialog">
			<intent-filter>
				<action android:name="org.francho.CHOOSE_PHONE" />
				<category android:name="android.intent.category.DEFAULT" />
			</intent-filter>
		</activity>
	</application>

	<uses-permission android:name="android.permission.READ_CONTACTS" />
	<uses-sdk android:minSdkVersion="5"></uses-sdk>
</manifest>
{% endhighlight %}

Los layouts utilizados:

main.xml
{% highlight xml %}
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
							android:orientation="vertical"
							android:layout_width="fill_parent"
							android:layout_height="fill_parent" android:gravity="center_vertical|center_horizontal">

	<TextView android:layout_height="wrap_content" android:layout_width="wrap_content" android:text="@+id/TextView01" android:id="@+id/TextView01"></TextView><Button android:id="@+id/Button01" android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="Choose Phone"></Button>

</LinearLayout>
{% endhighlight %}
list.xml
{% highlight xml %}
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
							android:orientation="vertical"
							android:layout_width="fill_parent"
							android:layout_height="fill_parent"
	>
	<ListView
		android:id="@android:id/list"
		android:layout_width="fill_parent"
		android:layout_height="wrap_content" />

	<TextView
		android:id="@android:id/empty"
		android:layout_width="fill_parent"
		android:layout_height="fill_parent"
		android:text="no se han encontrado registros" />
</LinearLayout>

{% endhighlight %}
