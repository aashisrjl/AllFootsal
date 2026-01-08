# Phpmyadmin and Mariadb using docker 

## Clone  docker-mariadb-pma
```bash
git@github.com:DeepakAryal/docker-mariadb-pma.git
```

### Copy `.env.example` to `.env` and update the environment variables as appropriate.

```bash
cp .env.example .env
```

### Setup the database variables in .env if you want to replace default values. By default project name will be same as database all environment variables

```
MARIADB_DATABASE=
MARIADB_PASSWORD=
MARIADB_ROOT_PASSWORD=
MARIADB_USER=
```

You can find and replace PROJECT with your project name.

### Start container
```bash
make start
```

This will create a docker container for phpmyadmin and mariadb

### See running containers
```bash
docker ps
```

### Stop container
```bash
make stop
```
