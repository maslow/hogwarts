


docker run -d -v $(pwd):/app --name auth.hogwarts -w /app --link mysql.hogwarts node node app.js

docker run -d -v $(pwd)/course:/app --name course.hogwarts -w /app --link mysql.hogwarts node node app.js

docker run -d -v $(pwd)/job:/app --name job.hogwarts -w /app --link mysql.hogwarts node node app.js

docker run -d -v $(pwd)/gateway --name gateway.hogwarts -w /app --link auth.hogwarts --link course.hogwarts --link job.hogwarts node node app.js