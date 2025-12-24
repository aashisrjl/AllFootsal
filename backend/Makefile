# Makefile for running backend and database together
# import env vars from docker-mariadb-pma/.env
PROJECT ?= futsal
include docker-mariadb-pma/.env
export $(shell sed 's/=.*//' docker-mariadb-pma/.env)
export $(shell sed 's/=.*//' docker-mariadb-pma/.env)

up:
	@printf "\033[0;32m>>> Starting backend and database\033[0m\n"
	docker compose \
		-f docker-compose.yml \
		-f docker-mariadb-pma/docker-compose.yml \
		-p $${PROJECT:-futsal} up -d

down:
	@printf "\033[0;32m>>> Stopping backend and database\033[0m\n"
	docker compose \
		-f docker-compose.yml \
		-f docker-mariadb-pma/docker-compose.yml \
		-p $${PROJECT:-futsal} down

build:
	@printf "\033[0;32m>>> Building backend and database\033[0m\n"
	docker compose \
		-f docker-compose.yml \
		-f docker-mariadb-pma/docker-compose.yml \
		-p $${PROJECT:-futsal} build

restart:
	@printf "\033[0;32m>>> Restarting backend and database\033[0m\n"
	docker compose \
		-f docker-compose.yml \
		-f docker-mariadb-pma/docker-compose.yml \
		-p $${PROJECT:-futsal} restart

logs:
	@printf "\033[0;32m>>> Showing logs for backend and database\033[0m\n"
	docker compose \
		-f docker-compose.yml \
		-f docker-mariadb-pma/docker-compose.yml \
		-p $${PROJECT:-futsal} logs -f

clean:
	@printf "\033[0;32m>>> Cleaning up backend and database\033[0m\n"
	docker compose \
		-f docker-compose.yml \
		-f docker-mariadb-pma/docker-compose.yml \
		-p $${PROJECT:-futsal} down --volumes --rmi local

migrate:
	@printf "\033[0;32m>>> Running migrations for backend and database\033[0m\n"
	docker compose \
		-f docker-compose.yml \
		-f docker-mariadb-pma/docker-compose.yml \
		-p $${PROJECT:-futsal} run --rm --no-deps  backend npm run migrate

seed:
	@printf "\033[0;32m>>> Running seed for backend and database\033[0m\n"
	docker compose \
		-f docker-compose.yml \
		-f docker-mariadb-pma/docker-compose.yml \
		-p $${PROJECT:-futsal} run --rm --no-deps backend npm run seed

remove-db-volume:
	@printf "\033[0;32m>>> Removing database volume\033[0m\n"
	docker volume rm $${PROJECT:-futsal}_mariadb-data

remove-backend-volume:
	@printf "\033[0;32m>>> Removing backend volume\033[0m\n"
	docker volume rm $${PROJECT:-futsal}_backend-data

remove-volumes:
	@printf "\033[0;32m>>> Removing all volumes\033[0m\n"
	docker volume rm $${PROJECT:-futsal}_mariadb-data
	docker volume rm $${PROJECT:-futsal}_backend-data

remove-images:
	@printf "\033[0;32m>>> Removing all images\033[0m\n"
	docker rmi $${PROJECT:-futsal}_backend
	docker rmi $${PROJECT:-futsal}_mariadb-pma
	docker rmi mariadb:latest
	docker rmi phpmyadmin/phpmyadmin:latest
	docker rmi node:latest
	docker rmi nginx:latest
	docker rmi mariadb:latest

remove-all-images:
	@printf "\033[0;32m>>> Removing all images including dangling ones\033[0m\n"
	docker rmi $(docker images) || true