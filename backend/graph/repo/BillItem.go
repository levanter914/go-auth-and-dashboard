package repo

import (
	"github.com/levanter914/login-page/backend/graph/model"
	"database/sql"
	"context"
)
type BillItem struct {
	DB *sql.DB
}
func (r *BillItem) GetItemsByBillID(ctx context.Context, billID int) ([]*model.BillItem, error) {
	query := `SELECT description, quantity, unit_price, total_price FROM bill_item WHERE bill_id = $1`
	rows, err := r.DB.QueryContext(ctx, query, billID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []*model.BillItem
	for rows.Next() {
		var item model.BillItem
		err := rows.Scan(&item.Description, &item.Quantity, &item.UnitPrice, &item.TotalPrice)
		if err != nil {
			return nil, err
		}
		items = append(items, &item)
	}
	return items, nil
}
