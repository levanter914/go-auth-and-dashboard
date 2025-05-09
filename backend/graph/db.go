package graph

import (
	"database/sql"
	"log"
	"os"
	_ "github.com/lib/pq"
)

var DB *sql.DB

func InitDB() {

	connStr := os.Getenv("DATABASE_URL")
	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Error connecting to database: ", err)
	}

	err = DB.Ping()
	if err != nil {
		log.Fatal("Cannot reach DB: ", err)
	}
	log.Println("Connecting to database:", os.Getenv("DATABASE_URL"))

	log.Println("Database connected successfully.")
}
