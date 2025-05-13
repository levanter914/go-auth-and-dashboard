package graph

import (
	"fmt"
	"github.com/jung-kurt/gofpdf"
	"github.com/levanter914/login-page/backend/graph/model"
	"log"
	//"os"
)

// GenerateBillPDF generates a PDF for the bill and saves it to the provided path.
func GenerateBillPDF(bill *model.Bill, outputPath string) error {

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
	pdf.Cell(40, 10, fmt.Sprintf("Company: %s", bill.Company))
	pdf.Ln(10)

	// Total Amount
	pdf.Cell(40, 10, fmt.Sprintf("Total Amount: ₹%.2f", bill.TotalAmount))
	pdf.Ln(10)

	// Date of Creation
	pdf.Cell(40, 10, fmt.Sprintf("Created At: %s", bill.CreatedAt))
	pdf.Ln(10)

	// Add additional bill details as needed
	// For example, line items, tax, etc.

	// Output the PDF to a file
	err := pdf.OutputFileAndClose(outputPath)
	if err != nil {
		log.Printf("Error generating PDF: %s", err)
		return err
	}

	// Return nil if everything went fine
	return nil
}
