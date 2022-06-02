package main

import (
	"TPANK/graph"
	"TPANK/graph/authentication"
	"TPANK/graph/generated"
	"TPANK/postgre"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-pg/pg/v10"
	"log"
	"net/http"
	"os"
)

const defaultPort = "8080"

func main() {

	db := postgre.New(&pg.Options{
		Addr:     ":5432",
		User:     "postgres",
		Password: "tes",
		Database: "INsKagram",
	})

	db.AddQueryHook(postgre.DBLogger{})

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{
		DB: db,
	}}))

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", authentication.Middleware(db)(srv) )

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
