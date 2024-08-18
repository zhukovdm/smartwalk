FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /opt/build/
COPY ./WolfGarbe.PruningRadixTrie/PruningRadixTrie/*.csproj ./WolfGarbe.PruningRadixTrie/PruningRadixTrie/
COPY ./SmartWalk.Core/*.csproj ./SmartWalk.Core/
COPY ./SmartWalk.Infrastructure/*.csproj ./SmartWalk.Infrastructure/
COPY ./SmartWalk.Application/*.csproj ./SmartWalk.Application/
COPY ./SmartWalk.Api/*.csproj ./SmartWalk.Api/

WORKDIR /opt/build/SmartWalk.Api/
RUN dotnet restore --use-current-runtime

WORKDIR /opt/build/
COPY ./WolfGarbe.PruningRadixTrie/PruningRadixTrie/. ./WolfGarbe.PruningRadixTrie/PruningRadixTrie/
COPY ./SmartWalk.Core/. ./SmartWalk.Core/
COPY ./SmartWalk.Infrastructure/. ./SmartWalk.Infrastructure/
COPY ./SmartWalk.Application/. ./SmartWalk.Application/
COPY ./SmartWalk.Api/. ./SmartWalk.Api/

WORKDIR /opt/build/SmartWalk.Api/
RUN dotnet publish --use-current-runtime --self-contained false --no-restore -o /opt/app/

FROM mcr.microsoft.com/dotnet/aspnet:8.0

RUN apt-get update ; apt-get -y install curl

WORKDIR /opt/app/
COPY --from=build /opt/app/ ./

ENTRYPOINT ["dotnet", "SmartWalk.Api.dll"]

EXPOSE 80
