---
layout: post
title: Mostrando datos de forma bonita
date: 2009-07-05 00:38:54.000000000 +02:00
status: publish
type: post
published: true
meta:
  _syntaxhighlighter_encoded: '1'
  _edit_last: '2'
author:
  login: francho

  display_name: francho
  first_name: ''
  last_name: ''
excerpt: !ruby/object:Hpricot::Doc
  options: {}
---
Google a través de su http://code.google.com/intl/es/apis/visualization/documentation/gadgetgallery.html Visualization API Gadget Gallery nos ofrece unas librerías JavaScript con las que podemos mostrar fácilmente los datos de una manera mucho mas amigable al usuarios.

Son ideales para aplicaciones de Business Intelligence. Como muestra un botón:

//

El código fuente del ejemplo (copiado de la documentación del API)

[javascript]
<script type="text/javascript" src="http://www.google.com/jsapi"></script>
<script type="text/javascript">
  // Load the Visualization API and the piechart package.  
  google.load('visualization', '1', {'packages':['piechart']});
  // Set a callback to run when the API is loaded.  
  google.setOnLoadCallback(drawChart);
  // Callback that creates and populates a data table,  
  // instantiates the pie chart, passes in the data and  
  // draws it.  
  function drawChart() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Task');
    data.addColumn('number', 'Hours per Day');
    data.addRows([
      ['Work', 11],
      ['Eat', 2],
      ['Commute', 2],
      ['Watch TV', 2],
      ['Sleep', 7]
    ]);
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, {width: 400, height: 240, is3D: true, title: 'My Daily Activities'});
  }
</script>
<div id="chart_div"></div>
[/javascript]
