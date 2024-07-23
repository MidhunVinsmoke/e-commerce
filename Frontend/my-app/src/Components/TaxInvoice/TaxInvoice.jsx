import React, { useContext } from "react";
import "./TaxInvoice.css";
import { ShopContext } from "../../Context/ShopContext";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const TaxInvoice = () => {

  const { cartItems, all_product } = useContext(ShopContext);

  const calculateTotalPrice = (productId, quantity) => {
    const product = all_product.find((item) => item.id === productId);
    return product ? product.new_price * quantity : 0;
  };

  const calculateSubtotal = () => {
    let subtotal = 0;
    all_product.forEach((product) => {
      const quantity = cartItems[product.id] || 0;
      subtotal += calculateTotalPrice(product.id, quantity);
    });
    return subtotal;
  };

  const calculateTax = (subtotal) => {
    const taxRate = 0.1;
    return subtotal * taxRate;
  };

  const getTotalCartAmount = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    return subtotal + tax;
  };

  const generateInvoiceNumber = () => {
    return Math.floor(Math.random() * 1000000);
  };

  const handleDownloadPDF = () => {
    const invoiceElement = document.querySelector('.tax-invoice');
    html2canvas(invoiceElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice_${generateInvoiceNumber()}.pdf`);
    });
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const totalAmount = getTotalCartAmount();

  return (
    <div className="tax-invoice">
      <div className="invoice-header">
        <h1>Tax Invoice</h1>
        <p>Invoice Number: #{generateInvoiceNumber()}</p>
        <p>Date: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="invoice-customer-info">
        <h2>Customer Information</h2>
        <p>Name: John Doe</p>
        <p>Email: john.doe@example.com</p>
        <p>Address: 123 Main Street, City, Country</p>
      </div>

      <div className="invoice-items">
        <h2>Itemized List</h2>
        {all_product.map((product) => {
          const quantity = cartItems[product.id] || 0;
          const totalPrice = calculateTotalPrice(product.id, quantity);
          return quantity > 0 ? (
            <div key={product.id} className="invoice-item">
              <div className="item-details">
                <img src={product.image} alt={product.name} />
                <p>{product.name}</p>
              </div>
              <div className="item-price">
                <p>Price: ₹{product.new_price.toFixed(2)}</p>
                <p>Quantity: {quantity}</p>
                <p>Total: ₹{totalPrice.toFixed(2)}</p>
              </div>
            </div>
          ) : null;
        })}
      </div>

      <div className="invoice-summary">
        <h2>Summary of Charges</h2>
        <div className="summary-item">
          <p>Subtotal:</p>
          <p>₹{subtotal.toFixed(2)}</p>
        </div>
        <div className="summary-item">
          <p>GST (10%):</p>
          <p>₹{tax.toFixed(2)}</p>
        </div>
        <div className="summary-item">
          <h3>Order Total:</h3>
          <h3>₹{totalAmount.toFixed(2)}</h3>
        </div>
      </div>

      <div className="invoice-payment-info">
        <h2>Payment Information</h2>
        <p>Payment Method: Credit Card</p>
        <p>Transaction ID: 1234567890</p>
        <p>Payment Status: Paid</p>
      </div>

      <div className="invoice-footer">
        <h2>Thank You!</h2>
        <p>If you have any questions about this invoice, please contact us at support@example.com.</p>
      </div>

      <div className="invoice-download">
        <button onClick={handleDownloadPDF}>Download Invoice as PDF</button>
      </div>
    </div>
  );
};

export default TaxInvoice;