package graph

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

import "github.com/levanter914/login-page/backend/graph/repo" 
type Resolver struct{
	BillRepo      *repo.BillRepo
	UserRepo      *repo.UserRepo
	BillItem  *repo.BillItem
	PaymentRepo   *repo.PaymentRepo
}
