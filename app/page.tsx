"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Download, Plus, Trash2, Loader2 } from "lucide-react"

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  price: number
}

interface InvoiceData {
  invoiceNumber: string
  issueDate: string
  dueDate: string
  fromCompany: string
  fromEmail: string
  fromPhone: string
  fromAddress: string
  fromCity: string
  fromVatId: string
  toCompany: string
  toEmail: string
  toPhone: string
  toAddress: string
  toCity: string
  toVatId: string
  items: InvoiceItem[]
  salesTax: number
  bankName: string
  accountNumber: string
  iban: string
  note: string
}

export default function InvoiceGenerator() {
  const [invoice, setInvoice] = useState<InvoiceData>({
    invoiceNumber: "INV-01",
    issueDate: "08/12/2024",
    dueDate: "08/12/2024",
    fromCompany: "Lost island AB",
    fromEmail: "Pontus@lostisland.com",
    fromPhone: "36182-4441",
    fromAddress: "Roslagsgatan 48",
    fromCity: "211 34 Stockholm, Sweden",
    fromVatId: "SE1246767676020",
    toCompany: "Acme inc",
    toEmail: "John.doe@acme.com",
    toPhone: "36182-4441",
    toAddress: "Street 56",
    toCity: "243 21 California, USA",
    toVatId: "SE1246767676020",
    items: [
      {
        id: "1",
        description: "Product design",
        quantity: 145,
        price: 1400,
      },
    ],
    salesTax: 2750,
    bankName: "Chase",
    accountNumber: "085629563",
    iban: "051511313434613131",
    note: "Thanks for great collaboration",
  })

  const [isDownloading, setIsDownloading] = useState(false)

  const updateField = (field: keyof InvoiceData, value: any) => {
    setInvoice((prev) => ({ ...prev, [field]: value }))
  }

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }))
  }

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "New item",
      quantity: 1,
      price: 0,
    }
    setInvoice((prev) => ({ ...prev, items: [...prev.items, newItem] }))
  }

  const removeItem = (id: string) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }))
  }

  const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  const total = subtotal + invoice.salesTax

  const downloadPDF = async () => {
    setIsDownloading(true)

    try {
      const html2canvas = (await import("html2canvas")).default
      const { jsPDF } = await import("jspdf")

      const invoiceElement = document.createElement("div")
      invoiceElement.style.fontFamily = "monospace"
      invoiceElement.style.backgroundColor = "#ffffff"
      invoiceElement.style.color = "#000000"
      invoiceElement.style.padding = "40px"
      invoiceElement.style.width = "800px"
      invoiceElement.style.position = "absolute"
      invoiceElement.style.left = "-9999px"

      invoiceElement.innerHTML = `
        <div style="font-family: monospace; line-height: 1.5; color: #000000;">
          <div style="width: 64px; height: 64px; background: #000000; margin-bottom: 48px; display: flex; align-items: center; justify-content: center;">
            <div style="width: 32px; height: 32px; background: #ffffff;"></div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 32px; margin-bottom: 48px;">
            <div><span style="color: #666666;">Invoice NO: </span>${invoice.invoiceNumber}</div>
            <div><span style="color: #666666;">Issue date: </span>${invoice.issueDate}</div>
            <div><span style="color: #666666;">Due date: </span>${invoice.dueDate}</div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 64px; margin-bottom: 64px;">
            <div>
              <h3 style="color: #666666; margin-bottom: 16px; font-size: 16px; font-weight: normal;">From</h3>
              <div style="margin-bottom: 4px;">${invoice.fromCompany}</div>
              <div style="margin-bottom: 4px;">${invoice.fromEmail}</div>
              <div style="margin-bottom: 4px;">${invoice.fromPhone}</div>
              <div style="margin-bottom: 4px;">${invoice.fromAddress}</div>
              <div style="margin-bottom: 4px;">${invoice.fromCity}</div>
              <div><span style="color: #666666;">VAT ID: </span>${invoice.fromVatId}</div>
            </div>
            <div>
              <h3 style="color: #666666; margin-bottom: 16px; font-size: 16px; font-weight: normal;">To</h3>
              <div style="margin-bottom: 4px;">${invoice.toCompany}</div>
              <div style="margin-bottom: 4px;">${invoice.toEmail}</div>
              <div style="margin-bottom: 4px;">${invoice.toPhone}</div>
              <div style="margin-bottom: 4px;">${invoice.toAddress}</div>
              <div style="margin-bottom: 4px;">${invoice.toCity}</div>
              <div><span style="color: #666666;">VAT ID: </span>${invoice.toVatId}</div>
            </div>
          </div>

          <div style="margin-bottom: 32px;">
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; margin-bottom: 16px; color: #666666;">
              <div>Item</div>
              <div>Quantity</div>
              <div>Price</div>
            </div>
            ${invoice.items
              .map(
                (item) => `
              <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; margin-bottom: 8px;">
                <div>${item.description}</div>
                <div>${item.quantity}</div>
                <div>$${item.price}</div>
              </div>
            `,
              )
              .join("")}
          </div>

          <div style="text-align: right; margin-bottom: 64px;">
            <div style="margin-bottom: 16px;"><span style="color: #666666;">Sales tax: </span>$${invoice.salesTax.toLocaleString()}</div>
            <div style="font-size: 24px; font-weight: bold;">Total: $${total.toLocaleString()}.00</div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 64px;">
            <div>
              <h3 style="color: #666666; margin-bottom: 16px; font-size: 16px; font-weight: normal;">Payment details</h3>
              <div style="margin-bottom: 4px;"><span style="color: #666666;">Bank: </span>${invoice.bankName}</div>
              <div style="margin-bottom: 4px;"><span style="color: #666666;">Account number: </span>${invoice.accountNumber}</div>
              <div><span style="color: #666666;">Iban: </span>${invoice.iban}</div>
            </div>
            <div>
              <h3 style="color: #666666; margin-bottom: 16px; font-size: 16px; font-weight: normal;">Note</h3>
              <div>${invoice.note}</div>
            </div>
          </div>
        </div>
      `

      document.body.appendChild(invoiceElement)

      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        ignoreElements: (element) => {
          return element.tagName === "STYLE" || element.tagName === "SCRIPT"
        },
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`invoice-${invoice.invoiceNumber}.pdf`)

      document.body.removeChild(invoiceElement)
    } catch (error) {
      console.error("PDF generation failed:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <div className="max-w-4xl mx-auto p-8">
        {/* Logo */}
        <div className="mb-12">
          <div className="w-16 h-16 bg-white flex items-center justify-center">
            <div className="w-8 h-8 bg-black"></div>
          </div>
        </div>

        {/* Invoice Header */}
        <div className="grid grid-cols-3 gap-8 mb-12">
          <div>
            <span className="text-gray-400">Invoice NO: </span>
            <Input
              value={invoice.invoiceNumber}
              onChange={(e) => updateField("invoiceNumber", e.target.value)}
              className="bg-transparent border-none p-0 text-white inline-block w-auto"
            />
          </div>
          <div>
            <span className="text-gray-400">Issue date: </span>
            <Input
              value={invoice.issueDate}
              onChange={(e) => updateField("issueDate", e.target.value)}
              className="bg-transparent border-none p-0 text-white inline-block w-auto"
            />
          </div>
          <div>
            <span className="text-gray-400">Due date: </span>
            <Input
              value={invoice.dueDate}
              onChange={(e) => updateField("dueDate", e.target.value)}
              className="bg-transparent border-none p-0 text-white inline-block w-auto"
            />
          </div>
        </div>

        {/* From/To Section */}
        <div className="mb-16">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <h3 className="text-gray-400 mb-4">From</h3>
              <div className="space-y-2">
                <Input
                  value={invoice.fromCompany}
                  onChange={(e) => updateField("fromCompany", e.target.value)}
                  className="bg-transparent border-none p-0 text-white"
                />
                <Input
                  value={invoice.fromEmail}
                  onChange={(e) => updateField("fromEmail", e.target.value)}
                  className="bg-transparent border-none p-0 text-white"
                />
                <Input
                  value={invoice.fromPhone}
                  onChange={(e) => updateField("fromPhone", e.target.value)}
                  className="bg-transparent border-none p-0 text-white"
                />
                <Input
                  value={invoice.fromAddress}
                  onChange={(e) => updateField("fromAddress", e.target.value)}
                  className="bg-transparent border-none p-0 text-white"
                />
                <Input
                  value={invoice.fromCity}
                  onChange={(e) => updateField("fromCity", e.target.value)}
                  className="bg-transparent border-none p-0 text-white"
                />
                <div>
                  <span className="text-gray-400">VAT ID: </span>
                  <Input
                    value={invoice.fromVatId}
                    onChange={(e) => updateField("fromVatId", e.target.value)}
                    className="bg-transparent border-none p-0 text-white inline-block w-auto"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-5 col-start-8">
              <h3 className="text-gray-400 mb-4">To</h3>
              <div className="space-y-2">
                <Input
                  value={invoice.toCompany}
                  onChange={(e) => updateField("toCompany", e.target.value)}
                  className="bg-transparent border-none p-0 text-white"
                />
                <Input
                  value={invoice.toEmail}
                  onChange={(e) => updateField("toEmail", e.target.value)}
                  className="bg-transparent border-none p-0 text-white"
                />
                <Input
                  value={invoice.toPhone}
                  onChange={(e) => updateField("toPhone", e.target.value)}
                  className="bg-transparent border-none p-0 text-white"
                />
                <Input
                  value={invoice.toAddress}
                  onChange={(e) => updateField("toAddress", e.target.value)}
                  className="bg-transparent border-none p-0 text-white"
                />
                <Input
                  value={invoice.toCity}
                  onChange={(e) => updateField("toCity", e.target.value)}
                  className="bg-transparent border-none p-0 text-white"
                />
                <div>
                  <span className="text-gray-400">VAT ID: </span>
                  <Input
                    value={invoice.toVatId}
                    onChange={(e) => updateField("toVatId", e.target.value)}
                    className="bg-transparent border-none p-0 text-white inline-block w-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <div className="grid grid-cols-12 gap-4 mb-4 text-gray-400">
            <div className="col-span-7">Item</div>
            <div className="col-span-2">Quantity</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-1"></div>
          </div>

          {invoice.items.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 mb-2 items-center">
              <div className="col-span-7">
                <Input
                  value={item.description}
                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  className="bg-transparent border-none p-0 text-white"
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                  className="bg-transparent border-none p-0 text-white"
                />
              </div>
              <div className="col-span-2">
                <div className="flex items-center">
                  <span className="mr-1">$</span>
                  <Input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(item.id, "price", Number.parseInt(e.target.value) || 0)}
                    className="bg-transparent border-none p-0 text-white"
                  />
                </div>
              </div>
              <div className="col-span-1">
                {invoice.items.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-white p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          <Button variant="ghost" onClick={addItem} className="text-gray-400 hover:text-white mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>

        {/* Totals */}
        <div className="mb-16">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-5 col-start-8 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Sales tax</span>
                <div className="flex items-center">
                  <span className="mr-1">$</span>
                  <Input
                    type="number"
                    value={invoice.salesTax}
                    onChange={(e) => updateField("salesTax", Number.parseInt(e.target.value) || 0)}
                    className="bg-transparent border-none p-0 text-white text-right w-20"
                  />
                </div>
              </div>
              <div className="flex justify-between text-2xl font-bold">
                <span>Total</span>
                <span>${total.toLocaleString()}.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details and Note */}
        <div className="mb-12">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <h3 className="text-gray-400 mb-4">Payment details</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-400">Bank: </span>
                  <Input
                    value={invoice.bankName}
                    onChange={(e) => updateField("bankName", e.target.value)}
                    className="bg-transparent border-none p-0 text-white inline-block w-auto"
                  />
                </div>
                <div>
                  <span className="text-gray-400">Account number: </span>
                  <Input
                    value={invoice.accountNumber}
                    onChange={(e) => updateField("accountNumber", e.target.value)}
                    className="bg-transparent border-none p-0 text-white inline-block w-auto"
                  />
                </div>
                <div>
                  <span className="text-gray-400">Iban: </span>
                  <Input
                    value={invoice.iban}
                    onChange={(e) => updateField("iban", e.target.value)}
                    className="bg-transparent border-none p-0 text-white inline-block w-auto"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-5 col-start-8">
              <h3 className="text-gray-400 mb-4">Note</h3>
              <Textarea
                value={invoice.note}
                onChange={(e) => updateField("note", e.target.value)}
                className="bg-transparent border-none p-0 text-white resize-none"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="flex justify-center">
          <Button
            onClick={downloadPDF}
            disabled={isDownloading}
            className="bg-white text-black hover:bg-gray-200 px-8 py-3 disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
