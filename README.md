# Docker fsapi  
Rest api to create dir in nfs volume

Because you need to create directory first in nfs mount to connect it as docker volume 



## Author
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
* docker run -d -v ${PWD}/toto:/mnt -e FSAPI_ACTFS=/mnt -e FSAPI_PORT=8000 unclephil/fsapi
* docker stack deploy -c exemple/docker-stack.yml 

### Environment variable
* FSAPI_ACTFS    : the internal dir representing the nfs
* FSAPI_PORT     : Server listen port (default 8000) 


### Endpoints

* /        : return info on container (health) 
* /ls/:dir : return the contents of dir
* /ex/:dir : check if dir exist 200:0O 404:NOK
* /md/:dir : create dir 

## Todo
* add subdir creation
* add token security feature
* add dir size calculation 
 