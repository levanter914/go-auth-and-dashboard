query {
  getBillDetails(billID: 1) {
    billID
    createdAt
    billType
    notes
    subtotal
    tax
    discount
    total
    user {
      firstName
      company
    }
    items {
      description
      quantity
      unitPrice
      totalPrice
    }
    payment {
      amount
      method
      paidAt
    }
  }
}
