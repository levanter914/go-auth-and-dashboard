package graph

import (
	"context"
	"errors"
	"log"
	"golang.org/x/crypto/bcrypt"

	"github.com/levanter914/login-page/backend/graph/model"
	"github.com/levanter914/login-page/backend/graph/utils"
)

// Login is the resolver for the login field.
func (r *mutationResolver) Login(ctx context.Context, email string, password string) (*model.AuthPayload, error) {
	log.Printf("Received email: %s", email)

	// Query the database for the user
	row := DB.QueryRow("SELECT id, username, password FROM users WHERE email=$1", email)

	var id, username, hashedPassword string
	err := row.Scan(&id, &username, &hashedPassword)
	if err != nil {
		log.Printf("Error scanning user: %v", err)
		return nil, errors.New("user not found")
	}

	log.Printf("User found: %s", username)

	// Compare provided password with the hashed password from the database
	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	if err != nil {
		log.Printf("Password mismatch for email: %s", email)
		return nil, errors.New("invalid password")
	}

	// Create the user object
	user := &model.User{
		ID:    id,
		Email: email,
		Name:  &username,
	}

	// Generate JWT for the user
	signedToken, err := utils.GenerateJWT(user.ID)
	if err != nil {
		log.Printf("Error signing token: %v", err)
		return nil, errors.New("could not sign JWT")
	}

	return &model.AuthPayload{
		Token: signedToken,
		User:  user,
	}, nil
}

// Signup is the resolver for the signup field.
func (r *mutationResolver) Signup(ctx context.Context, input model.SignupInput) (*model.AuthPayload, error) {
	// Check if password is at least 6 characters
	if len(input.Password) < 6 {
		return nil, errors.New("password must be at least 6 characters")
	}

	// Check if the email is already in use
	var exists bool
	err := DB.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email=$1)", input.Email).Scan(&exists)
	if err != nil {
		return nil, errors.New("failed to check email")
	}
	if exists {
		return nil, errors.New("email already in use")
	}

	// Hash the password before saving it to the database
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("failed to hash password")
	}

	// Insert the user into the database
	_, err = DB.Exec("INSERT INTO users (username, email, password) VALUES ($1, $2, $3)", input.Name, input.Email, hashedPassword)
	if err != nil {
		return nil, errors.New("failed to create user")
	}

	// Retrieve the user ID
	var userID string
	err = DB.QueryRow("SELECT id FROM users WHERE email=$1", input.Email).Scan(&userID)
	if err != nil {
		return nil, errors.New("could not retrieve new user")
	}

	// Generate JWT token for the user
	token, err := utils.GenerateJWT(userID)
	if err != nil {
		return nil, errors.New("failed to sign JWT")
	}

	// Return the AuthPayload with token and user data
	return &model.AuthPayload{
		Token: token,
		User: &model.User{
			ID:    userID,
			Email: input.Email,
			Name:  &input.Name,
		},
	}, nil
}

// Me is the resolver for the me field.
func (r *queryResolver) Me(ctx context.Context) (*model.User, error) {
	// Check if the user is authenticated
	userID, ok := GetUserIDFromContext(ctx)
	if !ok {
		return nil, errors.New("unauthenticated")
	}

	if userID != "1" { // Change this to real user check logic
		return nil, errors.New("user not found")
	}

	// Return user info (change to real DB query)
	name := "John Doe"
	return &model.User{
		ID:    "1",
		Email: "user@example.com",
		Name:  &name,
	}, nil
}

// Mutation returns MutationResolver implementation.
func (r *Resolver) Mutation() MutationResolver { return &mutationResolver{r} }

// Query returns QueryResolver implementation.
func (r *Resolver) Query() QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
