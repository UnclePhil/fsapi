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
|method|url|description
|---|---|---
|GET | /   |return info on container (health) 
|GET | /ls/?dir=new/dir/list | return the contents of dir (only directories) 200:0K 404 NOK  
|GET | /ex/?dir=new/dir/list | check if dir exist 200:0O 404:NOK
|POST| /md/?dir=new/dir/list?token=thegood_mdtoken | create list in /new/dir  or the full path , if you have the good token 200:OK 403:not authorized 
|DELETE| /rm/?dir=new/dir/list?token=thegood_rmtoken | delete list in /new/dir,  if you have the good token 200:OK 403:not authorized 



## history
* 2021/06/06: transform rest in query param, add MDtoken
* 2021/06/01: create source full rest  mode


## Todo
* add rm dir & rm token
* add dir size calculation 
 
