package graph

import (
	"context"
	"errors"
	"fmt"
	"github.com/levanter914/login-page/graph/generated"
	"github.com/levanter914/login-page/graph/model"
)

type Resolver struct{}

func (r *mutationResolver) Login(ctx context.Context, email string, password string) (*model.AuthPayload, error) {
	// Dummy user (in real case, check DB)
	if email != "user@example.com" || password != "password123" {
		return nil, errors.New("invalid credentials")
	}

	user := &model.User{
		ID:    "1",
		Email: "user@example.com",
		Name:  "John Doe",
	}

	// Dummy token
	return &model.AuthPayload{
		Token: "dummy-jwt-token",
		User:  user,
	}, nil
}

func (r *queryResolver) Me(ctx context.Context) (*model.User, error) {
	// This would typically extract from JWT
	return &model.User{
		ID:    "1",
		Email: "user@example.com",
		Name:  "John Doe",
	}, nil
}

// Bind resolvers to interfaces
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }
func (r *Resolver) Query() generated.QueryResolver       { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
