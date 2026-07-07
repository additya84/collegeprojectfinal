FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["BCA-Hub/backend/BCAHubAPI/BCAHubAPI.csproj", "BCA-Hub/backend/BCAHubAPI/"]
RUN dotnet restore "BCA-Hub/backend/BCAHubAPI/BCAHubAPI.csproj"

COPY . .
RUN dotnet publish "BCA-Hub/backend/BCAHubAPI/BCAHubAPI.csproj" --no-restore -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "BCAHubAPI.dll"]
