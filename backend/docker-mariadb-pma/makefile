#!make
include .env
export $(shell sed 's/=.*//' .env)

clean: stop
	@printf "\033[0;32m>>> Cleaning up database data\033[0m\n"
	docker volume rm ${PROJECT}_mariadb-data

export:
	@printf "\033[0;32m>>> Dumping MariaDB database\033[0m\n"
	@if [ -z "$${PROJECT}" ]; then echo "Error: PROJECT variable not set"; exit 1; fi
	docker exec -it $${PROJECT}-mariadb mysqldump \
		--user=$${MARIADB_USER:-$${PROJECT}} \
		--password=$${MARIADB_PASSWORD:-$${PROJECT}} \
		--no-data \
		$${MARIADB_DATABASE:-$${PROJECT}} > mariadb/fixtures/$${MARIADB_DATABASE:-$${PROJECT}}.sql
	docker exec -it $${PROJECT}-mariadb mysqldump \
		--user=$${MARIADB_USER:-$${PROJECT}} \
		--password=$${MARIADB_PASSWORD:-$${PROJECT}} \
		--no-create-info \
		$${MARIADB_DATABASE:-$${PROJECT}} | awk '{gsub(/\),/, "&\n")}1' | awk '{gsub(/ VALUES /, " VALUES\n")}1' \
		>> mariadb/fixtures/$${MARIADB_DATABASE:-$${PROJECT}}.sql
	gzip -k mariadb/fixtures/$${MARIADB_DATABASE:-$${PROJECT}}.sql
	rm mariadb/fixtures/$${MARIADB_DATABASE:-$${PROJECT}}.sql

start:
	@printf "\033[0;32m>>> Starting local services\033[0m\n"
	docker compose -p ${PROJECT} up -d

stop:
	@printf "\033[0;32m>>> Stopping local services\033[0m\n"
	docker compose -p ${PROJECT} down \
		--remove-orphans \
		--rmi local
