package pdfgen

import (
	"fmt"
	"github.com/jung-kurt/gofpdf"
	"github.com/levanter914/login-page/backend/graph/model"
	"log"
)

// GenerateBillPDF generates a PDF for the bill and saves it to the provided path.
func GenerateBillPDF(bill *model.BillDetails, outputPath string) error {

	// Initialize the PDF object
	pdf := gofpdf.New("P", "mm", "A4", "")

	// Add a page to the PDF
	pdf.AddPage()

	// Set font for the document (font, style, size)
	pdf.SetFont("Arial", "B", 16)

	// Title
	pdf.Cell(40, 10, fmt.Sprintf("Bill ID: %d", bill.BillID))
	pdf.Ln(10)

	// Company name
	pdf.Cell(40, 10, fmt.Sprintf("Company: %s", *bill.Company))
	pdf.Ln(10)

	// Bill Type
	pdf.Cell(40, 10, fmt.Sprintf("Bill Type: %s", bill.BillType))
	pdf.Ln(10)

	// Total Amount
	pdf.Cell(40, 10, fmt.Sprintf("Total Amount: ₹%.2f", bill.Total))
	pdf.Ln(10)

	// Subtotal, Tax, Discount
	pdf.Cell(40, 10, fmt.Sprintf("Subtotal: ₹%.2f", *bill.Subtotal))
	pdf.Ln(6)
	pdf.Cell(40, 10, fmt.Sprintf("Tax: ₹%.2f", *bill.Tax))
	pdf.Ln(6)
	pdf.Cell(40, 10, fmt.Sprintf("Discount: ₹%.2f", *bill.Discount))
	pdf.Ln(10)

	// Date of Creation
	pdf.Cell(40, 10, fmt.Sprintf("Created At: %s", bill.CreatedAt))
	pdf.Ln(10)

	// Print notes if they exist
	if bill.Notes != nil && *bill.Notes != "" {
		pdf.Cell(40, 10, fmt.Sprintf("Notes: %s", *bill.Notes))
		pdf.Ln(10)
	}

	// Print the items in the bill
	pdf.Ln(10)
	pdf.Cell(40, 10, "Items:")
	pdf.Ln(10)

	// Set a smaller font size for items
	pdf.SetFont("Arial", "", 12)

	// Loop through each item and print it
	for _, item := range bill.Items {
		pdf.Cell(40, 10, fmt.Sprintf("Description: %s", item.Description))
		pdf.Ln(6)
		pdf.Cell(40, 10, fmt.Sprintf("Quantity: %d", item.Quantity))
		pdf.Ln(6)
		pdf.Cell(40, 10, fmt.Sprintf("Unit Price: ₹%.2f", item.UnitPrice))
		pdf.Ln(6)
		pdf.Cell(40, 10, fmt.Sprintf("Total Price: ₹%.2f", item.TotalPrice))
		pdf.Ln(10)
	}

	// Payment details (if available)
	if bill.Payment != nil {
		pdf.Ln(10)
		pdf.Cell(40, 10, fmt.Sprintf("Payment Method: %s", bill.Payment.Method))
		pdf.Ln(6)
		pdf.Cell(40, 10, fmt.Sprintf("Paid Amount: ₹%.2f", bill.Payment.Amount))
		pdf.Ln(6)
		pdf.Cell(40, 10, fmt.Sprintf("Paid At: %s", bill.Payment.PaidAt))
		pdf.Ln(10)
	}

	// Output the PDF to a file
	err := pdf.OutputFileAndClose(outputPath)
	if err != nil {
		log.Printf("Error generating PDF: %s", err)
		return err
	}

	// Return nil if everything went fine
	return nil
}
