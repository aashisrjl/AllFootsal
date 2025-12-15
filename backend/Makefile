# Makefile for running backend and database together
import env vars from docker-mariadb-pma/.env
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