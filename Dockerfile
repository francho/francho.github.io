FROM jekyll/jekyll:stable
MAINTAINER Francho Joven <pub@francho.org>
COPY . /srv/jekyll
CMD jekyll s
