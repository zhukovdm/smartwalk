database-dev:
	@cd ./infra && docker compose -f docker-compose.database.dev.yaml up -d

database-dev-stop:
	@cd ./infra && docker compose -f docker-compose.database.dev.yaml down

routing-engine-dev:
	@cd ./infra && docker compose -f docker-compose.routing-engine.dev.yaml up -d

routing-engine-dev-stop:
	@cd ./infra && docker compose -f docker-compose.routing-engine.dev.yaml down

backend-dev:
	@cd ./app/backend/SmartWalk.Api/ && dotnet run

frontend-dev:
	@cd ./app/frontend/ && npm start
