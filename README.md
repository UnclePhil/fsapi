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
* /ls/?dir=new/dir/list : return the contents of dir (only directories)
* /ex/?dir=?dir=new/dir/list : check if dir exist 200:0O 404:NOK
* /md/?dir?dir=new/dir/list?token=thegoodtoken : create dir, if you have the good token 200:OK 403:not authorized 

## Todo
* add rm dir
* add dir size calculation 
 