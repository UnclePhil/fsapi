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
* docker run -d -v ${PWD}/toto:/mnt -v ./config/config.js:/app/config/config.js unclephil/fsapi
* docker stack deploy -c exemple/docker-stack.yml, you can use a swarm secret to replace ./config/config.js  


## Endpoints
|method|curl sample|description
|---|---|---
|GET | curl --request GET --url http://localhost:8000/new/dir/list  | return the contents of directory /new/dir/list (only directories) 200:0K 404 NOK  
|POST| curl --request POST --url http://localhost:8000/new/dir/list --header 'token: GoodTokenMD' | create /new/dir/list and full path if needed, if you have the good token 200:OK 403:not authorized 
|DELETE| curl --request DELETE --url http://localhost:8000/new/dir --header 'token: GoodTokenRM' | remove /new/dir and all it's contents, if you have the good token 200:OK 403:not authorized

### tips
You cannot remove the root dir  (/)  


## History
* 2022/11/24  V:2.0.1
  * remove Env Var, change into config file
  * allow mode in directory creation (default: 0777)
  * add token for create and delete operation

* 2021/06/30: :V:1.0.0
 * real rest format
 * remove "infos" (for the moment)
 * remove "exist" , ls reply 200 if exist 

* 2021/06/06: 
 * transform rest in query param, add MDtoken
 * add rm dir & rm token
 * transform ENV var in config file, for secret usage in swarm  

* 2021/06/01: 
 * create source bad rest mode


## Todo
* add dir size calculation 
