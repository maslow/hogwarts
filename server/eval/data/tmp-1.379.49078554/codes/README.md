
### Installation
```sh
composer update
```
a
### Create Database
```sql
create database tech_job CHARACTER SET utf8 COLLATE utf8_unicode_ci;
```

### Import Tables
```sh
php yii migrate/up
```

### Run for development
```sh
php yii serve 127.0.0.1:8002
```

这样还不行吧