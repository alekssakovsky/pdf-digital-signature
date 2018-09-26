## How it's works


Scrips for a given period of time makes a query to the database,
3 times follows the links and makes a screen of three pages and saves it in one pdf file.
After that deletes the source files, adds a digital signature in the new file.
Uploads this file to AWS S3 service with "read all" permission and
sends an email with a link to the file.
After that in database (table history) makes entry with last id of customer.


## Installation



`https://github.com/alekssakovsky/pdf-digital-signature.git`


## Prerequisites
 

    
 * [phantomjs](https://www.npmjs.com/package/phantom)
 
   ` npm install -g phantomjs`
   
   _for this dependencies needs write **PATH**:_
    
        ...npm\node_modules\phantomjs\bin
 
 
 * [casperjs](https://www.npmjs.com/package/casperjs)
  
   `$ npm install -g casperjs`
   
   _for this dependencies needs write **PATH**:_
   
       ...npm\node_modules\casperjs\bin

 
 * [python](https://www.python.org/)

    https://www.python.org/downloads/
    
   _for this dependencies needs write **PATH**:_
    
       ...Python\Python...\
    
    
 * [Java SE Runtime Environment](https://www.oracle.com/technetwork/java/javase/downloads/jre8-downloads-2133155.html)
    
    https://www.oracle.com/technetwork/java/javase/downloads/jre8-downloads-2133155.html
 
   _for this dependencies needs write **PATH**:_
         
       %JAVA_PATH%\bin
    
   _User value:_
    
       JAVA_HOME C:\Program Files\Java\jdk1.8.0_111
         
         
 * For works application you must also install [MySql](https://dev.mysql.com/):
 
   https://dev.mysql.com/downloads/mysql/
 
   and loads dump:
   
       ./DB model/dump.sql


 ## Configurations

      
 You need to write in the configuration files right data:

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

 If you want to configure launch script for a specific time
 you can write to `application.js` the value specified in the
 `./config/cron.json`. 

   _Example:_
   
    new CronJob(CRON_CONFIG.EVERY_MINUTE, () => {
 
or 
   
    new CronJob(CRON_CONFIG.EVERY_30_MINUTES, () => {

or
   
    new CronJob(CRON_CONFIG.EVERY_4_DAYS, () => { 

or

    new CronJob(CRON_CONFIG.EVERY_1_WEEK, () => {








