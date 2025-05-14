package repo

import (
	"context"
	"database/sql"

	"github.com/levanter914/login-page/backend/graph/model"
)

type BillRepo struct {
	DB *sql.DB
}

// Fetch bill data (excluding items/payment)
func (r *BillRepo) GetByID(ctx context.Context, billID int) (*model.BillDetails, error) {
	query := `
		SELECT 
			b.id, b.created_at, b.bill_type, b.notes, 
			b.subtotal, b.tax, b.discount, b.total,
			up.first_name, up.last_name, up.phone_number, up.company
		FROM bill b
		JOIN auth a ON b.user_id = a.id
		LEFT JOIN user_profile up ON up.id = a.id
		WHERE b.id = $1
	`

	var bill model.BillDetails
	var user model.UserProfile

	err := r.DB.QueryRowContext(ctx, query, billID).Scan(
		&bill.BillID, &bill.CreatedAt, &bill.BillType, &bill.Notes,
		&bill.Subtotal, &bill.Tax, &bill.Discount, &bill.Total,
		&user.FirstName, &user.LastName, &user.PhoneNumber, &user.Company,
	)

	if err != nil {
		return nil, err
	}

	bill.User = &user
	return &bill, nil
}
