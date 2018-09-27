## How it's works


Scrips for a given period of time makes a query to the database,
3 times follows the links and makes a screen of three pages and saves it in one pdf file.
After that deletes the source files, adds a digital signature in the new file.
Uploads this file to AWS S3 service with "read all" permission and
sends an email with a link to the file.
After that in database (table history) makes entry with last id of customer.


## Installation order

1. ##### Download project:

    https://github.com/alekssakovsky/pdf-digital-signature.git

2. ##### Install Dependencies:

    2.1 [phantomjs](https://www.npmjs.com/package/phantom):
    
      * run:
   
        `npm install -g phantomjs`
   
      * for this dependencies needs write **PATH**:
    
        `...npm\node_modules\phantomjs\bin`
 
    2.2 [casperjs](https://www.npmjs.com/package/casperjs):
      
      * run:
         
        `$ npm install -g casperjs`
       
      * for this dependencies needs write **PATH**:
      
        `...npm\node_modules\casperjs\bin`
    
    2.3 [python](https://www.python.org/):
    
      * follow:
        
        https://www.python.org/downloads/
       
      * for this dependencies needs write **PATH** (installer can do it for you):
       
        `....Python\Python....\`
         
    2.4 [Java SE Runtime Environment](https://www.oracle.com/technetwork/java/javase/downloads/jre8-downloads-2133155.html):
        
      * follow:
        
        https://www.oracle.com/technetwork/java/javase/downloads/jre8-downloads-2133155.html
     
      * for this dependencies needs write **PATH** (installer can do it for you):
            
        `%JAVA_PATH%\bin`
        
      * user value (installer can do it for you):
        
        `JAVA_HOME C:\Program Files\Java\jdk....`
             
    2.5 For works application you must also install [MySql](https://dev.mysql.com/):
    
      * follow:
       
        https://dev.mysql.com/downloads/mysql/
     
      * and loads dump:
       
        `./DB model/dump.sql`
    
3. ##### Certificates:
 
    3.1 Certificate of `p12` type must be in directory `./certificates`, filename `server.p12`.
    
      * example:
 
        `./certificates/server.p12`
    
    3.2 Certificate password must be in directory `./certificates`, filename `pwd.pwd`.
     
      * example:

        `./certificates/pwd.pwd`

4. ##### Fill configuration files:
  
  You need to write in the configuration files right data:

   4.1 Database config file:
      
   * `./config/db-data.json`:
       
          
     "host": "localhost",
     "user": "root",
     "password": "root",
     "database": "pdfsign",
     "port": 3306
    
   4.2 Mail sender config file:
              
   * `./config/mailgun.json`:
   
   
     "API_KEY": "2342342342342342eweff3",
     "DOMAIN": "some.com",
     "API_base_URL": "https://api.mailgun.net/v3/some.com",
     "SMTP_hostname":  "smtp.mailgun.org",
     "SMTP_login": "some@some.com",
     "TO": "some@gmail.com, some@mail.ru"
   
   4.3 AWS config file:
     
   * `./config/S3.json`:
   
     
     "accessKeyId": "ALSDDASDASDASDASD",
     "secretAccessKey": "asdasdasdasdasddgdfgdfgdg",
     "bucketName": "my-bucket",
     "region": "us-east-1"
   
   4.4 If you want to configure launch script for a specific time
       you can write to `application.js` the value specified in the
       `./config/cron.json`. 

   * example:
   
    new CronJob(CRON_CONFIG.EVERY_MINUTE, () => {
 
   or 
   
    new CronJob(CRON_CONFIG.EVERY_30_MINUTES, () => {

   or
   
    new CronJob(CRON_CONFIG.EVERY_4_DAYS, () => { 

   or

    new CronJob(CRON_CONFIG.EVERY_1_WEEK, () => {
    
    
5. ##### Run Script:

 Run script by command:
 
    `node application.js