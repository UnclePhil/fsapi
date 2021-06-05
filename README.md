# Docker fsapi  (read: Cross feed)
rest api to create dir in nfs volume

because you need to create directory first in nfs mount to connect it as docker volume 

## (re)author
Ph. Koenig - UnclePhil

Made in Belgium, Europe, Earth 
- http://tc.unclephil.net
- ph.koenig@koenig.ph


## Usage

use  https://hub.docker.com/repository/docker/unclephil/fsapi 
```
docker pull unclephil/fsapi
```
or clone this repo and build it on your infra

### Examples
* docker-compose-yml for single docker 
* docker-stack.yml for swarm cluster 

### Environment variable
* FSAPI_ACTFS    : the internal dir representing the nfs
* FSAPI_PORT     : Server listen port (default 8000) 


### Endpoints

* /        : return info on container (health) 
* /ls/:dir : return the contents of dir
* /ex/:dir : check if dir exist 200:0O 404:NOK
* /md/:dir : create dir 

## Todo
* Theming 
  * more than 1 theme by default
  * ability to add personalized theme through volume mount or config
* Evolution to ingress and proxy front-end 
  * caddy combination maybe ?? ) 
  * inner frame (cf home-assistant front-end)
* Ability to show more than the local feed  (master mode)
  * other xfeeder
  * static json
* more environment dynamic
   no need to refresh to have the last list 