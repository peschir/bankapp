#export sparkasse_password=<password>
#export sparkasse_username=<username>
sbt "run-main tools.imports.DBMigration"
