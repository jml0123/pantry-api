#! /bin/bash

database="pantry_db"

echo "Configuring db: $database"

dropdb -U jsmglorenzo $database
createdb -U jsmglorenzo $database

psql -U jsmglorenzo $database < ./bin/sql/pantry_db.sql

echo "$database configured"