#!/bin/bash

# The WebApi project can be either C# or F#
lang="C#"

while getopts "h?n:o:f" opt; do
  case ${opt} in
    n ) name=$OPTARG;;
    o ) outputDir=$OPTARG;;
    f ) lang="F#";;
    h|\? ) 
      echo "Usage: cmd -n <name> [-f]"
      exit 0
      ;;
  esac
done

echo "Arguments: $name $lang $outputDir"

if [ -z "$name" ]
  then
    echo "Name is required. Set it with -n <name>"
    exit 1
fi

if [ -n "$outputDir" ]
  then
    echo "Switching to root $outputDir"
    cd $outputDir
fi

if test -d $name; then
  echo "Directory $name already exists."
  exit 1
fi

mkdir $name
cd $name
dotnet new sln

dotnet new classlib --name=Data
dotnet sln add Data

dotnet new webapi --name=WebApi -lang "$lang"
dotnet sln add WebApi

dotnet new xunit --name=WebApi.Tests -lang "$lang"
dotnet sln add WebApi.Tests

cd WebApi
dotnet add reference ../Data
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.AspNetCore.OData

cd ../WebApi.Tests
dotnet add reference ../WebApi

cd ../Data
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.EntityFrameworkCore.Sqlite

echo "Solution $name created"
