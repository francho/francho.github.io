---
layout: post
title:  "Escribiendo buenos mensajes de commit"
date:   2015-09-25 9:00
---
![github branches](/assets/branches.png)

Una de las ventajas del pair programming es que se te acaban pegando los buenos vicios del compañero. Cuando empezamos con [Spines](http://spines.me), [@leptom](https://twitter.com/leptom) era muy estricto con los commits: hacía varios commits donde yo hubiera hecho uno solo y pensaba mucho el texto del mensaje. 
Con el paso del tiempo entre todo el equipo hemos ido perfeccionando una regla que cumplimos a rajatabla y que me recuerda mucho al [post que ha recomendado hoy @nestorsaceda](http://chris.beams.io/posts/git-commit/):

1. Haz commits atómicos
2. Escribe el mensaje del commit en inglés
3. Empieza en mayúsculas
4. Escribe en presente (me gusta la regla de completar esta frase:
_If applied, this commit will **your subject line here**_
5. El subject (la primera línea) no debe tener más de 50
6. Si es una issue añade [la coletilla con el id para que se cierre automáticamente en github](https://help.github.com/articles/closing-issues-via-commit-messages/)
7. Separado con una linea en blanco pon el enlace a la tarjeta de Trello en la que estas trabajando
8. Si es necesario, debajo del link, puedes poner alguna explicación extra

Con esto estamos consiguiendo un log del proyecto muy claro que da gusto leer.

Y tú ¿qué reglas usas para escribir tus commits?
