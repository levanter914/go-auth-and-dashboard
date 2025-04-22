package graph

import (
	"context"
	"errors"
	"fmt"
	"github.com/levanter914/login-backend.git/graph/model"
)

func (r *mutationResolver) Login(ctx context.Context, email string, password string) (*model.AuthPayload, error) {
	// Simulate credential check (replace with DB query)
	if email == "user@example.com" && password == "password123" {
		return &model.AuthPayload{
			Token:   "sample-jwt-token", // In real case, generate a JWT
			Message: "Login successful",
		}, nil
	}
	return nil, errors.New("invalid credentials")
}
