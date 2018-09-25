
## Installation


`https://github.com/alekssakovsky/pdf-digital-signature.git`


## Prerequisites
 

    
 * [phantomjs](https://www.npmjs.com/package/phantom)
 
   ` npm install -g phantomjs`
 
 * [casperjs](https://www.npmjs.com/package/casperjs)
  
   `$ npm install -g casperjs`

 * [python](https://www.python.org/)

    https://www.python.org/downloads/
    
 * [Java SE Runtime Environment](https://www.oracle.com/technetwork/java/javase/downloads/jre8-downloads-2133155.html)
    
    https://www.oracle.com/technetwork/java/javase/downloads/jre8-downloads-2133155.html
 
 _for this dependencies needs write **PATH**_
    
 _Examples:_
       
     
         ...npm\node_modules\phantomjs\bin
    
         ...npm\node_modules\casperjs\bin
         
         ...Python\Python37-32\
         
         %JAVA_PATH%\bin
    
 _User value example:_
    
         JAVA_HOME C:\Program Files\Java\jdk1.8.0_111
         
 
 ## Configurations
         
 
For works application you must also install MySql and loads dump in `./DB model`

You also need to fill out the configuration files:

   * `./config/db-data.json`:
   
         "host": "localhost",
         "user": "root",
         "password": "root",
         "database": "pdfsign",
         "port": 3306
          
   * `./config/mailgun.json`:
   
         "API_KEY": "2342342342342342eweff3",
         "DOMAIN": "some.com",
         "API_base_URL": "https://api.mailgun.net/v3/some.com",
         "SMTP_hostname":  "smtp.mailgun.org",
         "SMTP_login": "some@some.com",
         "TO": "some@gmail.com, some@mail.ru"
     
   * `./config/S3.json`:
   
         "accessKeyId": "ALSDDASDASDASDASD",
         "secretAccessKey": "asdasdasdasdasddgdfgdfgdg",
         "bucketName": "my-bucket",
         "region": "us-east-1"


configs:
cron
email
google credentials
pdf
paths
sing