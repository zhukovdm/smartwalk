infra-dev-up:
	@docker compose -f docker-compose.dev.yaml up

infra-dev-down:
	@docker compose -f docker-compose.dev.yaml down

backend-dev:
	@cd ./app/backend/SmartWalk.Api/ && dotnet run

frontend-dev:
	@cd ./app/frontend/ && npm start
