package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/joho/godotenv"
	"github.com/levanter914/login-page/backend/graph"
	"github.com/levanter914/login-page/backend/graph/repo"
	"github.com/rs/cors"
)

const defaultPort = "8080"

func init() {
	// Load .env.local file
	err := godotenv.Load(".env.local")
	if err != nil {
		log.Println("No .env.local file found or failed to load")
	}

	// Initialize the database
	graph.InitDB()
}

func main() {
	// Get port from environment variables or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	// Initialize GraphQL Resolver with BillRepo
	resolver := &graph.Resolver{
		BillRepo:    &repo.BillRepo{DB: graph.DB},
		UserRepo:    &repo.UserRepo{DB: graph.DB},
		BillItem:    &repo.BillItem{DB: graph.DB},
		PaymentRepo: &repo.PaymentRepo{DB: graph.DB},
		
	}

	// Create the GraphQL server with the resolver
	srv := handler.New(graph.NewExecutableSchema(graph.Config{Resolvers: resolver}))
	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})
	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{Cache: lru.New[string](100)})

	// Define the /login handler
	loginHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
			return
		}
		var creds struct {
			Username string `json:"username"`
			Password string `json:"password"`
		}
		if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		// Dummy auth logic
		if creds.Username == "admin" && creds.Password == "password" {
			json.NewEncoder(w).Encode(map[string]string{"message": "Login successful"})
		} else {
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		}
	})

	// Set up CORS middleware
	corsMiddleware := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"}, // Allowed frontend URL
		AllowCredentials: true,
		AllowedMethods:   []string{"POST", "GET", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
	}).Handler

	// Serve static files with CORS headers
	pdfHandler := http.StripPrefix("/pdf/", http.FileServer(http.Dir("./static/pdfs")))
	http.Handle("/pdf/", corsMiddleware(pdfHandler))

	// Apply handlers
	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", corsMiddleware(srv))          // Apply CORS middleware to GraphQL endpoint
	http.Handle("/login", corsMiddleware(loginHandler)) // Apply CORS middleware to /login endpoint

	log.Printf("Server started on http://localhost:%s/", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
