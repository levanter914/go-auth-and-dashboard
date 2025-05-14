package repo

import(
	"context"
"database/sql")
type UserRepo struct {
	DB *sql.DB
	FirstName   *string
	LastName    *string
	PhoneNumber *string
	Company     *string
}

func (r *UserRepo) GetProfileByUserID(ctx context.Context, userID int64) (*UserRepo, error) {
	query := `SELECT first_name, last_name, phone_number, company FROM user_profile WHERE id = $1`
	var up UserRepo
	err := r.DB.QueryRowContext(ctx, query, userID).Scan(&up.FirstName, &up.LastName, &up.PhoneNumber, &up.Company)
	return &up, err
}
