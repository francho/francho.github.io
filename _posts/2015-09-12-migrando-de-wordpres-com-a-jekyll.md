---
layout: post
title:  "De wordpress.com a Github pages (hola Jekyll)"
date:   2015-09-12 15:52:36
---
![migrar wordpress.com a jekyll](/assets/wp-to-jekyll.png)

Desde que empecé este blog (¡hace 9 años!) he estado usando Wordpress para gestionarlo, primero en una instalación propia y luego desde el hosting de [Wordpress.com](http://wordpress.com)

La verdad es que siempre he pensado que es un gran CMS, pero en los últimos tiempos he estado filtreando con [Jekyll](https://jekyllrb.com/) y me ha gustado bastante. El saber que [Github pages](https://pages.github.com/) lo soporta ha terminado de convencerme de mover este blog de Wordpress.com a Github

Por si no lo conoces Jekyll es un gestor de páginas web basado en Ruby. No necesita bases de datos, ya que está pensado para generar el sitio estático a partir de plantillas y ficheros de texto, markdown, html...

##La migración

Creia que iba a ser mucho mas complicada, pero al final ha sido mucho más sencilla de lo que pensaba.

1. Cree el proyecto [francho.github.io](https://github.com/francho/francho.github.io) en Github
2. Primero exporté todo el contenido de WP a través del panel de administración
3. Procesé el fichero XML siguiendo [las instrucciones](http://import.jekyllrb.com/docs/wordpressdotcom/), esto me generó los ficheros de los posts y me descargó las imagenes que usaban (OJO: no descarga las que estan en los pots como galerías, estas hay que descargarlas a mano)
4. Elegí y tunee un tema (hay [muchos disponibles](http://jekyllthemes.org/)), yo en concreto he usado el tema [Personal](https://github.com/PanosSakkos/personal-jekyll-theme)
5. [Importé a disqus](https://help.disqus.com/customer/portal/articles/466255-importing-comments-from-wordpress) el mismo fichero XML. La plantilla ya venía preparada para mostrar los comentarios de disqus en los posts (sí que no tuve que ajustar nada)
6. Configuré un Google Analytics para gestionar las estadísticas (otra de las cosas que traía WP)
7. Basándome en [este post](http://codingtips.kanishkkunal.in/share-buttons-jekyll/), cree unos botones sencillos para dar la opción de compartir sin tener que meter mas js
8. Con un editor busqué y reemplacé los tags que usaba para iluminar texto o poner vídeos de youtube
9. Me aseguré de ajustar el config.yml, crear los ficheros necesarios y alguna redirección (con [jekyll-redirect-from](https://github.com/jekyll/jekyll-redirect-from)) para no perder las urls que ya tenía indexadas.
10. Conloqué un [fichero CNAME](https://help.github.com/articles/adding-a-cname-file-to-your-repository/) en la raiz del proyecto y edité los DNS para que apuntaran a Github y ponerlo en producción
11. Poco a poco voy revisando los posts anteriores y los voy convirtiendo a markdown usando una [herramienta online](http://domchristie.github.io/to-markdown/)
12. He instalado la gema html-proofer y he configurado travis para que la pase cada vez que haya un commit

_Actualización 16/9/2015_

Gracias a travis he detectado que algunos posts cambiaban de url (día arriba, día abajo). El problema era que tenían la fecha muy cerca de las 00:00 con un offset de tiempo. Lo [he solucionado simplificando la fecha de estos posts](https://github.com/francho/francho.github.io/commit/825740fa5cbcd11b1404082320fbc10123e5c48c)

##Conclusión

Todavía me quedan algunos ajustes, pero la verdad es que estoy muy contento con el cambio. Comparando los pros y contras la balanza claramente se inclina a los pros:

**Contras**

- De momento no puedo programar los posts (no he investigado esto todavía)
- Cuando se publica un post no se notifica automáticamente a twitter (también está en mi lista de pendientes)

**Pros**

- Me gusta mucho Jekyll, es muy potente.
- Me gusta escribir los posts en markdown... sin distracciones
- He recuperado el control de mi sitio (en wordpress.com, ciertas cosas como plugins o personalizaciones del tema están limitadas)
- Mi web parece mucho más moderna
- Me gusta usar Github como servidor del sitio. 
- Me gusta tener mi web personal bajo un control de versiones, que mejor CMS que este ;) 
- Me gusta poder supervisar los despliegues con un servidor de integración contínua
- Me gusta usar Disqus para los comentarios, creo que puede ayudar a crear mas discusión alrededor de los posts
- Al ser estática, la web va mucho más rápida y no está sujeta a caidas de bbdd
- Github pages es gratuito así que me ahorraré un dinerillo que usaré para pillarme una cuenta pro de github
 
Y lo mejor de todo, ya no tengo la sensación de estar matando moscas a cañonazos :)
