dev-infra-up:
	@docker compose -f docker-compose.dev.yaml up

dev-infra-down:
	@docker compose -f docker-compose.dev.yaml down

dev-backend:
	@cd ./app/backend/SmartWalk.Api/ && dotnet run

dev-frontend:
	@cd ./app/frontend/ && npm start
