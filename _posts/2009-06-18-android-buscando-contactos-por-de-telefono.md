---
layout: post
title: 'Android: buscando contactos por de teléfono'
date: 2009-06-18 01:23:17.000000000 +02:00
tags:
- android
status: publish
type: post
published: true
meta:
  _syntaxhighlighter_encoded: '1'
  _edit_last: '2'
  reddit: a:2:{s:5:"count";i:0;s:4:"time";i:1413385938;}
author:
  login: francho

  display_name: francho
  first_name: ''
  last_name: ''
excerpt: !ruby/object:Hpricot::Doc
  options: {}
---
![android-buscatelefonos](/assets/android-buscatelefonos-189x300.jpg)
Esta es mi primera aplicación con Android. Se trata de un buscador de contactos a través de su número de teléfono.

Los contactos se van filtrando conforme se va tecleando el número de teléfono. Si pulsamos sobre un item del resultado se abrirá su ficha de contacto.

Con esta aplicación quería experimentar:

*   La estructura básica de un programa en Android
*   Comprension del AndroidManifest.xml
*   La creación de un interfaz a pelo (editando el XML directamente)
*   Cómo consultar datos de contactos (ManagedQuery)
*   Cómo mostar los resultados (uso de "Adapters")
*   Cómo enlazar mis resultados y las fichas de los contactos (Uso de Intent)
*   Captura y personalización de mensajes de error (AlertDialog)
*   Creación de aplicaciones multi-idioma (uso de "resources")

Consideraciones técnicas:

*   La aplicación debe tener permisos para acceder a la agenda (activar android.permission.READ_CONTACTS en AndroidManifest.xml)
*   Esta aplicación ha sido probada en SDK 1.5

[java]
/*
* Sencilla aplicación de Android que permite encontrar un contacto a través de su número de telefono
*
* @autor: http://francho.org/lab
*
* @License: http://creativecommons.org/licenses/by-sa/3.0/es/
*
*/
package org.francho.android.pruebas;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ContentUris;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.DialogInterface.OnClickListener;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.Contacts.People;
import android.view.KeyEvent;
import android.view.View;
import android.widget.AdapterView;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.SimpleCursorAdapter;
import android.widget.AdapterView.OnItemClickListener;

public class BuscaTlf extends Activity {
private EditText telefono;

/** Called when the activity is first created. */
@Override
public void onCreate(Bundle savedInstanceState) {
super.onCreate(savedInstanceState);
setContentView(R.layout.buscacontactos);

telefono = (EditText) findViewById(R.id.telefono);

// Conforme se va tecleando va buscando las coincidencias
telefono.setOnKeyListener(new View.OnKeyListener() {
@Override
public boolean onKey(View v, int keyCode, KeyEvent event) {
buscaTelefono(telefono.getText().toString());
return false;
}
});

}

public void buscaTelefono(String telefono) {
// Las columnas que queremos en el resultado
String[] projection = new String[] {
android.provider.Contacts.Phones._ID,
android.provider.Contacts.Phones.NAME,
android.provider.Contacts.Phones.NUMBER,
android.provider.Contacts.Phones.TYPE
};

ListView lista = (ListView) findViewById(R.id.listaRtdo);

// Ejecutamos la consulta
try {
Cursor datos = managedQuery(android.provider.Contacts.Phones.CONTENT_URI, // Uri de busqueda. Buscamos en todos los telefonos
projection, // Con que campos nos quedamos
android.provider.Contacts.Phones.NUMBER + " LIKE ? ", // Condición de búsqueda
new String[] { "%"+telefono+"%" } , // Parámetros de búsqueda
android.provider.Contacts.Phones.NAME + " ASC" // Orden de los resultados
);

/*
* Creamos un adaptador que enlazamos con la lista de resultados
* juntos se encargan de mostrar los resultados
*/
SimpleCursorAdapter adapter = new SimpleCursorAdapter(this,
android.R.layout.two_line_list_item, // Usamos un layout predefinido: dos lineas por resultado
datos, // Cursor que tiene los datos
new String[] {
android.provider.Contacts.Phones.NAME,
android.provider.Contacts.Phones.NUMBER,
}, // Campos a coger (From)
new int[] { android.R.id.text1, android.R.id.text2}); // Como los mostramos (To)

/* Sobreescribimos el evento click de los items.
* Cuando se pulse salte a la ficha del contacto
*/
lista.setOnItemClickListener(new OnItemClickListener() {
public void onItemClick(AdapterView<?> adapterView, View view, int position, long id) {
// Preparamos la Uri del contacto
Uri contactoUri = ContentUris.withAppendedId(People.CONTENT_URI, id);
// Abrimos su ficha
Intent i = new Intent(Intent.ACTION_VIEW,contactoUri);
startActivity(i);
}
});

// Todo listo, ala Android, apañatelas tu y muestra los resultados ;-)
lista.setAdapter(adapter);

} catch (Exception e) {
// Si algo falla mostramos en una ventana de dialogo el mensaje de error
new AlertDialog.Builder(this)
.setMessage(e.toString())
.setCancelable(false)
.setPositiveButton(R.string.terminar, new OnClickListener() {
@Override
public void onClick(DialogInterface dialog, int which) {
finish(); // Al pulsar sobre el boton la aplicacion se cerrará
}
})
.show();
}

}
}
[/java]
