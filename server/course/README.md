## course service

### Directory Structory
```shell
.
├── data
│   ├── courses
│   └── templates     
├── model
│   ├── code.js    
│   ├── course.js       
│   ├── doc.js
│   ├── template.js 
│   └── tests.js   
├── routes
│   ├── chapter.js    
│   ├── code.js       
│   ├── course.js
│   ├── section.js 
│   ├── template.js 
│   └── tests.js  
├── app.js
├── migrate.js
├── mysql.js
└── README.md

```

### core modules


db.templatemetas.insert({name:'Node.js v8.9', desc:'Node.js 8.9', docker_image:'template:1', Dockerfile:"FROM node:8.9 \n RUN npm install -g mocha \n RUN mkdir /app"})