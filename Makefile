.PHONY: prod

database-dev:
	@cd ./infra && docker compose -f docker-compose.database.dev.yaml up -d

database-dev-stop:
	@cd ./infra && docker compose -f docker-compose.database.dev.yaml down

routing-dev:
	@cd ./infra && docker compose -f docker-compose.routing.dev.yaml up -d

routing-dev-stop:
	@cd ./infra && docker compose -f docker-compose.routing.dev.yaml down

backend-dev:
	@cd ./app/backend/SmartWalk.Api/ && dotnet run

frontend-dev:
	@cd ./app/frontend/ && npm start

prod:
	@cd ./infra && docker compose up

prod-stop:
	@cd ./infra && docker compose down
