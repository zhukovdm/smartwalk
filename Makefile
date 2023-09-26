.PHONY: prod

database-dev:
	@cd ./infra && docker compose -f docker-compose.dev.database.yaml up -d

database-dev-stop:
	@cd ./infra && docker compose -f docker-compose.dev.database.yaml down

routing-dev:
	@cd ./infra && docker compose -f docker-compose.dev.routing.yaml up -d

routing-dev-stop:
	@cd ./infra && docker compose -f docker-compose.dev.routing.yaml down

backend-dev:
	@cd ./app/backend/SmartWalk.Api/ && dotnet run

frontend-dev:
	@cd ./app/frontend/ && npm start

prod:
	@cd ./infra && docker compose -f docker-compose.prod.yaml up

prod-stop:
	@cd ./infra && docker compose -f docker-compose.prod.yaml down
