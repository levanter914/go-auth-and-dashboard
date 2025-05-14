package repo

import (
	"context"
	"database/sql"

	"github.com/levanter914/login-page/backend/graph/model"
)

type PaymentRepo struct {
	DB *sql.DB
}

func (r *PaymentRepo) GetByBillID(ctx context.Context, billID int) (*model.Payment, error) {
	row := r.DB.QueryRowContext(ctx, `
		SELECT amount, method, paid_at
		FROM payment
		WHERE bill_id = $1
	`, billID)

	var p model.Payment
	if err := row.Scan(&p.Amount, &p.Method, &p.PaidAt); err != nil {
		return nil, err
	}

	return &p, nil
}
