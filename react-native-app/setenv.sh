#!/bin/bash
ENV=$1
if [[ "$ENV" == "prod" || "$ENV" == "dev" ]]; then
    sed -i '' "s/^EXPO_PUBLIC_APP_ENV=.*/EXPO_PUBLIC_APP_ENV='$ENV' # set automatically by script on run/" .env 
else
    echo "Specify 'prod' or 'dev'"
fi
