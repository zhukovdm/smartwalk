.PHONY: prod

database-dev:
	@cd ./infra && docker compose --env-file ./.env.development -f docker-compose.development.database.yaml up -d

database-dev-stop:
	@cd ./infra && docker compose --env-file ./.env.development -f docker-compose.development.database.yaml down

routing-dev:
	@cd ./infra && docker compose --env-file ./.env.development -f docker-compose.development.routing.yaml up -d

routing-dev-stop:
	@cd ./infra && docker compose --env-file ./.env.development -f docker-compose.development.routing.yaml down

backend-dev:
	@cd ./app/backend/SmartWalk.Api/ && dotnet run

frontend-dev:
	@cd ./app/frontend/ && npm start

prod:
	@cd ./infra && docker compose --env-file ./.env.production -f docker-compose.production.yaml up

prod-stop:
	@cd ./infra && docker compose --env-file ./.env.production -f docker-compose.production.yaml down
