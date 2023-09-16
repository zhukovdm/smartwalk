FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

WORKDIR /opt/build/
COPY ./SmartWalk.Domain/*.csproj ./SmartWalk.Domain/
COPY ./WolfGarbe.PruningRadixTrie/PruningRadixTrie/*.csproj ./WolfGarbe.PruningRadixTrie/PruningRadixTrie/
COPY ./SmartWalk.Core/*.csproj ./SmartWalk.Core/
COPY ./SmartWalk.Infrastructure/*.csproj ./SmartWalk.Infrastructure/
COPY ./SmartWalk.Service/*.csproj ./SmartWalk.Service/
COPY ./SmartWalk.Api/*.csproj ./SmartWalk.Api/

WORKDIR /opt/build/SmartWalk.Api/
RUN dotnet restore --use-current-runtime

WORKDIR /opt/build/
COPY ./SmartWalk.Domain/. ./SmartWalk.Domain/
COPY ./WolfGarbe.PruningRadixTrie/PruningRadixTrie/. ./WolfGarbe.PruningRadixTrie/PruningRadixTrie/
COPY ./SmartWalk.Core/. ./SmartWalk.Core/
COPY ./SmartWalk.Infrastructure/. ./SmartWalk.Infrastructure/
COPY ./SmartWalk.Service/. ./SmartWalk.Service/
COPY ./SmartWalk.Api/. ./SmartWalk.Api/

WORKDIR /opt/build/SmartWalk.Api/
RUN dotnet publish --use-current-runtime --self-contained false --no-restore -o /opt/app/

FROM mcr.microsoft.com/dotnet/aspnet:6.0

ENV ASPNETCORE_URLS=""
RUN apt-get update ; apt-get -y install wget

WORKDIR /opt/app/
COPY --from=build /opt/app/ ./

ENTRYPOINT ["dotnet", "SmartWalk.Api.dll"]

EXPOSE 80
